import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from '../components/BottomNav';

const PAGE_BG = '#EAEAF5';

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: type === 'error' ? '#FF3B30' : '#34C759', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  );
}

function Toggle({ value, onChange, loading }) {
  return (
    <button
      onClick={() => !loading && onChange(!value)}
      style={{
        width: 52, height: 30, borderRadius: 15, border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        background: value ? 'linear-gradient(135deg, #6347F5, #5038D4)' : '#D1D1D6',
        position: 'relative', transition: 'background 220ms', flexShrink: 0,
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 24 : 3,
        width: 24, height: 24, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        transition: 'left 220ms',
      }} />
    </button>
  );
}

// Individual card per notification toggle
function NotificationCard({ icon, iconBg, label, sub, value, onChange, loading }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '18px 18px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: '800', color: '#1C1C1E', margin: '0 0 3px' }}>{label}</p>
        <p style={{ fontSize: 13, color: '#8E8E93', margin: 0, lineHeight: 1.4 }}>{sub}</p>
      </div>
      <Toggle value={value} onChange={onChange} loading={loading} />
    </div>
  );
}

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ expenseAlerts: true, settlementAlerts: true, groupInvites: true, weeklySummary: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/me');
        if (data.user.notificationPrefs) setPrefs(data.user.notificationPrefs);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    })();
  }, []);

  const handleToggle = async (key, value) => {
    const prev = prefs[key];
    setPrefs(p => ({ ...p, [key]: value }));
    setSaving(key);
    try {
      await api.patch('/user/notifications', { [key]: value });
      showToast('Preference saved');
    } catch {
      setPrefs(p => ({ ...p, [key]: prev }));
      showToast('Failed to save', 'error');
    } finally {
      setSaving(null);
    }
  };

  const toggleItems = [
    {
      key: 'expenseAlerts',
      label: 'Expense alerts',
      sub: "Get notified when you're added to a new expense.",
      iconBg: 'rgba(255,149,0,0.12)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="15" height="16" rx="2" fill="none" stroke="#FF9500" strokeWidth="2" />
          <path d="M7 9h7M7 12h7M7 15h4" stroke="#FF9500" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#FF9500" />
          <path d="M16.5 17.5l1 1 2-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: 'settlementAlerts',
      label: 'Settlement alerts',
      sub: 'Know immediately when friends settle up debts.',
      iconBg: 'rgba(52,199,89,0.12)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="15" height="11" rx="2" stroke="#34C759" strokeWidth="2" />
          <path d="M9 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="#34C759" />
          <path d="M17 10l3-2v8l-3-2" stroke="#34C759" strokeWidth="2" strokeLinejoin="round" />
          <path d="M3 10l2-1M3 15l2 1" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'groupInvites',
      label: 'Group invites',
      sub: 'Receive alerts for new group invitations.',
      iconBg: 'rgba(99,71,245,0.1)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#6347F5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="7" r="4" stroke="#6347F5" strokeWidth="2" />
          <path d="M20 8v6M17 11h6" stroke="#6347F5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'weeklySummary',
      label: 'Weekly summary',
      sub: 'A weekly recap of your spending and savings.',
      iconBg: 'rgba(99,71,245,0.07)',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

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
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#1C1C1E', margin: 0, marginRight: 38 }}>Notifications</h1>
      </div>

      <div style={{ padding: '4px 20px 100px' }}>
        <p style={{ fontSize: 14, color: '#3C3C43', marginBottom: 24, lineHeight: 1.6 }}>
          Control which notifications you receive to stay updated without the noise.
        </p>

        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: '#F2F2F7' }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '50%', height: 14, borderRadius: 7, background: '#F2F2F7', marginBottom: 8 }} />
                <div style={{ width: '75%', height: 11, borderRadius: 6, background: '#F2F2F7' }} />
              </div>
              <div style={{ width: 52, height: 30, borderRadius: 15, background: '#F2F2F7' }} />
            </div>
          ))
        ) : (
          toggleItems.map(item => (
            <NotificationCard
              key={item.key}
              icon={item.icon}
              iconBg={item.iconBg}
              label={item.label}
              sub={item.sub}
              value={prefs[item.key]}
              loading={saving === item.key}
              onChange={val => handleToggle(item.key, val)}
            />
          ))
        )}

        {/* System Permissions section */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 17, fontWeight: '800', color: '#1C1C1E', margin: '0 0 12px' }}>System Permissions</h2>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '16px 18px',
            border: '1.5px dashed rgba(99,71,245,0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>ℹ️</div>
            <div>
              <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6, margin: '0 0 10px' }}>
                To ensure you receive these alerts, please check that notifications are enabled for Splitly in your device settings.
              </p>
              <button
                onClick={() => { }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 14, fontWeight: '700', color: '#6347F5' }}
              >
                Open Device Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
