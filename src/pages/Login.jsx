import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: 'linear-gradient(155deg, #EBEDff 0%, #D9E0FF 30%, #C8D6FF 60%, #DDE6F8 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: '52px', left: '24px',
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: '#111827', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        ←
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 28px 24px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '10px', color: '#0F1130', letterSpacing: '-1px', lineHeight: '1.1' }}>
          Welcome back 😎
        </h1>
        <p style={{ color: '#555875', fontSize: '17px', fontWeight: '400', marginBottom: '44px' }}>
          Ready to clear some vibes?
        </p>

        {error && (
          <div style={{ background: 'rgba(255,59,48,0.1)', color: '#DC2626', padding: '14px 16px', borderRadius: '16px', marginBottom: '24px', fontSize: '15px', fontWeight: '500', border: '1px solid rgba(220,38,38,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555875', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>EMAIL</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                required
                style={{
                  width: '100%', padding: '16px 48px 16px 20px',
                  fontSize: '16px', background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  borderRadius: '18px', color: '#0F1130',
                  outline: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,71,245,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,71,245,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.7)'; e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
              />
              <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '18px' }}>✉</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#555875', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
                style={{
                  width: '100%', padding: '16px 48px 16px 20px',
                  fontSize: '16px', background: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(255,255,255,0.7)',
                  borderRadius: '18px', color: '#0F1130',
                  outline: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,71,245,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,71,245,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.7)'; e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? '👁' : '🙈'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
            <span style={{ color: 'var(--blue)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', padding: '18px 24px',
              background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
              color: 'white', fontSize: '17px', fontWeight: '700',
              borderRadius: '100px', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
              transition: 'transform 120ms, opacity 120ms',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', fontSize: '15px', color: '#555875', fontWeight: '500', padding: '0 24px 40px' }}>
        Don't have an account?{' '}
        <span style={{ color: 'var(--blue)', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/register')}>
          Sign up
        </span>
      </p>
    </div>
  );
}
