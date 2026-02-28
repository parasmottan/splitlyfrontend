import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineUserPlus } from 'react-icons/hi2';
import { IoChevronForward } from 'react-icons/io5';

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{
      padding: '60px 24px', minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #EAEBFF 0%, #D8E5FF 50%, #E2EDF8 100%)'
    }}>
      <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px', color: '#111827', letterSpacing: '-0.5px' }}>
        Get Started
      </h1>
      <p style={{ color: '#4B5563', fontSize: '17px', lineHeight: '1.5', marginBottom: '40px', fontWeight: '500' }}>
        Start a new shared ledger or join an existing one.
      </p>

      {/* Create Group Card */}
      <div
        className="card"
        style={{ padding: '24px', marginBottom: '16px', cursor: 'pointer', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', borderRadius: '24px' }}
        onClick={() => navigate('/create-group')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--blue-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlinePlus style={{ fontSize: '24px', color: 'var(--blue)' }} />
          </div>
          <IoChevronForward style={{ fontSize: '24px', color: '#9CA3AF' }} />
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Create Group</h3>
        <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.5', fontWeight: '500' }}>
          Set up a new space for expenses with friends, roommates, or travel partners.
        </p>
      </div>

      {/* Join Group Card */}
      <div
        className="card"
        style={{ padding: '24px', cursor: 'pointer', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', borderRadius: '24px' }}
        onClick={() => navigate('/join-group')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--blue-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineUserPlus style={{ fontSize: '24px', color: 'var(--blue)' }} />
          </div>
          <IoChevronForward style={{ fontSize: '24px', color: '#9CA3AF' }} />
        </div>
        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>Join Group</h3>
        <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.5', fontWeight: '500' }}>
          Have an invite code? Enter it to instantly join an existing group.
        </p>
      </div>

      <div style={{ flex: 1 }}></div>

      <button className="btn-secondary" style={{ marginBottom: '20px', color: 'var(--blue)', fontSize: '17px', background: 'transparent', boxShadow: 'none' }}>
        Restore Purchases
      </button>
    </div>
  );
}
