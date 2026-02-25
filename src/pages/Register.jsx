import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { initiateRegister, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSubmitting(true);
    try {
      await initiateRegister(name, email, password);
      navigate('/verify-otp', { state: { name, email, password } });
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh', padding: '40px 20px' }}>
      <h1 className="title-large" style={{ marginBottom: '8px' }}>Create Account</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '40px' }}>Start splitting expenses today</p>

      {error && (
        <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError(); }}
            required
          />
        </div>

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
            placeholder="Create a password (min 6 chars)"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            minLength={6}
            required
          />
        </div>

        <button className="btn-primary" type="submit" disabled={submitting} style={{ marginTop: '24px' }}>
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <span style={{ color: 'var(--blue)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/login')}>
          Sign In
        </span>
      </p>
    </div>
  );
}
