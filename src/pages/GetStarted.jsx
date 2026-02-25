import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineUserPlus } from 'react-icons/hi2';
import { IoChevronForward } from 'react-icons/io5';

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="page page-white" style={{ padding: '60px 20px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <h1 className="title-large" style={{ marginBottom: '12px' }}>Get Started</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.5', marginBottom: '40px' }}>
        Start a new shared ledger or join an existing one.
      </p>

      {/* Create Group Card */}
      <div
        className="card"
        style={{ padding: '24px', marginBottom: '16px', cursor: 'pointer' }}
        onClick={() => navigate('/create-group')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--blue-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlinePlus style={{ fontSize: '20px', color: 'var(--blue)' }} />
          </div>
          <IoChevronForward style={{ fontSize: '20px', color: 'var(--gray-400)' }} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Create Group</h3>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Set up a new space for expenses with friends, roommates, or travel partners.
        </p>
      </div>

      {/* Join Group Card */}
      <div
        className="card"
        style={{ padding: '24px', cursor: 'pointer' }}
        onClick={() => navigate('/join-group')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--blue-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineUserPlus style={{ fontSize: '20px', color: 'var(--blue)' }} />
          </div>
          <IoChevronForward style={{ fontSize: '20px', color: 'var(--gray-400)' }} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Join Group</h3>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Have an invite code? Enter it to instantly join an existing group.
        </p>
      </div>

      <div style={{ flex: 1 }}></div>

      <button className="btn-secondary" style={{ marginBottom: '20px', color: 'var(--blue)' }}>
        Restore Purchases
      </button>
    </div>
  );
}
