import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoLogOutOutline } from 'react-icons/io5';
import useAuthStore from '../stores/authStore';
import useGroupStore from '../stores/groupStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { groups, fetchGroups } = useGroupStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Ensure groups are loaded so we can derive real stats
    if (groups.length === 0) {
      fetchGroups();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Derive real stats from actual data
  const activeGroups = groups.filter(g => !g.archived);
  const totalSpend = activeGroups.reduce((sum, g) => sum + (g.balance?.totalSpend || 0), 0);
  const uniqueFriends = new Set();
  activeGroups.forEach(g => {
    (g.members || []).forEach(m => {
      if (m.user?._id !== user?._id) uniqueFriends.add(m.user?._id);
    });
  });

  // Achievements earned based on real data
  const achievements = [];
  if (activeGroups.length >= 1) {
    achievements.push({
      icon: '👥', title: 'Group Starter', sub: 'Created your first group',
      progress: 100, color: '#6347F5', bg: 'rgba(99,71,245,0.12)',
    });
  }
  if (totalSpend >= 100) {
    achievements.push({
      icon: '💸', title: 'Big Spender', sub: `Tracked over ₹100 in expenses`,
      progress: Math.min(100, Math.round(totalSpend / 10)), color: '#FF9500', bg: 'rgba(255,149,0,0.12)',
    });
  }
  if (uniqueFriends.size >= 1) {
    achievements.push({
      icon: '🤝', title: 'Social', sub: `${uniqueFriends.size} friend${uniqueFriends.size !== 1 ? 's' : ''} in groups`,
      progress: Math.min(100, uniqueFriends.size * 20), color: '#34C759', bg: 'rgba(52,199,89,0.12)',
    });
  }
  // Default if none earned yet
  if (achievements.length === 0) {
    achievements.push({
      icon: '🌟', title: 'Getting Started', sub: 'Create your first group to earn badges',
      progress: 10, color: '#8E8E93', bg: 'rgba(142,142,147,0.12)',
    });
  }

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
        <button
          onClick={() => navigate(-1)}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(142,142,147,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', color: '#1C1C1E' }}
        >←</button>
        <button
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(142,142,147,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', color: '#1C1C1E' }}
        >⚙️</button>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        {/* Profile Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '28px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD88D, #FFB347)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '44px', boxShadow: '0 8px 24px rgba(255,179,71,0.3)',
              overflow: 'hidden',
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '40px', fontWeight: '700', color: '#fff' }}>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
              }
            </div>
            {/* Streak badge if in multiple groups */}
            {activeGroups.length > 0 && (
              <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '100px', padding: '3px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1C1C1E' }}>{activeGroups.length} group{activeGroups.length !== 1 ? 's' : ''} 🔥</span>
              </div>
            )}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1C1C1E', marginBottom: '6px', letterSpacing: '-0.5px' }}>{user?.name || 'User'}</h1>
          <p style={{ fontSize: '15px', color: '#8E8E93', marginBottom: '12px' }}>{user?.email}</p>
        </div>

        {/* Stats row — REAL DATA */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          {[
            { label: 'Total Tracked', value: `₹${totalSpend.toFixed(0)}` },
            { label: 'Groups', value: activeGroups.length.toString() },
            { label: 'Friends', value: uniqueFriends.size.toString() },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: '#fff', borderRadius: '16px', padding: '14px 10px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#1C1C1E', marginBottom: '4px', letterSpacing: '-0.3px' }}>{stat.value}</p>
              <p style={{ fontSize: '11px', fontWeight: '500', color: '#8E8E93' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements — REAL DATA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E' }}>Achievements</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '28px', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {achievements.map((a, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '18px', minWidth: '160px', flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '12px' }}>
                {a.icon}
              </div>
              <p style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1E', marginBottom: '4px' }}>{a.title}</p>
              <p style={{ fontSize: '12px', color: '#8E8E93', marginBottom: '10px' }}>{a.sub}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: '500' }}>Progress</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: a.progress === 100 ? '#34C759' : a.color }}>{a.progress}%</span>
              </div>
              <div style={{ height: '5px', background: '#F2F2F7', borderRadius: '3px' }}>
                <div style={{ height: '100%', width: `${a.progress}%`, background: a.progress === 100 ? '#34C759' : a.color, borderRadius: '3px', transition: 'width 600ms ease' }} />
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
