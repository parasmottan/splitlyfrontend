import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoLogOutOutline, IoPersonCircleOutline } from 'react-icons/io5';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page" style={{ background: 'var(--gray-50)' }}>
      <div style={{ padding: '16px 0 8px' }}>
        <h1 className="title-large">Profile</h1>
      </div>

      {/* User Info */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Avatar name={user?.name} size="lg" />
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{user?.name}</h3>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{user?.email}</p>
        </div>
      </div>

      {/* Settings */}
      <h3 className="caption" style={{ marginBottom: '12px' }}>ACCOUNT</h3>
      <div className="card" style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div className="form-row" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <IoPersonCircleOutline style={{ fontSize: '22px', color: 'var(--blue)' }} />
            <span className="form-row-label">Edit Profile</span>
          </div>
          <IoChevronForward style={{ fontSize: '18px', color: 'var(--gray-400)' }} />
        </div>
      </div>

      <h3 className="caption" style={{ marginBottom: '12px' }}>PREFERENCES</h3>
      <div className="card" style={{ padding: '0 16px', marginBottom: '32px' }}>
        <div className="form-row">
          <span className="form-row-label">Default Currency</span>
          <span className="form-row-value">INR ({'\u20B9'}) <IoChevronForward style={{ fontSize: '16px', color: 'var(--gray-400)' }} /></span>
        </div>
        <div className="form-row">
          <span className="form-row-label">App Version</span>
          <span className="form-row-value">1.0.0</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => setShowLogoutModal(true)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', color: 'var(--red)', fontSize: '17px', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', transition: 'transform 120ms ease-out' }}
      >
        <IoLogOutOutline style={{ fontSize: '22px' }} />
        Sign Out
      </button>

      {/* Logout Modal – iOS Alert */}
      <Modal
        show={showLogoutModal}
        title="Sign Out?"
        message="You'll need to sign in again to access your groups and expenses."
        onClose={() => setShowLogoutModal(false)}
        variant="alert"
      >
        <div className="modal-divider" />
        <div className="modal-actions-row">
          <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
          <button className="modal-btn-danger" onClick={handleLogout}>Sign Out</button>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}
