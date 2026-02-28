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
    <div className="page" style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '40px 24px',
      background: 'linear-gradient(160deg, #EAEBFF 0%, #D8E5FF 50%, #E2EDF8 100%)'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '50px', left: '20px', fontSize: '24px', color: '#111827' }}>
          &#8592;
        </button>

        <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px', color: '#111827', letterSpacing: '-0.5px' }}>
          Welcome back 😎
        </h1>
        <p style={{ color: '#4B5563', fontSize: '17px', fontWeight: '500', marginBottom: '40px' }}>
          Ready to clear some vibes?
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontSize: '15px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' }}>EMAIL</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' }}>PASSWORD</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <span style={{ color: 'var(--blue)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

      </div>

      <p style={{ textAlign: 'center', fontSize: '15px', color: '#4B5563', fontWeight: '500', paddingBottom: '20px' }}>
        Don't have an account?{' '}
        <span style={{ color: 'var(--blue)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/register')}>
          Sign up
        </span>
      </p>
    </div>
  );
}
