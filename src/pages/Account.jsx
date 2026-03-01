import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useGroupStore from '../stores/groupStore';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

// ─── Icons ─────────────────────────────────────────────────────────────────
function IconAccount() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="#5AC8FA" />
      <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconPayment() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#6347F5" strokeWidth="2" />
      <path d="M2 10H22" stroke="#6347F5" strokeWidth="2" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#34C759" strokeWidth="2" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#34C759" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="#34C759" stroke="#34C759" strokeWidth="1.5" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="#C7C7CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Person Illustration (simple, matching design) ──────────────────────────
function PersonIllustration({ size = 96 }) {
  return (
    <svg width={size * 0.7} height={size * 0.8} viewBox="0 0 70 80" fill="none">
      {/* Head */}
      <circle cx="35" cy="22" r="16" fill="#3D3D3D" />
      {/* Hair */}
      <path d="M19 22C19 13.163 26.163 6 35 6C43.837 6 51 13.163 51 22V18C51 9.163 43.837 2 35 2C26.163 2 19 9.163 19 18V22Z" fill="#1C1C1E" />
      {/* Face */}
      <circle cx="35" cy="22" r="14" fill="#C8A882" />
      {/* Eyes */}
      <circle cx="30" cy="21" r="2" fill="#3D3D3D" />
      <circle cx="40" cy="21" r="2" fill="#3D3D3D" />
      {/* Mouth */}
      <path d="M30 28C30 28 32 30 35 30C38 30 40 28 40 28" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body */}
      <path d="M15 70C15 58 24 50 35 50C46 50 55 58 55 70" fill="#1C1C1E" />
      {/* Collar */}
      <path d="M28 50L35 56L42 50" fill="#fff" />
    </svg>
  );
}

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { groups, fetchGroups } = useGroupStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (groups.length === 0) fetchGroups();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // ─── Derived stats ─────────────────────────────────────────────────────────
  const activeGroups = groups.filter(g => !g.archived);
  const totalSaved = activeGroups.reduce((sum, g) => sum + (g.balance?.youAreOwed || 0), 0);
  const uniqueFriends = new Set();
  activeGroups.forEach(g => {
    (g.members || []).forEach(m => {
      if (m.user?._id !== user?._id) uniqueFriends.add(m.user?._id);
    });
  });

  // Streak: days since account creation (capped at 30 for display)
  const daysSince = user?.createdAt
    ? Math.min(30, Math.floor((Date.now() - new Date(user.createdAt)) / 86400000))
    : 1;

  // Karma score: based on activity
  const karmaScore = 500 + activeGroups.length * 50 + uniqueFriends.size * 20;

  // ─── Achievements ──────────────────────────────────────────────────────────
  const achievements = [
    {
      icon: '💰', title: 'Super Saver', sub: 'Save ₹500 in a single month.',
      progress: Math.min(100, Math.round(totalSaved / 5)), color: '#FF9500', bg: '#FFF3E0',
    },
    {
      icon: '👥', title: 'Social Butterfly', sub: `Invited ${uniqueFriends.size} friend${uniqueFriends.size !== 1 ? 's' : ''}.`,
      progress: Math.min(100, uniqueFriends.size * 20), color: '#5AC8FA', bg: '#E1F5FE',
    },
    {
      icon: '🏆', title: 'Group Pro', sub: 'Create 5 groups.',
      progress: Math.min(100, activeGroups.length * 20), color: '#6347F5', bg: 'rgba(99,71,245,0.1)',
    },
  ];

  // ─── Settings items ────────────────────────────────────────────────────────
  const settingsItems = [
    { Icon: IconAccount, bg: '#E1F5FE', label: 'Account', sub: 'Edit profile, change password', route: '/account/settings' },
    { Icon: IconPayment, bg: 'rgba(99,71,245,0.1)', label: 'Payment Methods', sub: 'Manage cards & banks', route: '/account/payment-methods' },
    { Icon: IconBell, bg: '#FFF3E0', label: 'Notifications', sub: 'Customize alerts', route: '/account/notifications' },
    { Icon: IconHelp, bg: '#E8F5E9', label: 'Help & Support', sub: 'FAQ & Contact Us', route: '/account/help' },
  ];

  return (
    <div style={{ background: '#EAEAF5', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 0', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#1C1C1E" strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#1C1C1E" strokeWidth="2" /></svg>
        </button>
      </div>

      <div style={{ padding: '24px 20px 100px' }}>

        {/* ── Profile Hero ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          {/* Avatar circle */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(145deg, #FFE0A3, #FFD07A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 28px rgba(255,185,80,0.25)',
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : <PersonIllustration size={100} />
              }
            </div>
            {/* Streak badge */}
            <div style={{
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              background: '#fff', borderRadius: 100, padding: '4px 12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12)', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 12, fontWeight: '800', color: '#1C1C1E' }}>{daysSince}-day streak</span>
              <span style={{ fontSize: 13 }}>🔥</span>
            </div>
          </div>

          {/* Name */}
          <h1 style={{ fontSize: 26, fontWeight: '800', color: '#1C1C1E', margin: '20px 0 8px', letterSpacing: '-0.5px' }}>
            {user?.name || 'User'}
          </h1>

          {/* Karma Score pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#fff', borderRadius: 100, padding: '6px 16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: 15 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: '700', color: '#1C1C1E' }}>Karma Score: {karmaScore}</span>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Total Saved', value: `₹${totalSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
            { label: 'Groups', value: activeGroups.length.toString() },
            { label: 'Friends', value: uniqueFriends.size.toString() },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: '#fff', borderRadius: 20, padding: '14px 10px',
              textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
              <p style={{ fontSize: 11, fontWeight: '500', color: '#8E8E93', margin: '0 0 6px' }}>{stat.label}</p>
              <p style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0, letterSpacing: '-0.5px' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Achievements ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Achievements</h2>
          <span style={{ fontSize: 14, fontWeight: '700', color: '#6347F5', cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 28, paddingBottom: 4, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {achievements.map((a, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 22, padding: '18px 16px',
              minWidth: 170, maxWidth: 170, flexShrink: 0,
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: a.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, marginBottom: 12,
              }}>
                {a.icon}
              </div>
              <p style={{ fontSize: 15, fontWeight: '800', color: '#1C1C1E', margin: '0 0 4px' }}>{a.title}</p>
              <p style={{ fontSize: 12, color: '#8E8E93', margin: '0 0 12px', lineHeight: 1.4 }}>{a.sub}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#8E8E93', fontWeight: '600' }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: '800', color: a.progress >= 100 ? '#34C759' : a.color }}>{a.progress}%</span>
              </div>
              <div style={{ height: 6, background: '#F2F2F7', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.progress}%`, background: a.progress >= 100 ? '#34C759' : a.color, borderRadius: 3, transition: 'width 600ms ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Settings ── */}
        <h2 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: '0 0 14px' }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
          {settingsItems.map(item => (
            <div
              key={item.label}
              onClick={() => navigate(item.route)}
              style={{
                background: '#fff', borderRadius: 20, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14, background: item.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <item.Icon />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontSize: 12, color: '#8E8E93', margin: 0 }}>{item.sub}</p>
              </div>
              <IconChevron />
            </div>
          ))}
        </div>

        {/* ── Sign Out ── */}
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '16px', color: '#FF3B30',
            fontSize: 16, fontWeight: '700', border: 'none', background: 'none',
            cursor: 'pointer', marginTop: 16,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" /><polyline points="16 17 21 12 16 7" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" /></svg>
          Sign Out
        </button>
      </div>

      <Modal show={showLogoutModal} title="Sign Out?" message="You'll need to sign in again to access your groups." onClose={() => setShowLogoutModal(false)} variant="alert">
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
