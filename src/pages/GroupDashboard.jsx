import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoSettingsOutline } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useNotificationStore from '../stores/notificationStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';

/* ────────────────────────────────────────────
   Memoised member row – matches PNG exactly
   ──────────────────────────────────────────── */
const MemberRow = memo(function MemberRow({ member, isYou, currSymbol, isLast }) {
  const m = member.user;
  const net = member.net ?? 0;
  const subtext = member.subtext || '';

  let amountStr, amountColor;
  if (net > 0.01) {
    amountStr = `+ ${currSymbol}${Math.abs(net).toFixed(0)}`;
    amountColor = '#34C759';
  } else if (net < -0.01) {
    amountStr = `- ${currSymbol}${Math.abs(net).toFixed(0)}`;
    amountColor = '#FF3B30';
  } else {
    amountStr = `${currSymbol}0`;
    amountColor = '#8E8E93';
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
    }}>
      {/* Avatar */}
      <div style={{ marginRight: '12px', position: 'relative', flexShrink: 0 }}>
        <Avatar name={m.name} />
        {isYou && (
          <div style={{
            position: 'absolute', bottom: '-1px', right: '-3px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#007AFF', border: '2.5px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Name + subtext */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '17px', fontWeight: '600', lineHeight: '22px',
          color: '#000', margin: 0,
        }}>
          {isYou ? 'You' : m.name}
        </p>
        {subtext && (
          <p style={{
            fontSize: '13px', color: '#8E8E93', margin: '2px 0 0',
            lineHeight: '18px',
          }}>
            {subtext}
          </p>
        )}
      </div>

      {/* Amount */}
      <span style={{
        fontSize: '17px', fontWeight: '700', color: amountColor,
        flexShrink: 0, marginLeft: '12px', letterSpacing: '-0.3px',
      }}>
        {amountStr}
      </span>
    </div>
  );
});

/* ────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────── */
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
      setRemindModal(null);
      setCustomMsg('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reminder');
    } finally {
      setRemindLoading(false);
    }
  }, [remindModal, id, sendReminder]);

  const g = activeGroup;

  if (!loading && !g) {
    return (
      <div className="page" style={{ background: '#F2F2F7' }}>
        <div className="empty-state"><p>Group not found</p></div>
      </div>
    );
  }

  const currSymbol = g?.currencySymbol || '\u20B9';

  /* ── Derive pending settlement ── */
  const pendingTransfer = g?.pendingSettlements?.[0] || null;

  /* ── Build member rows with subtexts ── */
  const memberRows = g?.members?.map(member => {
    const m = member.user;
    const balance = g.memberBalances?.[m._id];
    const net = balance?.net || 0;
    const isYou = m._id === user?._id;

    let subtext = '';
    if (isYou) {
      subtext = `Paying for ${g.members?.length || 1} share${(g.members?.length || 1) > 1 ? 's' : ''}`;
    } else if (Math.abs(net) < 0.01) {
      subtext = 'Settled up';
    } else if (net > 0) {
      subtext = `Owes you ${currSymbol}${Math.abs(net).toFixed(0)}`;
    } else {
      subtext = `You owe ${currSymbol}${Math.abs(net).toFixed(0)}`;
    }

    return { ...member, net, subtext, isYou };
  }) || [];

  return (
    <div style={{
      background: '#F2F2F7',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      maxWidth: '430px',
      margin: '0 auto',
      position: 'relative',
    }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        paddingTop: '10px',
        paddingBottom: '8px',
        minHeight: '44px',
        background: '#F2F2F7',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {/* Left – back */}
        <button
          onClick={() => navigate('/groups')}
          style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, color: '#007AFF', fontSize: '17px',
            fontWeight: '400', minWidth: '60px',
          }}
        >
          <IoChevronBack style={{ fontSize: '24px' }} />
          <span>Back</span>
        </button>

        {/* Center – title */}
        <h1 style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: '17px', fontWeight: '600', color: '#000',
          margin: 0, maxWidth: '55%', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {g?.name || ''}
        </h1>

        {/* Right – settings gear */}
        <button
          onClick={() => navigate(`/groups/${id}/settings`)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, color: '#007AFF', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <IoSettingsOutline style={{ fontSize: '24px' }} />
        </button>
      </div>

      {/* ═══════════════ SCROLLABLE CONTENT ═══════════════ */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 20px',
        paddingBottom: '100px',
      }}>

        {/* ── Skeleton while loading ── */}
        {loading && !g && (
          <div>
            <div style={{ textAlign: 'center', padding: '48px 0 24px' }}>
              <Skeleton width="100px" height="14px" style={{ margin: '0 auto 12px' }} />
              <Skeleton width="220px" height="44px" style={{ margin: '0 auto 10px' }} />
              <Skeleton width="180px" height="16px" style={{ margin: '0 auto' }} />
            </div>
            <Skeleton height="68px" borderRadius="24px" style={{ marginBottom: '36px' }} />
            <Skeleton width="160px" height="22px" style={{ marginBottom: '16px' }} />
            <Skeleton height="300px" borderRadius="16px" />
          </div>
        )}

        {/* ── Real content ── */}
        {g && (
          <>
            {/* ═══ YOUR BALANCE (floating text, no card) ═══ */}
            <div style={{ textAlign: 'center', padding: '44px 0 8px' }}>

              {/* "Your balance" label – green tint */}
              <p style={{
                fontSize: '16px', color: '#34C759', fontWeight: '500',
                margin: '0 0 10px', lineHeight: '20px',
              }}>
                Your balance
              </p>

              {/* Big balance amount */}
              {(g.balance?.youOwe > 0) ? (
                <p style={{
                  fontSize: '40px', fontWeight: '700', color: '#FF3B30',
                  margin: '0 0 10px', lineHeight: '1.05', letterSpacing: '-0.8px',
                }}>
                  You owe {currSymbol}{g.balance.youOwe.toFixed(0)}
                </p>
              ) : (g.balance?.youAreOwed > 0) ? (
                <p style={{
                  fontSize: '40px', fontWeight: '700', color: '#34C759',
                  margin: '0 0 10px', lineHeight: '1.05', letterSpacing: '-0.8px',
                }}>
                  You are owed {currSymbol}{g.balance.youAreOwed.toFixed(0)}
                </p>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', margin: '0 0 10px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="#34C759" />
                    <path d="M8 14.5l3.5 3.5L20 10" stroke="white" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontSize: '22px', fontWeight: '700', color: '#34C759' }}>
                    All Settled
                  </span>
                </div>
              )}

              {/* Total group spend */}
              <p style={{
                fontSize: '15px', color: '#8E8E93', fontWeight: '400',
                margin: 0, lineHeight: '20px',
              }}>
                Total group spend <span style={{ color: '#1C1C1E', fontWeight: '600' }}>
                  {currSymbol}{(g.balance?.totalSpend || 0).toLocaleString('en-IN')}
                </span>
              </p>
            </div>

            {/* ═══ PENDING SETTLEMENT CARD ═══ */}
            {(g.balance?.youOwe > 0 || pendingTransfer) && (
              <div style={{
                background: '#EBF2FF',
                borderRadius: '24px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '28px 0 0',
              }}>
                {/* Currency circle */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(0,122,255,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#007AFF' }}>
                    {currSymbol}
                  </span>
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '15px', fontWeight: '600', color: '#1C1C1E',
                    margin: 0, lineHeight: '20px',
                  }}>
                    {currSymbol}{(pendingTransfer?.amount || g.balance?.youOwe || 0).toFixed(0)} pending settlement
                  </p>
                  <p style={{
                    fontSize: '13px', color: '#8E8E93', margin: '1px 0 0',
                    lineHeight: '18px',
                  }}>
                    {pendingTransfer ? `From ${pendingTransfer.from?.name?.split(' ')[0] || 'member'}` : 'Tap to settle'}
                  </p>
                </div>

                {/* Settle Now pill */}
                <button
                  onClick={() => navigate(`/groups/${id}/settle`)}
                  style={{
                    background: '#007AFF', color: 'white',
                    fontSize: '15px', fontWeight: '600',
                    padding: '0 20px', height: '36px', borderRadius: '18px',
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'transform 120ms ease-out',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  Settle Now
                </button>
              </div>
            )}

            {/* ═══ MEMBER BALANCES ═══ */}
            <h2 style={{
              fontSize: '22px', fontWeight: '700', color: '#1C1C1E',
              margin: '36px 0 14px', letterSpacing: '-0.3px', lineHeight: '28px',
            }}>
              Member Balances
            </h2>

            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 0.5px 1px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.03)',
            }}>
              {memberRows.map((member, idx) => (
                <MemberRow
                  key={member.user._id}
                  member={member}
                  isYou={member.isYou}
                  currSymbol={currSymbol}
                  isLast={idx === memberRows.length - 1}
                />
              ))}
            </div>

            {/* Spacer */}
            <div style={{ height: '24px' }} />
          </>
        )}
      </div>

      {/* ═══════════════ BOTTOM NAV ═══════════════ */}
      <BottomNav />

      {/* ═══════════════ REMINDER MODAL ═══════════════ */}
      {remindModal && (
        <Modal
          show={!!remindModal}
          onClose={() => setRemindModal(null)}
          title={`Remind ${remindModal.name}`}
          variant="sheet"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
            <p style={{ fontSize: '15px', color: '#8E8E93' }}>
              Send a friendly nudge about the {currSymbol}{Math.abs(remindModal.amount).toFixed(0)} outstanding.
            </p>

            <button
              onClick={() => handleSendReminder("Hey! Just a reminder about the payment.")}
              disabled={remindLoading}
              style={{
                padding: '12px 16px', textAlign: 'left',
                background: '#F2F2F7', color: '#000', border: 'none',
                borderRadius: '12px', fontSize: '15px', cursor: 'pointer',
              }}
            >
              "Hey! Just a reminder about the payment."
            </button>

            <button
              onClick={() => handleSendReminder("Don't forget to settle up!")}
              disabled={remindLoading}
              style={{
                padding: '12px 16px', textAlign: 'left',
                background: '#F2F2F7', color: '#000', border: 'none',
                borderRadius: '12px', fontSize: '15px', cursor: 'pointer',
              }}
            >
              "Don't forget to settle up!"
            </button>

            <div style={{ marginTop: '4px' }}>
              <label style={{
                fontSize: '13px', fontWeight: '600', color: '#8E8E93',
                display: 'block', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                Custom Message
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Write your own message..."
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: '#F2F2F7', minHeight: '80px', outline: 'none',
                  fontSize: '15px', fontFamily: 'inherit', resize: 'none',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={() => handleSendReminder(customMsg)}
              disabled={remindLoading || !customMsg.trim()}
              style={{ marginTop: '4px' }}
            >
              {remindLoading ? 'Sending...' : 'Send Custom Reminder'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
