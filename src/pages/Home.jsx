import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useNotificationStore from '../stores/notificationStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import api from '../services/api';

// ─── Notification Panel ───────────────────────────────────────────────
function NotificationPanel({ notifications, unreadCount, onClose, onMarkRead }) {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = diffMs / 3600000;
    if (diffHrs < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    const diff = Math.floor(diffMs / 86400000);
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 2000, display: 'flex', flexDirection: 'column-reverse',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '24px 24px 0 0',
          maxHeight: '75dvh', display: 'flex', flexDirection: 'column',
          animation: 'slideUp 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#E5E5EA' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', margin: 0 }}>
            Notifications {unreadCount > 0 && <span style={{ background: '#FF3B30', color: '#fff', fontSize: '12px', padding: '2px 7px', borderRadius: '100px', marginLeft: '6px' }}>{unreadCount}</span>}
          </h2>
          <button onClick={onClose} style={{ background: '#F2F2F7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', color: '#8E8E93' }}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', padding: '8px 0 20px' }}>
          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8E8E93', fontSize: '16px' }}>
              No notifications yet
            </div>
          )}
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && onMarkRead(n._id)}
              style={{
                display: 'flex', gap: '12px', padding: '14px 20px',
                background: n.isRead ? 'transparent' : 'rgba(99,71,245,0.04)',
                borderBottom: '0.5px solid #F2F2F7', cursor: 'pointer',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(99,71,245,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
              }}>
                {n.type === 'payment_request' ? '💸' : n.type === 'reminder' ? '⏰' : '🔔'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: n.isRead ? '500' : '700', color: '#1C1C1E', margin: '0 0 3px' }}>
                  {n.title || n.message || 'New notification'}
                </p>
                {n.message && n.title && (
                  <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>{n.message}</p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', color: '#8E8E93' }}>{formatTime(n.createdAt)}</span>
                {!n.isRead && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6347F5' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Request Money Modal ───────────────────────────────────────────────
function RequestModal({ group, currentUser, onClose }) {
  const [amounts, setAmounts] = useState({});
  const [sending, setSending] = useState({});
  const [sent, setSent] = useState({});

  const members = (group?.members || []).filter((m) => m.user?._id !== currentUser?._id);

  const handleRequest = async (member) => {
    const amt = parseFloat(amounts[member.user._id] || '');
    if (!amt || amt <= 0) return;
    setSending((s) => ({ ...s, [member.user._id]: true }));
    try {
      await api.post('/notifications/remind', {
        debtorId: member.user._id,
        groupId: group._id,
        amount: amt,
        message: `${currentUser?.name || 'Someone'} has requested ₹${amt} from you in ${group.name}`,
      });
      setSent((s) => ({ ...s, [member.user._id]: true }));
      setAmounts((a) => ({ ...a, [member.user._id]: '' }));
    } catch (e) {
      // ignore
    }
    setSending((s) => ({ ...s, [member.user._id]: false }));
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        zIndex: 2000, display: 'flex', flexDirection: 'column-reverse',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '24px 24px 0 0',
          maxHeight: '80dvh', display: 'flex', flexDirection: 'column',
          animation: 'slideUp 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#E5E5EA' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', margin: 0 }}>Request Money</h2>
          <button onClick={onClose} style={{ background: '#F2F2F7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', color: '#8E8E93' }}>✕</button>
        </div>

        {group && (
          <div style={{ padding: '0 20px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#F2F2F7', borderRadius: '12px' }}>
              <span style={{ fontSize: '14px', color: '#8E8E93' }}>Group:</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#1C1C1E' }}>{group.name}</span>
            </div>
          </div>
        )}

        <div style={{ overflowY: 'auto', padding: '8px 20px 30px' }}>
          {members.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: '#8E8E93' }}>No members in this group</div>
          )}
          {members.map((member) => (
            <div key={member.user._id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 0', borderBottom: '0.5px solid #F2F2F7',
            }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <Avatar name={member.user.name} style={{ width: '44px', height: '44px', fontSize: '16px' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1E', margin: '0 0 2px' }}>
                  {member.user.name?.split(' ')[0]}
                </p>
                {sent[member.user._id] && (
                  <p style={{ fontSize: '12px', color: '#34C759', margin: 0 }}>✓ Request sent!</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F2F2F7', borderRadius: '12px', padding: '8px 12px' }}>
                  <span style={{ fontSize: '15px', color: '#8E8E93' }}>₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amounts[member.user._id] || ''}
                    onChange={(e) => setAmounts((a) => ({ ...a, [member.user._id]: e.target.value }))}
                    style={{ width: '70px', border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', fontWeight: '600', color: '#1C1C1E' }}
                  />
                </div>
                <button
                  onClick={() => handleRequest(member)}
                  disabled={sending[member.user._id]}
                  style={{
                    padding: '10px 16px', borderRadius: '12px',
                    background: sent[member.user._id] ? '#34C759' : 'linear-gradient(135deg, #6347F5, #4B32CC)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '700',
                    opacity: sending[member.user._id] ? 0.7 : 1,
                    transition: 'all 200ms ease',
                    minWidth: '72px',
                  }}
                >
                  {sending[member.user._id] ? '...' : sent[member.user._id] ? 'Sent ✓' : 'Request'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Group Card (horizontal scroll) ──────────────────────────────────
const GROUP_BG_COLORS = [
  ['#7C5CBF', '#4B32CC'],
  ['#1B8B6F', '#0F5C47'],
  ['#C25C3A', '#8B3A22'],
  ['#2355C4', '#1440A0'],
  ['#8B3A9E', '#5C2266'],
];

function GroupScrollCard({ group, onClick }) {
  const charCode = group._id?.charCodeAt(0) || 0;
  const [from, to] = GROUP_BG_COLORS[charCode % GROUP_BG_COLORS.length];
  return (
    <div
      onClick={onClick}
      style={{
        width: '130px', height: '170px', borderRadius: '20px', flexShrink: 0,
        background: `linear-gradient(160deg, ${from}, ${to})`,
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        transition: 'transform 120ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Member avatars overlay */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex' }}>
        {(group.members || []).slice(0, 2).map((m, i) => (
          <div key={m.user?._id || i} style={{
            width: '26px', height: '26px', borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.7)',
            marginLeft: i > 0 ? '-8px' : 0,
            overflow: 'hidden', flexShrink: 0,
          }}>
            <Avatar name={m.user?.name || '?'} style={{ width: '26px', height: '26px', fontSize: '9px', minWidth: '26px', minHeight: '26px' }} />
          </div>
        ))}
      </div>
      {/* Group name */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }}>
        <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{group.name}</p>
      </div>
    </div>
  );
}

// ─── Main Activity Item ───────────────────────────────────────────────
function ActivityRow({ item }) {
  const isPositive = item.amount > 0;
  const CATEGORY_ICONS = {
    food: { emoji: '🍔', bg: 'rgba(255,149,0,0.15)', color: '#FF9500' },
    drinks: { emoji: '🍺', bg: 'rgba(90,200,250,0.15)', color: '#5AC8FA' },
    transport: { emoji: '🚕', bg: 'rgba(255,204,0,0.15)', color: '#FFCC00' },
    rent: { emoji: '🏠', bg: 'rgba(255,59,48,0.15)', color: '#FF3B30' },
    entertainment: { emoji: '🎬', bg: 'rgba(175,82,222,0.15)', color: '#AF52DE' },
    groceries: { emoji: '🛒', bg: 'rgba(52,199,89,0.15)', color: '#34C759' },
    travel: { emoji: '✈️', bg: 'rgba(0,122,255,0.15)', color: '#007AFF' },
    other: { emoji: '💸', bg: 'rgba(142,142,147,0.15)', color: '#8E8E93' },
  };
  const icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 0', borderBottom: '0.5px solid #F2F2F7',
    }}>
      <div style={{
        width: '46px', height: '46px', borderRadius: '14px',
        background: icon.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0,
      }}>
        {icon.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.description}
        </p>
        <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>
          Shared with <span style={{ fontWeight: '600', color: '#636366' }}>{item.groupName || 'Group'}</span>
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: '14px', fontWeight: '700', color: isPositive ? '#34C759' : '#FF3B30', margin: '0 0 3px' }}>
          {isPositive ? "You're up" : 'You owe'} ₹{Math.abs(item.amount).toLocaleString()}
        </p>
        <p style={{ fontSize: '12px', color: '#8E8E93', margin: 0 }}>
          {formatDate(item.date)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Home Page ────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const { groups, loading: groupsLoading, fetchGroups } = useGroupStore();
  const { user } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();

  const [activityItems, setActivityItems] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchNotifications();
    (async () => {
      try {
        const { data } = await api.get('/activity');
        // Flatten activity: data is { dateKey: [items] }
        const all = [];
        if (data && typeof data === 'object') {
          Object.values(data).forEach((arr) => {
            if (Array.isArray(arr)) all.push(...arr);
          });
        }
        // Sort by date desc
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivityItems(all.slice(0, 5));
      } catch (e) {
        // ignore
      }
      setActivityLoading(false);
    })();
  }, []);

  const activeGroups = useMemo(() => groups.filter((g) => !g.archived), [groups]);

  // Latest active group = the one with the most recent lastActivity or createdAt
  const latestGroup = useMemo(() => {
    if (!activeGroups.length) return null;
    return [...activeGroups].sort((a, b) => {
      const da = a.lastActivity?.date ? new Date(a.lastActivity.date) : new Date(a.createdAt);
      const db = b.lastActivity?.date ? new Date(b.lastActivity.date) : new Date(b.createdAt);
      return db - da;
    })[0];
  }, [activeGroups]);

  // Net balance: youAreOwed - youOwe across all active groups
  const netBalance = useMemo(() => {
    return activeGroups.reduce((sum, g) => {
      const owed = g.balance?.youAreOwed || 0;
      const owe = g.balance?.youOwe || 0;
      return sum + owed - owe;
    }, 0);
  }, [activeGroups]);

  const isPositive = netBalance >= 0;

  const handleAddExpense = useCallback(() => {
    if (latestGroup) {
      navigate(`/groups/${latestGroup._id}/add-expense`);
    } else {
      navigate('/get-started');
    }
  }, [latestGroup, navigate]);

  const handleRequest = useCallback(() => {
    if (!latestGroup) {
      navigate('/get-started');
      return;
    }
    setShowRequestModal(true);
  }, [latestGroup, navigate]);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #E8E4FF 0%, #F0EFF7 38%, #F2F2F7 60%)',
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      maxWidth: '430px', margin: '0 auto', position: 'relative',
    }}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
            <Avatar name={user?.name || 'U'} style={{ width: '46px', height: '46px', fontSize: '17px', borderRadius: '14px' }} />
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#8E8E93', margin: '0 0 1px', fontWeight: '500' }}>Welcome back</p>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1C1C1E', margin: 0, letterSpacing: '-0.3px' }}>
              {user?.name || 'User'}
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowNotifications(true)}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            position: 'relative',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#1C1C1E" />
          </svg>
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#FF3B30', border: '2px solid #fff',
            }} />
          )}
        </button>
      </div>

      {/* ── Balance Section ── */}
      <div style={{ textAlign: 'center', padding: '28px 20px 32px' }}>
        {/* HEALTHY badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', borderRadius: '100px', padding: '6px 14px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPositive ? '#34C759' : '#FF3B30' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: isPositive ? '#34C759' : '#FF3B30', letterSpacing: '1px' }}>
            {isPositive ? 'HEALTHY' : 'OWING'}
          </span>
        </div>

        {/* Balance amount */}
        <div style={{ fontSize: '52px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-2px', lineHeight: 1 }}>
          ₹{Math.abs(netBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>

        {/* Sub text */}
        <p style={{ fontSize: '16px', color: isPositive ? '#34C759' : '#FF3B30', fontWeight: '600', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          {isPositive ? "You're up this week 🤑" : "You owe this week 😬"}
        </p>
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', gap: '12px', padding: '0 20px 32px' }}>
        {/* Add Expense */}
        <button
          onClick={handleAddExpense}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '18px 20px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '17px', fontWeight: '700',
            boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: '700',
          }}>+</div>
          <span style={{ lineHeight: 1.2 }}>Add<br />Expense</span>
        </button>

        {/* Request */}
        <button
          onClick={handleRequest}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '18px 20px', borderRadius: '100px',
            background: '#fff', color: '#1C1C1E', border: '1.5px solid #E5E5EA',
            cursor: 'pointer', fontSize: '17px', fontWeight: '700',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M5 11l7 7 7-7" />
          </svg>
          Request
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{
        flex: 1, background: '#FFFFFF', borderRadius: '28px 28px 0 0',
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        paddingBottom: '90px',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.06)',
      }}>

        {/* ── Active Groups ── */}
        <div style={{ padding: '24px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Active Groups</h2>
            <span
              onClick={() => navigate('/groups')}
              style={{ fontSize: '14px', fontWeight: '600', color: '#6347F5', cursor: 'pointer' }}
            >
              See All
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', marginLeft: '-4px', paddingLeft: '4px' }}>
            {/* New Group tile */}
            <div
              onClick={() => navigate('/get-started')}
              style={{
                width: '100px', height: '170px', borderRadius: '20px', flexShrink: 0,
                background: 'transparent', border: '2px dashed #C7C7CC',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '10px', cursor: 'pointer',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: '#F2F2F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8E8E93" strokeWidth="1.5" />
                  <path d="M9 12H15M12 9V15" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#8E8E93', textAlign: 'center' }}>New<br />Group</span>
            </div>

            {groupsLoading && activeGroups.length === 0 && [1, 2].map((i) => (
              <div key={i} style={{ width: '130px', height: '170px', borderRadius: '20px', background: '#F2F2F7', flexShrink: 0 }} />
            ))}

            {activeGroups.map((group) => (
              <GroupScrollCard
                key={group._id}
                group={group}
                onClick={() => navigate(`/groups/${group._id}`)}
              />
            ))}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div style={{ padding: '20px 20px 0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1C1C1E', marginBottom: '4px' }}>Recent Activity</h2>

          {activityLoading && (
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: '0.5px solid #F2F2F7' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#F2F2F7', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '60%', height: '14px', borderRadius: '7px', background: '#F2F2F7', marginBottom: '8px' }} />
                    <div style={{ width: '80%', height: '12px', borderRadius: '6px', background: '#F2F2F7' }} />
                  </div>
                  <div style={{ width: '70px' }}>
                    <div style={{ height: '14px', borderRadius: '7px', background: '#F2F2F7', marginBottom: '8px' }} />
                    <div style={{ height: '12px', borderRadius: '6px', background: '#F2F2F7', width: '60%', marginLeft: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!activityLoading && activityItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#8E8E93', fontSize: '15px' }}>
              No activity yet. Add an expense to get started!
            </div>
          )}

          {activityItems.map((item, idx) => (
            <ActivityRow key={item._id || idx} item={item} />
          ))}
        </div>
      </div>

      <BottomNav />

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onClose={() => setShowNotifications(false)}
          onMarkRead={markAsRead}
        />
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          group={latestGroup}
          currentUser={user}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
