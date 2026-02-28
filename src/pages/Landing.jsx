import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const orbRef1 = useRef(null);
  const orbRef2 = useRef(null);
  const orbRef3 = useRef(null);

  useEffect(() => {
    const animate = () => {
      const t = Date.now() / 1000;
      if (orbRef1.current) {
        orbRef1.current.style.transform = `translateX(-50%) translateY(${Math.sin(t * 0.4) * 12}px)`;
      }
      if (orbRef2.current) {
        orbRef2.current.style.transform = `translateY(${Math.sin(t * 0.3 + 1) * 10}px)`;
      }
      if (orbRef3.current) {
        orbRef3.current.style.transform = `translateY(${Math.sin(t * 0.5 + 2) * 8}px)`;
      }
      requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100dvh', padding: '0',
      background: 'linear-gradient(155deg, #EBEDff 0%, #D9E0FF 30%, #C8D6FF 60%, #DDE6F8 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        {/* Logo dots */}
        <div style={{ width: '34px', height: '34px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', padding: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ background: 'rgba(99, 71, 245, 0.7)', borderRadius: '50%' }} />
          ))}
        </div>
        <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', borderRadius: '100px', fontSize: '13px', fontWeight: '600', color: '#3D3D5C', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          v1.0 Beta
        </div>
      </div>

      {/* Floating glass orbs - upper 55% */}
      <div style={{ position: 'relative', width: '100%', height: '55vh', overflow: 'hidden', flexShrink: 0 }}>
        {/* Large center orb */}
        <div ref={orbRef1} style={{
          position: 'absolute', top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.92) 0%, rgba(220,228,255,0.55) 55%, rgba(190,205,255,0.2) 100%)',
          boxShadow: '0 8px 40px rgba(130,140,255,0.18), inset 0 1px 1px rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
        }} />
        {/* Top-right small orb */}
        <div ref={orbRef2} style={{
          position: 'absolute', top: '4%', right: '8%',
          width: '110px', height: '110px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.88) 0%, rgba(210,220,255,0.45) 60%, rgba(180,200,255,0.15) 100%)',
          boxShadow: '0 6px 24px rgba(130,140,255,0.14), inset 0 1px 1px rgba(255,255,255,0.85)',
        }} />
        {/* Bottom-left small orb */}
        <div ref={orbRef3} style={{
          position: 'absolute', bottom: '4%', left: '6%',
          width: '85px', height: '85px', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(205,215,255,0.4) 55%, rgba(175,195,255,0.1) 100%)',
          boxShadow: '0 4px 16px rgba(130,140,255,0.1), inset 0 1px 1px rgba(255,255,255,0.8)',
        }} />
      </div>

      {/* Bottom content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flex: 1, padding: '0 28px 48px' }}>
        <h1 style={{
          fontSize: '42px', fontWeight: '800', textAlign: 'center', lineHeight: '1.1',
          marginBottom: '14px', letterSpacing: '-1.5px', color: '#0F1130',
        }}>
          Split smart.<br />
          Stay cool.
        </h1>
        <p style={{ fontSize: '17px', color: '#555875', textAlign: 'center', lineHeight: '1.5', marginBottom: '40px', fontWeight: '400' }}>
          No awkward money talks.
        </p>

        <div style={{ width: '100%', maxWidth: '360px' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
            style={{ marginBottom: '14px', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.2px', borderRadius: '100px', padding: '18px 24px' }}
          >
            Start a Group &nbsp;→
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/login')}
            style={{ background: 'rgba(255,255,255,0.75)', color: '#0F1130', borderRadius: '100px', padding: '18px 24px', fontSize: '17px', fontWeight: '600', boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
          >
            I already vibe here
          </button>
        </div>

        <p style={{ marginTop: '28px', fontSize: '13px', color: '#999BB5', fontWeight: '500', letterSpacing: '0.2px' }}>
          Designed for Gen-Z Finance
        </p>
      </div>
    </div>
  );
}
