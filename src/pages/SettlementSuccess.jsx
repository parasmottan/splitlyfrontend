import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SettlementSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      minHeight: '100dvh', padding: '60px 28px 40px',
      background: 'linear-gradient(160deg, #F5F3FF 0%, #F0F0FF 40%, #EAEBFF 100%)',
      position: 'relative',
    }}>
      {/* Close button */}
      <button
        onClick={() => navigate(`/groups/${id}`, { replace: true })}
        style={{
          position: 'absolute', top: '24px', right: '24px',
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(142,142,147,0.15)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: '#8E8E93', cursor: 'pointer',
        }}
      >
        ×
      </button>

      {/* Success visual - dot grid + concentric circles + check */}
      <div style={{ position: 'relative', width: '260px', height: '260px', marginBottom: '40px', marginTop: '20px' }}>
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(99,71,245,0.18) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
          borderRadius: '8px',
        }} />

        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: '14px', borderRadius: '50%',
          background: 'rgba(52,199,89,0.08)',
        }} />
        {/* Middle ring */}
        <div style={{
          position: 'absolute', inset: '40px', borderRadius: '50%',
          background: 'rgba(52,199,89,0.12)',
        }} />
        {/* Inner circle - green */}
        <div style={{
          position: 'absolute', inset: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CD964 0%, #34C759 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(52,199,89,0.35)',
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 24L21 33L36 15" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1C1C1E', marginBottom: '12px', letterSpacing: '-0.5px', textAlign: 'center' }}>
        All balances cleared ✨
      </h1>
      <p style={{ fontSize: '16px', color: '#8E8E93', textAlign: 'center', lineHeight: '1.5', maxWidth: '300px', marginBottom: '40px' }}>
        You're all settled up! That feels pretty good, doesn't it?
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '320px', gap: '12px', marginBottom: '44px' }}>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: '20px', padding: '20px 16px',
          textAlign: 'center', backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: '22px', fontWeight: '800', color: '#1C1C1E', marginBottom: '4px', letterSpacing: '-0.5px' }}>$142.50</p>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#8E8E93', letterSpacing: '0.5px', textTransform: 'uppercase' }}>TOTAL PAID</p>
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.8)', borderRadius: '20px', padding: '20px 16px',
          textAlign: 'center', backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: '22px', fontWeight: '800', color: '#1C1C1E', marginBottom: '4px', letterSpacing: '-0.5px' }}>5</p>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#8E8E93', letterSpacing: '0.5px', textTransform: 'uppercase' }}>FRIENDS</p>
        </div>
      </div>

      {/* Done button */}
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <button
          onClick={() => navigate(`/groups/${id}`, { replace: true })}
          style={{
            width: '100%', padding: '18px 24px',
            background: '#1C1C1E', color: 'white',
            fontSize: '17px', fontWeight: '700',
            borderRadius: '100px', border: 'none', cursor: 'pointer',
            marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          Done
        </button>
        <p
          onClick={() => navigate(`/groups/${id}`)}
          style={{ textAlign: 'center', fontSize: '15px', color: '#8E8E93', cursor: 'pointer', fontWeight: '500' }}
        >
          View transaction details
        </p>
      </div>
    </div>
  );
}
