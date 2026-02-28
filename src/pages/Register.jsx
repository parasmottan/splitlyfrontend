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
          Join the circle ✌️
        </h1>
        <p style={{ color: '#4B5563', fontSize: '17px', fontWeight: '500', marginBottom: '40px' }}>
          Start splitting expenses today.
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontSize: '15px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' }}>FULL NAME</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError(); }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' }}>EMAIL</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#374151', letterSpacing: '0.5px' }}>PASSWORD</label>
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

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

      </div>

      <p style={{ textAlign: 'center', fontSize: '15px', color: '#4B5563', fontWeight: '500', paddingBottom: '20px' }}>
        Already have an account?{' '}
        <span style={{ color: 'var(--blue)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/login')}>
          Sign in
        </span>
      </p>
    </div>
  );
}
