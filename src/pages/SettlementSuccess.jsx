import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
        background: 'var(--green-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <span style={{ fontSize: '48px' }}>✅</span>
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '12px' }}>
        All Settled!
      </h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.5', maxWidth: '280px', marginBottom: '48px' }}>
        All balances have been cleared. Everyone's even now.
      </p>

      <button
        className="btn-primary"
        onClick={() => navigate(`/groups/${id}`, { replace: true })}
        style={{ maxWidth: '300px' }}
      >
        Back to Group
      </button>
    </div>
  );
}
