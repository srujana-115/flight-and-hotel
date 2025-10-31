
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Mail, Lock, AlertCircle } from 'lucide-react';
import './Pages.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Plane style={{height: '3rem', width: '3rem', color: '#2563eb'}} />
          </div>
          <h2 className="auth-title">Sign in to TravelEase</h2>
          <p className="mt-2" style={{fontSize: '0.875rem', color: '#6b7280'}}>
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {error && (
          <div className="error flex items-center">
            <AlertCircle style={{height: '1.25rem', width: '1.25rem', marginRight: '0.5rem'}} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
                <Mail style={{height: '1.25rem', width: '1.25rem', color: '#9ca3af'}} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                style={{paddingLeft: '2.5rem'}}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{position: 'relative'}}>
              <div style={{position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
                <Lock style={{height: '1.25rem', width: '1.25rem', color: '#9ca3af'}} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{paddingLeft: '2.5rem'}}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{width: '100%', display: 'flex', justifyContent: 'center', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="auth-link">
          <p>
            Don't have an account?{' '}
            <Link to="/register">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
