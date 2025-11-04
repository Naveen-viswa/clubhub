const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { verifyToken, requireAdmin, requireMember } = require('./middleware/authMiddleware');
const { success, error } = require('./utils/responseHelper');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Public routes (no auth required)
app.get('/', (req, res) => {
  success(res, {
    message: 'ClubHub API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      clubs: '/api/clubs',
      events: '/api/events',
      members: '/api/members'
    }
  });
});

app.get('/health', (req, res) => {
  success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test protected route - requires any authenticated user
app.get('/api/test/protected', verifyToken, (req, res) => {
  success(res, {
    message: 'You are authenticated!',
    user: req.user
  });
});

// Test admin route - requires Admin role
app.get('/api/test/admin', verifyToken, requireAdmin, (req, res) => {
  success(res, {
    message: 'You are an admin!',
    user: req.user
  });
});

// Test member route - requires Member, EventCoordinator, or Admin role
app.get('/api/test/member', verifyToken, requireMember, (req, res) => {
  success(res, {
    message: 'You are a member!',
    user: req.user
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/events', require('./routes/events'));


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  error(res, err.message || 'Internal Server Error', err.status || 500);
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🚀 ClubHub API Server Started');
  console.log(`📍 Listening on: http://localhost:${PORT}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('===========================================');
});
