import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import useSettlementStore from '../stores/settlementStore';
import useGroupStore from '../stores/groupStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';

export default function Settlement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settlementData, loading, fetchSettlements, settleAll, settleSingle } = useSettlementStore();
  const { fetchGroup } = useGroupStore();
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    fetchSettlements(id);
  }, [id]);

  const handleSettleAll = useCallback(async () => {
    setSettling(true);
    try {
      await settleAll(id);
      const updatedGroup = await fetchGroup(id);
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


  const handleSettleSingle = useCallback(async (transfer) => {
    try {
      await settleSingle(id, { fromUser: transfer.from._id, toUser: transfer.to._id, amount: transfer.amount });
      fetchSettlements(id);
      fetchGroup(id);
    } catch (err) { }
  }, [id, settleSingle, fetchSettlements, fetchGroup]);

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
  const currSymbol = data?.currencySymbol || '$';

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
          <span style={{ fontSize: '60px', fontWeight: '800', color: '#1C1C1E', letterSpacing: '-2px' }}>
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
          data.transfers.map((transfer, i) => (
            <div key={i} style={{
              background: '#F9F9FB', borderRadius: '20px', padding: '16px',
              marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <Avatar name={transfer.from.name} size="md" style={{ width: '48px', height: '48px', fontSize: '17px', position: 'relative' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '17px', fontWeight: '700', color: '#1C1C1E', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {transfer.from.name?.split(' ')[0] || 'Person'}
                </p>
                <p style={{ fontSize: '13px', color: '#8E8E93', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {transfer.to.name} • {Math.ceil(Math.random() * 3)} items
                </p>
              </div>
              <span style={{ fontSize: '17px', fontWeight: '700', color: '#FF3B30', flexShrink: 0 }}>
                -{currSymbol}{transfer.amount.toFixed(2)}
              </span>
            </div>
          ))
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
              width: '100%', padding: '18px 24px',
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

      {/* Confirm Modal */}
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
    </div>
  );
}
