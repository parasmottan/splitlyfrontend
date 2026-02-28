import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', paddingBottom: '60px', minHeight: '100dvh',
      background: 'linear-gradient(160deg, #EAEBFF 0%, #D8E5FF 50%, #E2EDF8 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Top logo placeholder */}
      <div style={{ position: 'absolute', top: '40px', left: '24px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 71, 245, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '12px', height: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}>
          {[...Array(9)].map((_, i) => <div key={i} style={{ background: 'var(--blue)', opacity: 0.6, borderRadius: '50%' }}></div>)}
        </div>
      </div>

      <div style={{ position: 'absolute', top: '40px', right: '24px', padding: '6px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '100px', fontSize: '13px', fontWeight: '600', color: '#4B5563' }}>
        v1.0 Beta
      </div>

      {/* Glass circles background */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
      <div style={{ position: 'absolute', top: '30%', right: '-10%', width: '180px', height: '180px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
      <div style={{ position: 'absolute', bottom: '30%', left: '-5%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.6)', borderRadius: '50%', filter: 'blur(20px)' }}></div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: 'auto' }}>

        {/* Text */}
        <h1 style={{ fontSize: '40px', fontWeight: '800', textAlign: 'center', lineHeight: '1.1', marginBottom: '16px', letterSpacing: '-1px', color: '#111827' }}>
          Split smart.<br />
          Stay cool.
        </h1>
        <p style={{ fontSize: '18px', color: '#4B5563', textAlign: 'center', lineHeight: '1.5', marginBottom: '40px', fontWeight: '600' }}>
          No awkward money talks.
        </p>

        {/* Actions */}
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <button className="btn-primary" onClick={() => navigate('/register')} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            Start a Group <span>&#8594;</span>
          </button>
          <button className="btn-secondary" onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.8)', color: '#111827' }}>
            I already vibe here
          </button>
        </div>

        <p style={{ marginTop: '32px', fontSize: '13px', color: '#9CA3AF', fontWeight: '500' }}>
          Designed for Gen-Z Finance
        </p>
      </div>
    </div>
  );
}
