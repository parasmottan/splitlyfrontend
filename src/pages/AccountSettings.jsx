import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import api from '../services/api';

// ─── Reusable components ────────────────────────────────────────────────────
const PAGE_BG = '#EAEAF5';
const CARD_STYLE = { background: '#fff', borderRadius: 20, padding: '18px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12 };
const INPUT_STYLE = {
  width: '100%', padding: '13px 14px', border: '1.5px solid #E5E5EA',
  borderRadius: 12, fontSize: 15, color: '#1C1C1E', background: '#F9F9FB',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};
const LABEL_STYLE = { fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'block' };
const SECTION_TITLE = { fontSize: 13, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 };

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      background: type === 'error' ? '#FF3B30' : '#34C759',
      color: '#fff', padding: '12px 24px', borderRadius: 100,
      fontSize: 14, fontWeight: '700', zIndex: 9999,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
    }}>
      {msg}
    </div>
  );
}

function DeleteModal({ onCancel, onConfirm, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 5000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 430 }}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
        <h3 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', textAlign: 'center', marginBottom: 8 }}>Delete Account?</h3>
        <p style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
          This action is <strong>permanent</strong>. All your groups, expenses and data will be lost forever.
        </p>
        <button onClick={onConfirm} disabled={loading} style={{ width: '100%', padding: 16, background: '#FF3B30', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: '800', cursor: 'pointer', marginBottom: 10 }}>
          {loading ? 'Deleting...' : 'Yes, Delete My Account'}
        </button>
        <button onClick={onCancel} style={{ width: '100%', padding: 16, background: '#F2F2F7', color: '#1C1C1E', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: '700', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  // Profile info
  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  // Delete
  const [showDelete, setShowDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return showToast('Name cannot be empty', 'error');
    setSavingProfile(true);
    try {
      const { data } = await api.patch('/user/profile', { name });
      setUser(data.user);
      showToast('Profile updated!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) return showToast('All password fields required', 'error');
    if (newPw.length < 6) return showToast('New password must be at least 6 chars', 'error');
    if (newPw !== confirmPw) return showToast('Passwords do not match', 'error');
    setSavingPw(true);
    try {
      await api.patch('/user/password', { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      showToast('Password changed!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/user');
      await logout();
      navigate('/login', { replace: true });
    } catch (e) {
      showToast('Failed to delete account', 'error');
      setDeletingAccount(false);
      setShowDelete(false);
    }
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showDelete && <DeleteModal onCancel={() => setShowDelete(false)} onConfirm={handleDeleteAccount} loading={deletingAccount} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Account</h1>
      </div>

      <div style={{ padding: '0 20px 100px' }}>

        {/* Avatar preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(145deg, #FFE0A3,#FFD07A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,185,80,0.25)' }}>
            <Avatar name={user?.name} style={{ width: 80, height: 80, fontSize: 28, background: 'transparent' }} />
          </div>
        </div>

        {/* Profile Info */}
        <p style={SECTION_TITLE}>Profile Info</p>
        <div style={CARD_STYLE}>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={INPUT_STYLE} placeholder="Your name" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={LABEL_STYLE}>Email (read-only)</label>
            <input value={user?.email || ''} readOnly style={{ ...INPUT_STYLE, color: '#8E8E93', cursor: 'not-allowed' }} />
          </div>
          <button onClick={handleSaveProfile} disabled={savingProfile} style={{ width: '100%', padding: '14px', background: savingProfile ? '#C7C7CC' : 'linear-gradient(135deg, #6347F5, #4B32CC)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: '800', cursor: savingProfile ? 'not-allowed' : 'pointer' }}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Change Password */}
        <p style={{ ...SECTION_TITLE, marginTop: 8 }}>Change Password</p>
        <div style={CARD_STYLE}>
          {[
            { label: 'Current Password', val: currentPw, set: setCurrentPw },
            { label: 'New Password', val: newPw, set: setNewPw },
            { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={LABEL_STYLE}>{label}</label>
              <input type="password" value={val} onChange={e => set(e.target.value)} style={INPUT_STYLE} placeholder="••••••••" />
            </div>
          ))}
          <button onClick={handleChangePassword} disabled={savingPw} style={{ width: '100%', padding: 14, background: savingPw ? '#C7C7CC' : 'linear-gradient(135deg, #6347F5, #4B32CC)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: '800', cursor: savingPw ? 'not-allowed' : 'pointer' }}>
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </div>

        {/* Danger Zone */}
        <p style={{ ...SECTION_TITLE, marginTop: 8, color: '#FF3B30' }}>Danger Zone</p>
        <div style={{ ...CARD_STYLE, border: '1.5px solid rgba(255,59,48,0.2)' }}>
          <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 14, lineHeight: 1.5 }}>
            Permanently deletes your account and removes you from all groups. This cannot be undone.
          </p>
          <button onClick={() => setShowDelete(true)} style={{ width: '100%', padding: 14, background: 'rgba(255,59,48,0.08)', color: '#FF3B30', border: '1.5px solid rgba(255,59,48,0.3)', borderRadius: 14, fontSize: 15, fontWeight: '800', cursor: 'pointer' }}>
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
