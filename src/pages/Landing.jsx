import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingBottom: '60px' }}>
      {/* Hero Image */}
      <div style={{ width: '100%', maxWidth: '320px', aspectRatio: '1', background: 'linear-gradient(145deg, #B8D4C8 0%, #8FB8A8 50%, #7BA898 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '40px', marginBottom: '40px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '120px', background: 'rgba(255,255,255,0.3)', borderRadius: '8px', transform: 'rotate(-5deg)' }}></div>
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', position: 'absolute', bottom: '30%', right: '30%' }}></div>
          <div style={{ width: '160px', height: '8px', background: 'rgba(255,255,255,0.4)', position: 'absolute', transform: 'rotate(-15deg)' }}></div>
          <div style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.25)', borderRadius: '50%', position: 'absolute', top: '30%', left: '25%' }}></div>
        </div>
      </div>

      {/* Text */}
      <h1 style={{ fontSize: '34px', fontWeight: '700', textAlign: 'center', lineHeight: '1.15', marginBottom: '12px', letterSpacing: '-0.4px' }}>
        Split expenses.<br />
        <span style={{ color: 'var(--blue)' }}>Stay balanced.</span>
      </h1>
      <p style={{ fontSize: '17px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5', maxWidth: '300px', marginBottom: '60px' }}>
        Track group spending without awkward conversations.
      </p>

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <button className="btn-primary" onClick={() => navigate('/register')} style={{ marginBottom: '16px' }}>
          Create Group
        </button>
        <button className="btn-secondary" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </div>
    </div>
  );
}
