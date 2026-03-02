import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSettlementStore from '../stores/settlementStore';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import UpiQrModal from '../components/UpiQrModal';

/* Detect mobile vs desktop for UPI deep-link vs QR fallback */
const isMobileDevice = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* Build a safe UPI deep link */
function buildUpiLink({ upiId, amount, name }) {
  const note = encodeURIComponent('Splitly Settlement');
  const pn = encodeURIComponent(name || 'Splitly');
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${pn}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${note}`;
}

export default function Settlement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settlementData, loading, fetchSettlements, settleAll, settleSingle, getUpiDetails } = useSettlementStore();
  const { fetchGroup } = useGroupStore();
  const { user } = useAuthStore();

  // Settle-all modal
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settling, setSettling] = useState(false);

  // Per-transfer UPI state
  // upiState[transferIndex] = { phase: 'idle'|'loading'|'awaiting'|'done', error, upiData }
  const [upiState, setUpiState] = useState({});

  // QR modal state (desktop only)
  const [qrModal, setQrModal] = useState(null); // { upiLink, amount, receiver, transferIdx }
  const [qrSettling, setQrSettling] = useState(false);

  useEffect(() => {
    fetchSettlements(id);
  }, [id]);

  /* ── Settle All ── */
  const handleSettleAll = useCallback(async () => {
    setSettling(true);
    try {
      await settleAll(id);
      await fetchGroup(id);
      navigate(`/groups/${id}/settled`, {
        replace: true,
        state: {
          totalSettled: settlementData?.totalToSettle || 0,
          memberCount: settlementData?.transfers?.length || 0,
        }
      });
    } catch (err) { }
    setSettling(false);
  }, [id, settleAll, fetchGroup, navigate, settlementData]);

  /* ── Pay via UPI (per transfer) ── */
  const handleUpiPay = useCallback(async (transfer, idx) => {
    // Set loading state for this transfer
    setUpiState(s => ({ ...s, [idx]: { phase: 'loading', error: null, upiData: null } }));

    try {
      const upiData = await getUpiDetails(id, transfer.to._id);
      const upiLink = buildUpiLink({ upiId: upiData.upiId, amount: upiData.amount, name: upiData.receiverName });

      if (isMobileDevice()) {
        // Mobile: redirect to UPI app, then show "Mark as Settled" button
        window.location.href = upiLink;
        // After returning (or after a brief moment), show the awaiting state
        setTimeout(() => {
          setUpiState(s => ({ ...s, [idx]: { phase: 'awaiting', error: null, upiData } }));
        }, 1500);
      } else {
        // Desktop: show QR modal
        setQrModal({ upiLink, amount: upiData.amount, receiver: upiData.receiverName, transferIdx: idx, transfer });
        setUpiState(s => ({ ...s, [idx]: { phase: 'idle', error: null, upiData } }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to get UPI details';
      setUpiState(s => ({ ...s, [idx]: { phase: 'idle', error: msg, upiData: null } }));
    }
  }, [id, getUpiDetails]);

  /* ── Mark as Settled (single transfer, after UPI) ── */
  const handleMarkSettled = useCallback(async (transfer, idx) => {
    setUpiState(s => ({ ...s, [idx]: { ...s[idx], phase: 'loading' } }));
    try {
      await settleSingle(id, { fromUser: transfer.from._id, toUser: transfer.to._id, amount: transfer.amount });
      await fetchSettlements(id);
      await fetchGroup(id);
      setUpiState(s => ({ ...s, [idx]: { phase: 'done', error: null, upiData: null } }));
    } catch (err) {
      setUpiState(s => ({ ...s, [idx]: { ...s[idx], phase: 'awaiting', error: 'Failed to mark settled' } }));
    }
  }, [id, settleSingle, fetchSettlements, fetchGroup]);

  /* ── Mark as Settled from QR modal ── */
  const handleQrSettle = useCallback(async () => {
    if (!qrModal) return;
    const { transfer, transferIdx } = qrModal;
    setQrSettling(true);
    try {
      await settleSingle(id, { fromUser: transfer.from._id, toUser: transfer.to._id, amount: transfer.amount });
      await fetchSettlements(id);
      await fetchGroup(id);
      setQrModal(null);
    } catch (err) {
      // keep modal open on error
    }
    setQrSettling(false);
  }, [qrModal, id, settleSingle, fetchSettlements, fetchGroup]);

  /* ── Loading skeleton ── */
  if (loading && !settlementData) {
    return (
      <div style={{ background: '#fff', minHeight: '100dvh', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1E', fontSize: '20px' }}>←</button>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '17px', fontWeight: '700' }}>Settle Balance</span>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
          <Skeleton width="220px" height="60px" style={{ margin: '0 auto 12px' }} />
          <Skeleton width="180px" height="32px" borderRadius="100px" style={{ margin: '0 auto' }} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: '#F9F9FB', borderRadius: '16px', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Skeleton width="48px" height="48px" borderRadius="50%" />
            <div style={{ flex: 1 }}>
              <Skeleton width="55%" height="16px" style={{ marginBottom: '6px' }} />
              <Skeleton width="70%" height="13px" />
            </div>
            <Skeleton width="70px" height="23px" />
          </div>
        ))}
      </div>
    );
  }

  const data = settlementData;
  const currSymbol = data?.currencySymbol || '₹';

  return (
    <div style={{ background: '#fff', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1E', fontSize: '20px', zIndex: 1 }}>←</button>
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '17px', fontWeight: '700', color: '#1C1C1E' }}>Settle Balance</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: '15px', fontWeight: '600', zIndex: 1, marginLeft: 'auto' }}>Help</button>
      </div>

      {/* Total hero */}
      <div style={{ textAlign: 'center', padding: '32px 24px 28px', background: 'linear-gradient(160deg, #F8F6FF 0%, #F0EEFF 100%)' }}>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#8E8E93', verticalAlign: 'super', marginRight: '2px' }}>{currSymbol}</span>
          <span style={{ fontSize: '52px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-2px' }}>
            {Math.floor(data?.totalToSettle || 0).toLocaleString()}
          </span>
          <span style={{ fontSize: '28px', fontWeight: '600', color: '#8E8E93' }}>
            .{((data?.totalToSettle || 0) % 1).toFixed(2).slice(2)}
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 20px', background: 'rgba(255,59,48,0.1)', borderRadius: '100px', border: '1px solid rgba(255,59,48,0.2)' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#FF3B30' }}>Total outstanding balance</span>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E93', letterSpacing: '0.8px', textTransform: 'uppercase' }}>BREAKDOWN</h3>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue)', cursor: 'pointer' }}>View details</span>
        </div>

        {data?.transfers?.length > 0 ? (
          data.transfers.map((transfer, i) => {
            const isMyDebt = transfer.from._id === user?._id;
            const state = upiState[i] || { phase: 'idle', error: null };

            return (
              <div key={i} style={{
                background: '#F9F9FB', borderRadius: '20px', padding: '16px',
                marginBottom: '10px',
              }}>
                {/* Transfer row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Avatar name={transfer.from.name} style={{ width: '48px', height: '48px', fontSize: '17px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {transfer.from.name?.split(' ')[0] || 'Person'}
                      <span style={{ fontWeight: '400', color: '#8E8E93' }}> → </span>
                      {transfer.to.name?.split(' ')[0] || 'Person'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0 }}>
                      {isMyDebt ? 'You owe' : `${transfer.from.name?.split(' ')[0]} owes`} {currSymbol}{transfer.amount.toFixed(2)}
                    </p>
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: isMyDebt ? '#FF3B30' : '#34C759', flexShrink: 0 }}>
                    {isMyDebt ? '-' : '+'}{currSymbol}{transfer.amount.toFixed(2)}
                  </span>
                </div>

                {/* Error banner */}
                {state.error && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,59,48,0.08)', borderRadius: 10, fontSize: 13, color: '#FF3B30', fontWeight: '500' }}>
                    ⚠️ {state.error}
                  </div>
                )}

                {/* Per-transfer action — only shown for debts the current user owes */}
                {isMyDebt && state.phase !== 'done' && (
                  <div style={{ marginTop: 12 }}>
                    {state.phase === 'awaiting' ? (
                      /* Post-UPI redirect: show "Mark as Settled" */
                      <div>
                        <p style={{ fontSize: 12, color: '#8E8E93', textAlign: 'center', marginBottom: 8 }}>
                          Payment done? Confirm to update the group balance.
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleMarkSettled(transfer, i)}
                            disabled={state.phase === 'loading'}
                            style={{
                              flex: 1, padding: '11px', fontSize: 14, fontWeight: '700',
                              background: 'linear-gradient(135deg, #34C759 0%, #28A745 100%)',
                              color: '#fff', border: 'none', borderRadius: 100, cursor: 'pointer',
                              boxShadow: '0 4px 14px rgba(52,199,89,0.3)',
                              opacity: state.phase === 'loading' ? 0.7 : 1,
                            }}
                          >
                            ✓ Mark as Settled
                          </button>
                          <button
                            onClick={() => setUpiState(s => ({ ...s, [i]: { phase: 'idle', error: null } }))}
                            style={{
                              padding: '11px 16px', fontSize: 14, fontWeight: '600',
                              background: '#fff', color: '#8E8E93', border: '1px solid #E5E5EA',
                              borderRadius: 100, cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Idle / loading: show Pay via UPI */
                      <button
                        onClick={() => handleUpiPay(transfer, i)}
                        disabled={state.phase === 'loading'}
                        style={{
                          width: '100%', padding: '12px',
                          background: state.phase === 'loading'
                            ? 'rgba(99,71,245,0.08)'
                            : 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
                          color: state.phase === 'loading' ? '#6347F5' : '#fff',
                          fontSize: 14, fontWeight: '700',
                          border: state.phase === 'loading' ? '1.5px solid rgba(99,71,245,0.2)' : 'none',
                          borderRadius: 100, cursor: state.phase === 'loading' ? 'default' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: 'all 200ms',
                        }}
                      >
                        {state.phase === 'loading' ? (
                          <>
                            <span style={{ fontSize: 13 }}>Verifying amount...</span>
                            <div style={{ width: 14, height: 14, border: '2px solid #6347F5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                          </>
                        ) : (
                          <>
                            <span>Pay via UPI</span>
                            <span style={{ fontSize: 16 }}>💸</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Done badge */}
                {state.phase === 'done' && (
                  <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#34C759' }}>
                    ✓ Marked as Settled
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '17px' }}>
            🎉 All settled!
          </div>
        )}
      </div>

      {/* Settle All CTA */}
      {data?.transfers?.length > 0 && (
        <div style={{ padding: '16px 24px 40px' }}>
          <button
            onClick={() => setShowSettleModal(true)}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
              color: 'white', fontSize: '17px', fontWeight: '700',
              borderRadius: '100px', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🔐</span>
            Settle All
            <span style={{ marginLeft: '4px' }}>→</span>
          </button>
          <p style={{ textAlign: 'center', color: '#8E8E93', fontSize: '12px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            🔒 Payments secured by 256-bit encryption
          </p>
        </div>
      )}

      {/* Confirm Settle-All Modal */}
      <Modal
        show={showSettleModal}
        title="Settle All?"
        message={`Mark all ${data?.pendingCount || 0} payment(s) totalling ${currSymbol}${(data?.totalToSettle || 0).toFixed(2)} as settled?`}
        onClose={() => setShowSettleModal(false)}
        variant="alert"
      >
        <div className="modal-divider" />
        <div className="modal-actions-row">
          <button onClick={() => setShowSettleModal(false)}>Cancel</button>
          <button className="modal-btn-primary" onClick={handleSettleAll} disabled={settling}>
            {settling ? 'Settling...' : 'Confirm'}
          </button>
        </div>
      </Modal>

      {/* Desktop QR Modal */}
      {qrModal && (
        <UpiQrModal
          upiLink={qrModal.upiLink}
          amount={qrModal.amount}
          receiver={qrModal.receiver}
          onClose={() => setQrModal(null)}
          onSettle={handleQrSettle}
          settling={qrSettling}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
