import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PAGE_BG = '#EAEAF5';
const CARD_STYLE = { background: '#fff', borderRadius: 20, padding: '6px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12 };

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: type === 'error' ? '#FF3B30' : '#34C759', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  );
}

// Individual toggle row
function ToggleRow({ label, sub, icon, iconBg, value, onChange, loading }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid #F2F2F7' }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px' }}>{label}</p>
        <p style={{ fontSize: 12, color: '#8E8E93', margin: 0 }}>{sub}</p>
      </div>
      {/* Toggle switch */}
      <button
        onClick={() => !loading && onChange(!value)}
        style={{
          width: 50, height: 28, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: value ? 'linear-gradient(135deg, #6347F5, #4B32CC)' : '#D1D1D6',
          position: 'relative', transition: 'background 200ms', flexShrink: 0, opacity: loading ? 0.6 : 1,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3,
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 200ms',
        }} />
      </button>
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
    setPrefs(p => ({ ...p, [key]: value })); // Optimistic
    setSaving(key);
    try {
      await api.patch('/user/notifications', { [key]: value });
      showToast('Preference saved');
    } catch {
      setPrefs(p => ({ ...p, [key]: prev })); // Rollback
      showToast('Failed to save', 'error');
    } finally {
      setSaving(null);
    }
  };

  const toggleItems = [
    {
      key: 'expenseAlerts', label: 'Expense Alerts', sub: 'When someone adds a new expense',
      iconBg: 'rgba(99,71,245,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6347F5" strokeWidth="2" strokeLinejoin="round" /><path d="M2 17L12 22L22 17" stroke="#6347F5" strokeWidth="2" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="#6347F5" strokeWidth="2" strokeLinejoin="round" /></svg>,
    },
    {
      key: 'settlementAlerts', label: 'Settlement Alerts', sub: 'When debts are settled',
      iconBg: 'rgba(52,199,89,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="#34C759" strokeWidth="2" /></svg>,
    },
    {
      key: 'groupInvites', label: 'Group Invites', sub: 'When someone invites you to a group',
      iconBg: '#FFF3E0',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="#FF9500" strokeWidth="2" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" /></svg>,
    },
    {
      key: 'weeklySummary', label: 'Weekly Summary', sub: 'Weekly digest of your activity',
      iconBg: '#E1F5FE',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#5AC8FA" strokeWidth="2" /><path d="M16 2v4M8 2v4M3 10h18" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round" /></svg>,
    },
  ];

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Notifications</h1>
      </div>

      <div style={{ padding: '8px 20px 100px' }}>
        <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 16, lineHeight: 1.5 }}>
          Choose which notifications you'd like to receive. Changes save instantly.
        </p>

        {loading ? (
          <div style={{ ...CARD_STYLE, padding: '16px 18px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 4 ? '1px solid #F2F2F7' : 'none' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: '#F2F2F7' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '50%', height: 13, borderRadius: 7, background: '#F2F2F7', marginBottom: 7 }} />
                  <div style={{ width: '75%', height: 11, borderRadius: 6, background: '#F2F2F7' }} />
                </div>
                <div style={{ width: 50, height: 28, borderRadius: 14, background: '#F2F2F7' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={CARD_STYLE}>
            {toggleItems.map((item, i) => (
              <div key={item.key} style={{ borderBottom: i < toggleItems.length - 1 ? '' : 'none' }}>
                <ToggleRow
                  label={item.label} sub={item.sub} icon={item.icon} iconBg={item.iconBg}
                  value={prefs[item.key]} loading={saving === item.key}
                  onChange={val => handleToggle(item.key, val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
