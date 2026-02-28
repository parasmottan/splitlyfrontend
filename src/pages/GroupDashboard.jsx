import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoSettingsOutline } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useNotificationStore from '../stores/notificationStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';

/* ── Category config ──────────────────────────────── */
const CAT = {
  food: { emoji: '🍕', color: '#FF9500', bg: 'rgba(255,149,0,0.15)' },
  drinks: { emoji: '🍺', color: '#5AC8FA', bg: 'rgba(90,200,250,0.15)' },
  transport: { emoji: '⛽', color: '#FFCC00', bg: 'rgba(255,204,0,0.15)' },
  rent: { emoji: '🏠', color: '#FF3B30', bg: 'rgba(255,59,48,0.15)' },
  entertainment: { emoji: '🎬', color: '#AF52DE', bg: 'rgba(175,82,222,0.15)' },
  groceries: { emoji: '🛒', color: '#34C759', bg: 'rgba(52,199,89,0.15)' },
  travel: { emoji: '✈️', color: '#007AFF', bg: 'rgba(0,122,255,0.15)' },
  other: { emoji: '💸', color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },
};

/* ── Time-ago helper ──────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/* ── Donut Ring Chart ─────────────────────────────── */
const RING_COLORS = ['#6347F5', '#FFD60A', '#30D158', '#FF6B6B', '#5AC8FA', '#FF9F0A'];

function DonutChart({ memberBalances, members, totalSpend, currSymbol, user }) {
  const R = 88, CX = 128, CY = 128, stroke = 18;
  const circumference = 2 * Math.PI * R;

  // Build segments based on each member's amount paid
  const paid = members.map(m => ({
    id: m.user._id,
    name: m.user.name,
    amount: memberBalances?.[m.user._id]?.paid || 0,
  }));
  const totalPaid = paid.reduce((s, x) => s + x.amount, 0) || 1;

  let offset = 0;
  // subtract 2deg gap per segment for visual separation
  const segments = paid.map((m, i) => {
    const fraction = m.amount / totalPaid;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const seg = { ...m, fraction, dash, gap, offset, color: RING_COLORS[i % RING_COLORS.length] };
    offset += dash;
    return seg;
  });

  return (
    <div style={{ position: 'relative', width: '256px', height: '256px', margin: '0 auto' }}>
      <svg width="256" height="256" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F0F0F5" strokeWidth={stroke} />
        {/* Segments */}
        {segments.map((seg, i) => (
          <circle
            key={seg.id}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${seg.dash - 4} ${circumference - seg.dash + 4}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 600ms ease' }}
          />
        ))}
      </svg>

      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E93', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL POOL</p>
        <p style={{ fontSize: '28px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-1px', lineHeight: '1' }}>
          {currSymbol}{totalSpend.toLocaleString()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 11.5V2.5M7 2.5L3 6M7 2.5L11 6" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#34C759' }}>Active</span>
        </div>
      </div>

      {/* Member avatars around ring */}
      {members.slice(0, Math.min(members.length, 4)).map((m, i) => {
        const angle = (i / Math.min(members.length, 4)) * 2 * Math.PI - Math.PI / 2;
        const r2 = R + stroke / 2 + 24;
        const x = CX + r2 * Math.cos(angle);
        const y = CY + r2 * Math.sin(angle);
        const bal = memberBalances?.[m.user._id];
        const net = bal?.net || 0;
        const isYou = m.user._id === user?._id;
        const color = RING_COLORS[i % RING_COLORS.length];
        return (
          <div key={m.user._id} style={{
            position: 'absolute',
            left: `${x - 22}px`, top: `${y - 22}px`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              <Avatar name={m.user.name} style={{ width: '40px', height: '40px', fontSize: '15px' }} />
            </div>
            {Math.abs(net) > 0.5 && (
              <div style={{ background: net > 0 ? '#34C759' : '#FF3B30', borderRadius: '8px', padding: '1px 5px', fontSize: '9px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap' }}>
                {net > 0 ? '+' : ''}{currSymbol}{Math.abs(net).toFixed(0)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Expense Item ─────────────────────────────────── */
const ExpenseItem = memo(function ExpenseItem({ expense, userId, currSymbol, isLast }) {
  const cat = CAT[expense.category] || CAT.other;
  const isFirst = false;

  // Compute user's share
  const mySplit = expense.splits?.find(s => s.user?.toString() === userId || s.user === userId);
  const paidByMe = expense.paidBy?._id === userId;
  let shareAmt = 0;
  let shareColor = '#8E8E93';
  let shareLabel = '';
  if (paidByMe && !mySplit) {
    shareAmt = expense.amount;
    shareColor = '#34C759';
    shareLabel = `+${currSymbol}${expense.amount.toFixed(2)} Paid by you`;
  } else if (paidByMe && mySplit) {
    const othersOwe = expense.amount - (mySplit.amount || 0);
    shareAmt = othersOwe;
    shareColor = '#34C759';
    shareLabel = `+${currSymbol}${othersOwe.toFixed(2)} Owed to you`;
  } else if (mySplit) {
    shareAmt = mySplit.amount;
    shareColor = '#FF3B30';
    shareLabel = `-${currSymbol}${mySplit.amount.toFixed(2)} Your share`;
  }

  const memberCount = expense.splits?.length || 0;
  const splitLabel = expense.splitType === 'equal'
    ? `Split equally among ${memberCount}`
    : expense.splitType === 'custom'
      ? 'Split by amount'
      : 'Split by percentage';

  return (
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '16px',
      marginBottom: isLast ? 0 : '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Category icon */}
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
          {cat.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#1C1C1E', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
              {expense.description}
            </p>
            <span style={{ fontSize: '12px', color: '#8E8E93', flexShrink: 0, marginLeft: '8px' }}>{timeAgo(expense.createdAt)}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#8E8E93', margin: '2px 0 0' }}>
            {expense.paidBy?._id === userId ? 'You' : expense.paidBy?.name?.split(' ')[0]} paid {currSymbol}{expense.amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Split info row */}
      {(shareLabel || splitLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>{splitLabel}</p>
          <span style={{ fontSize: '14px', fontWeight: '700', color: shareColor }}>{shareLabel}</span>
        </div>
      )}
    </div>
  );
});

/* ── Main Component ───────────────────────────────── */
export default function GroupDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeGroup, loading, fetchGroup } = useGroupStore();
  const { user } = useAuthStore();
  const { sendReminder } = useNotificationStore();
  const [remindModal, setRemindModal] = useState(null);
  const [customMsg, setCustomMsg] = useState('');
  const [remindLoading, setRemindLoading] = useState(false);

  useEffect(() => { fetchGroup(id); }, [id]);

  const handleSendReminder = useCallback(async (msg) => {
    if (!remindModal) return;
    setRemindLoading(true);
    try {
      await sendReminder(remindModal.id, id, Math.abs(remindModal.amount), msg);
      setRemindModal(null); setCustomMsg('');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setRemindLoading(false); }
  }, [remindModal, id, sendReminder]);

  const g = activeGroup;
  const currSymbol = g?.currencySymbol || '₹';
  const isSettled = g?.balance?.isSettled;
  const youOwe = g?.balance?.youOwe || 0;
  const youAreOwed = g?.balance?.youAreOwed || 0;
  const totalSpend = g?.balance?.totalSpend || 0;
  const userId = user?._id;

  /* ── Status line ── */
  let statusEmoji = '😎', statusTitle = 'Everything is chill', statusSub = "No debts to settle. You're all good!";
  let statusColor = '#1C1C1E';
  if (youOwe > 0) {
    statusEmoji = '😬'; statusTitle = `You owe ${currSymbol}${youOwe.toFixed(0)}`;
    statusSub = 'Settle up when you\'re ready.'; statusColor = '#FF3B30';
  } else if (youAreOwed > 0) {
    statusEmoji = '🤑'; statusTitle = `You're owed ${currSymbol}${youAreOwed.toFixed(0)}`;
    statusSub = "Nice! Others owe you money."; statusColor = '#34C759';
  }

  /* ── Loading state ── */
  if (loading && !g) {
    return (
      <div style={{ background: '#F5F5FA', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', justifyContent: 'space-between' }}>
          <Skeleton width="32px" height="32px" borderRadius="50%" />
          <Skeleton width="130px" height="20px" />
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
        <Skeleton width="200px" height="32px" style={{ margin: '24px auto 8px' }} />
        <Skeleton width="260px" height="260px" borderRadius="50%" style={{ margin: '24px auto' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Skeleton height="52px" borderRadius="100px" style={{ flex: 1 }} />
          <Skeleton height="52px" borderRadius="100px" style={{ flex: 1 }} />
        </div>
      </div>
    );
  }

  if (!loading && !g) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', fontSize: '17px', color: '#8E8E93' }}>Group not found</div>;
  }

  return (
    <div style={{ background: '#F5F5FA', minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 0', position: 'sticky', top: 0, zIndex: 10,
        background: '#F5F5FA',
      }}>
        <button onClick={() => navigate('/groups')} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', color: '#1C1C1E' }}>
          <IoChevronBack />
        </button>
        <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#1C1C1E', margin: 0 }}>{g?.name}</h1>
        <button onClick={() => navigate(`/groups/${id}/settings`)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', color: '#1C1C1E' }}>
          <IoSettingsOutline />
        </button>
      </div>

      <div style={{ padding: '0 20px 48px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

        {/* ── STATUS ── */}
        <div style={{ textAlign: 'center', padding: '28px 0 16px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
            {statusTitle} {statusEmoji}
          </h2>
          <p style={{ fontSize: '15px', color: '#8E8E93', margin: 0 }}>{statusSub}</p>
        </div>

        {/* ── RING CHART ── */}
        {g && (
          <DonutChart
            memberBalances={g.memberBalances}
            members={g.members || []}
            totalSpend={totalSpend}
            currSymbol={currSymbol}
            user={user}
          />
        )}

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', marginBottom: '32px' }}>
          <button
            onClick={() => navigate(`/groups/${id}/add-expense`)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '16px 20px',
              background: '#1C1C1E',
              color: '#FFFFFF',
              fontSize: '16px', fontWeight: '700',
              borderRadius: '100px', border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span>
            Add Expense
          </button>

          <button
            onClick={() => navigate(`/groups/${id}/settle`)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '16px 20px',
              background: '#fff',
              color: '#1C1C1E',
              fontSize: '16px', fontWeight: '700',
              borderRadius: '100px', border: '2px solid rgba(0,0,0,0.1)', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: '18px' }}>💳</span>
            Settle Balance
          </button>
        </div>

        {/* ── EXPENSES SECTION ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1C1C1E', margin: 0, letterSpacing: '-0.3px' }}>Group Expenses</h2>
          <span
            style={{ fontSize: '14px', fontWeight: '600', color: '#6347F5', cursor: 'pointer' }}
            onClick={() => navigate(`/groups/${id}/settings`)}
          >
            View All
          </span>
        </div>

        {/* Expense list */}
        {!g?.expenses || g.expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🧾</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1C1E', marginBottom: '8px' }}>No expenses yet</h3>
            <p style={{ fontSize: '15px', color: '#8E8E93', marginBottom: '24px' }}>Add your first expense to start tracking.</p>
            <button
              onClick={() => navigate(`/groups/${id}/add-expense`)}
              style={{ padding: '14px 28px', background: '#6347F5', color: '#fff', fontSize: '16px', fontWeight: '700', borderRadius: '100px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,71,245,0.3)' }}
            >
              + Add Expense
            </button>
          </div>
        ) : (
          <div>
            {g.expenses.map((expense, idx) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                userId={userId}
                currSymbol={currSymbol}
                isLast={idx === g.expenses.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FAB ── */}
      <button
        onClick={() => navigate(`/groups/${id}/add-expense`)}
        style={{
          position: 'fixed', bottom: '28px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
          color: '#fff', fontSize: '24px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99,71,245,0.4)',
          zIndex: 100,
        }}
      >
        +
      </button>

      {/* ── REMINDER MODAL ── */}
      {remindModal && (
        <Modal show={!!remindModal} onClose={() => setRemindModal(null)} title={`Remind ${remindModal.name}`} variant="sheet">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
            <p style={{ fontSize: '15px', color: '#8E8E93' }}>Send a nudge about the {currSymbol}{Math.abs(remindModal.amount).toFixed(0)} outstanding.</p>
            {['Hey! Just a reminder about the payment.', "Don't forget to settle up!"].map(msg => (
              <button key={msg} onClick={() => handleSendReminder(msg)} disabled={remindLoading} style={{ padding: '12px 16px', textAlign: 'left', background: '#F2F2F7', color: '#000', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer' }}>
                "{msg}"
              </button>
            ))}
            <textarea value={customMsg} onChange={e => setCustomMsg(e.target.value)} placeholder="Write your own message..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', background: '#F2F2F7', minHeight: '80px', outline: 'none', fontSize: '15px', fontFamily: 'inherit', resize: 'none' }} />
            <button className="btn-primary" onClick={() => handleSendReminder(customMsg)} disabled={remindLoading || !customMsg.trim()}>
              {remindLoading ? 'Sending...' : 'Send Custom Reminder'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
