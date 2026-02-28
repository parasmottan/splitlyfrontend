import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoLogOutOutline } from 'react-icons/io5';
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

  const settingsItems = [
    { icon: '👤', color: '#5AC8FA', bg: 'rgba(90,200,250,0.15)', label: 'Account', sub: 'Edit profile, change password' },
    { icon: '💳', color: '#6347F5', bg: 'rgba(99,71,245,0.12)', label: 'Payment Methods', sub: 'Manage cards & banks' },
    { icon: '🔔', color: '#FF9500', bg: 'rgba(255,149,0,0.12)', label: 'Notifications', sub: 'Customize alerts' },
    { icon: '❓', color: '#34C759', bg: 'rgba(52,199,89,0.12)', label: 'Help & Support', sub: 'FAQ & Contact Us' },
  ];

  return (
    <div style={{ background: '#F2F2F7', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(142,142,147,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', color: '#1C1C1E' }}>←</button>
        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(142,142,147,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', color: '#1C1C1E' }}>⚙️</button>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Profile Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '28px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD88D, #FFB347)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', boxShadow: '0 8px 24px rgba(255,179,71,0.3)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            {/* Streak badge */}
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '100px', padding: '3px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1C1C1E' }}>3-day streak 🔥</span>
            </div>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1C1C1E', marginBottom: '6px', letterSpacing: '-0.5px' }}>{user?.name || 'Alex Rivera'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'rgba(99,71,245,0.1)', borderRadius: '100px' }}>
            <span style={{ fontSize: '14px' }}>✨</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--blue)' }}>Karma Score: 980</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          {[
            { label: 'Total Saved', value: '$1,250' },
            { label: 'Groups', value: '12' },
            { label: 'Friends', value: '45' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: '#fff', borderRadius: '16px', padding: '14px 10px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#1C1C1E', marginBottom: '4px', letterSpacing: '-0.3px' }}>{stat.value}</p>
              <p style={{ fontSize: '11px', fontWeight: '500', color: '#8E8E93' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E' }}>Achievements</h2>
          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--blue)', cursor: 'pointer' }}>View all</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '28px', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {[
            { icon: '🐷', title: 'Super Saver', sub: 'Saved $500 in a single month.', progress: 100, color: '#FF9500' },
            { icon: '👥', title: 'Social B...', sub: 'Invited 5 fri...', progress: 60, color: '#6347F5' },
          ].map((a, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '18px', minWidth: '160px', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `rgba(${a.color === '#FF9500' ? '255,149,0' : '99,71,245'},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '12px' }}>
                {a.icon}
              </div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1E', marginBottom: '4px' }}>{a.title}</p>
              <p style={{ fontSize: '12px', color: '#8E8E93', marginBottom: '10px' }}>{a.sub}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: '500' }}>Progress</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#34C759' }}>{a.progress}%</span>
              </div>
              <div style={{ height: '5px', background: '#F2F2F7', borderRadius: '3px' }}>
                <div style={{ height: '100%', width: `${a.progress}%`, background: a.progress === 100 ? '#34C759' : a.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', marginBottom: '12px' }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {settingsItems.map(item => (
            <div key={item.label} style={{
              background: '#fff', borderRadius: '18px', padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 120ms',
            }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>{item.sub}</p>
              </div>
              <IoChevronForward style={{ fontSize: '18px', color: '#C7C7CC', flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', color: 'var(--red)', fontSize: '17px', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', marginTop: '20px' }}
        >
          <IoLogOutOutline style={{ fontSize: '22px' }} />
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
