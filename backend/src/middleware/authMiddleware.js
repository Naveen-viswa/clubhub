const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const dotenv = require('dotenv');

dotenv.config();

// Configure JWKS client to fetch Cognito public keys
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

// Get signing key from Cognito
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Cognito
    jwt.verify(
      token,
      getKey,
      {
        issuer: process.env.COGNITO_ISSUER,
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          console.error('Token verification error:', err.message);
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
          });
        }

        // Attach user info to request
        req.user = {
          userId: decoded.sub,
          email: decoded.email,
          username: decoded['cognito:username'],
          groups: decoded['cognito:groups'] || []
        };

        next();
      }
    );
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

// Check if user has specific role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userGroups = req.user.groups || [];
    const hasRole = allowedRoles.some(role => userGroups.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

// Specific role checkers
const requireAdmin = requireRole('Admin');
const requireEventCoordinator = requireRole('Admin', 'Coordinator');
const requireMember = requireRole('Admin', 'Coordinator', 'Member');

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireEventCoordinator,
  requireMember
};
