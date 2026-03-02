import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../services/api';

// ─── Person Illustration (matching existing design) ─────────────────────────
function PersonIllustration() {
  return (
    <svg width="56" height="64" viewBox="0 0 70 80" fill="none">
      <circle cx="35" cy="22" r="16" fill="#3D3D3D" />
      <path d="M19 22C19 13.163 26.163 6 35 6C43.837 6 51 13.163 51 22V18C51 9.163 43.837 2 35 2C26.163 2 19 9.163 19 18V22Z" fill="#1C1C1E" />
      <circle cx="35" cy="22" r="14" fill="#C8A882" />
      <circle cx="30" cy="21" r="2" fill="#3D3D3D" />
      <circle cx="40" cy="21" r="2" fill="#3D3D3D" />
      <path d="M30 28C30 28 32 30 35 30C38 30 40 28 40 28" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 70C15 58 24 50 35 50C46 50 55 58 55 70" fill="#1C1C1E" />
      <path d="M28 50L35 56L42 50" fill="#fff" />
    </svg>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: type === 'error' ? '#FF3B30' : '#34C759', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
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

const LABEL = {
  fontSize: 11, fontWeight: '700', color: '#8E8E93',
  textTransform: 'uppercase', letterSpacing: '0.8px',
  display: 'block', marginBottom: 8,
};

const INPUT = {
  width: '100%', padding: '14px 20px', fontSize: 16, color: '#1C1C1E',
  background: '#fff', border: '1.5px solid #E5E5EA',
  borderRadius: 100, outline: 'none', boxSizing: 'border-box',
};

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [upiId, setUpiId] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [toast, setToast] = useState(null);

  // Load full profile including upiId on mount
  useEffect(() => {
    api.get('/user/me-full').then(({ data }) => {
      if (data.user?.name) setName(data.user.name);
      if (data.user?.upiId !== undefined) setUpiId(data.user.upiId);
    }).catch(() => { });
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) return showToast('Name cannot be empty', 'error');
    setSaving(true);
    try {
      // Save profile (name + upiId)
      const { data } = await api.patch('/user/profile', { name, upiId });
      setUser(data.user);

      // Also change password if filled
      if (currentPw || newPw || confirmPw) {
        if (!currentPw || !newPw || !confirmPw) { showToast('Fill all password fields', 'error'); setSaving(false); return; }
        if (newPw.length < 6) { showToast('New password must be at least 6 chars', 'error'); setSaving(false); return; }
        if (newPw !== confirmPw) { showToast('Passwords do not match', 'error'); setSaving(false); return; }
        await api.patch('/user/password', { currentPassword: currentPw, newPassword: newPw });
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
      }
      showToast('Changes saved!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/user');
      await logout();
      navigate('/login', { replace: true });
    } catch {
      showToast('Failed to delete account', 'error');
      setDeletingAccount(false);
      setShowDelete(false);
    }
  };

  return (
    <div style={{ background: '#EAEAF5', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showDelete && <DeleteModal onCancel={() => setShowDelete(false)} onConfirm={handleDeleteAccount} loading={deletingAccount} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1C1C1E', margin: 0, marginRight: 38 }}>Account</h1>
      </div>

      <div style={{ padding: '8px 20px 80px' }}>

        {/* Profile card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'linear-gradient(145deg, #FFE0A3, #FFD07A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 4px rgba(99,71,245,0.15)',
              }}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : <PersonIllustration />
                }
              </div>
              {/* Camera badge */}
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 26, height: 26, borderRadius: '50%',
                background: '#6347F5', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={INPUT}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Email Address</label>
            <input
              value={user?.email || ''}
              readOnly
              style={{ ...INPUT, color: '#8E8E93', cursor: 'not-allowed' }}
            />
          </div>

          {/* UPI ID */}
          <div>
            <label style={LABEL}>UPI ID</label>
            <div style={{ position: 'relative' }}>
              <input
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                style={{ ...INPUT, paddingRight: 48 }}
                placeholder="yourname@upi"
                autoComplete="off"
                autoCapitalize="none"
              />
              <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>💳</span>
            </div>
            <p style={{ fontSize: 12, color: '#8E8E93', margin: '6px 0 0 12px' }}>Others will pay you via this UPI ID</p>
          </div>
        </div>

        {/* Change Password card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: '0 0 20px' }}>Change Password</h2>

          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>Current Password</label>
            <input
              type="password"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              style={{ ...INPUT, color: currentPw ? '#1C1C1E' : '#AEAEB2' }}
              placeholder="••••••••"
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL}>New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              style={INPUT}
              placeholder="Enter new password"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={LABEL}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              style={INPUT}
              placeholder="Confirm new password"
            />
          </div>

          {/* Save Changes button */}
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            style={{
              width: '100%', padding: '16px 24px',
              background: saving ? '#AEAEB2' : 'linear-gradient(135deg, #7B5CF5, #6347F5)',
              color: '#fff', border: 'none', borderRadius: 100,
              fontSize: 17, fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {saving ? 'Saving...' : (
              <>Save Changes <span style={{ fontSize: 16 }}>✓</span></>
            )}
          </button>
        </div>

        {/* Danger Zone card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: '20px 20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #FF3B30',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ fontSize: 17, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Danger Zone</p>
          </div>
          <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6, margin: '0 0 16px' }}>
            Deleting your account is permanent. All your data, karma score, and group history will be wiped out immediately.
          </p>
          <button
            onClick={() => setShowDelete(true)}
            style={{
              width: '100%', padding: '14px 20px',
              background: 'rgba(255,59,48,0.06)', color: '#FF3B30',
              border: '1.5px solid rgba(255,59,48,0.25)', borderRadius: 100,
              fontSize: 15, fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 6l-1 14H6L5 6" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11v6M14 11v6" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 6V4h6v2" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
