import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';

export default function SettlementSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '40px 20px' }}>
      {/* Success Icon */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,199,89,0.15) 0%, rgba(52,199,89,0.05) 70%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <IoCheckmarkCircle style={{ fontSize: '72px', color: 'var(--green)' }} />
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '12px', letterSpacing: '-0.3px' }}>
        All balances cleared!
      </h1>
      <p style={{ fontSize: '17px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5', maxWidth: '280px', marginBottom: '48px' }}>
        You're all settled up.
      </p>

      <div style={{ width: '100%', maxWidth: '320px' }}>
        <button
          className="btn-primary"
          onClick={() => navigate(`/groups/${id}`, { replace: true })}
          style={{ marginBottom: '16px' }}
        >
          Back to Group
        </button>
        <button
          className="btn-secondary"
          onClick={() => navigate(`/groups/${id}`)}
        >
          View Summary
        </button>
      </div>
    </div>
  );
}
