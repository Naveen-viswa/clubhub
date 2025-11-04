import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import './Auth.css';

function Login({ onLoginSuccess, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isSignedIn, nextStep } = await signIn({ 
        username: email, 
        password 
      });
      
      if (isSignedIn) {
        onLoginSuccess();
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setError('Please verify your email before logging in.');
      } else if (nextStep.signInStep === 'RESET_PASSWORD') {
        setError('Password reset required. Please reset your password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to ClubHub</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@clubhub.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? 
          <button onClick={switchToSignup} className="link-button">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

