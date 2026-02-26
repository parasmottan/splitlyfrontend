import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/groups', { replace: true });
    } catch (err) {
      // error is set in store
    }
    setSubmitting(false);
  };

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh', padding: '40px 20px' }}>
      <h1 className="title-large" style={{ marginBottom: '8px' }}>Welcome back</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '40px' }}>Sign in to your account</p>

      {error && (
        <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '15px', lineHeight: '1.4' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError(); }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            required
          />
        </div>

        <button className="btn-primary" type="submit" disabled={submitting} style={{ marginTop: '24px' }}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <span style={{ color: 'var(--blue)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/register')}>
          Sign Up
        </span>
      </p>
    </div>
  );
}
