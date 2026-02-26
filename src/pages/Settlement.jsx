import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoArrowForward, IoCheckmarkCircle } from 'react-icons/io5';
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
      await fetchGroup(id);
      navigate(`/groups/${id}/settled`, { replace: true });
    } catch (err) {
      // error handled in store
    }
    setSettling(false);
  }, [id, settleAll, fetchGroup, navigate]);

  const handleSettleSingle = useCallback(async (transfer) => {
    try {
      await settleSingle(id, {
        fromUser: transfer.from._id,
        toUser: transfer.to._id,
        amount: transfer.amount
      });
      fetchSettlements(id);
      fetchGroup(id);
    } catch (err) { }
  }, [id, settleSingle, fetchSettlements, fetchGroup]);

  if (loading && !settlementData) {
    return (
      <div className="page page-white" style={{ padding: '0 20px' }}>
        <div className="header">
          <button className="header-back" onClick={() => navigate(-1)}>
            <IoChevronBack style={{ fontSize: '20px' }} /> Back
          </button>
          <span className="header-title">Settle Up</span>
          <div style={{ width: '60px' }}></div>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Skeleton width="100px" height="13px" style={{ margin: '0 auto 8px' }} />
          <Skeleton width="160px" height="36px" style={{ margin: '0 auto 8px' }} />
          <Skeleton width="120px" height="13px" style={{ margin: '0 auto' }} />
        </div>
        <Skeleton width="140px" height="14px" style={{ marginBottom: '16px' }} />
        {[1, 2].map(i => (
          <div key={i} className="card" style={{ marginBottom: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Skeleton width="32px" height="32px" borderRadius="50%" />
              <Skeleton width="20px" height="20px" />
              <Skeleton width="32px" height="32px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60px" height="16px" style={{ marginBottom: '6px' }} />
                <Skeleton width="80px" height="12px" />
              </div>
              <Skeleton width="70px" height="32px" borderRadius="9999px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const data = settlementData;
  const currSymbol = data?.currencySymbol || '\u20B9';

  return (
    <div className="page page-white" style={{ padding: '0 20px' }}>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack style={{ fontSize: '20px' }} /> Back
        </button>
        <span className="header-title">Settle Up</span>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* Summary */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total to settle</p>
        <p style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          {currSymbol}{(data?.totalToSettle || 0).toFixed(2)}
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {data?.pendingCount || 0} payment{data?.pendingCount !== 1 ? 's' : ''} pending
        </p>
      </div>

      {/* Transfers */}
      {data?.transfers?.length > 0 ? (
        <div>
          <h3 className="caption" style={{ marginBottom: '12px' }}>OPTIMIZED PAYMENTS</h3>
          {data.transfers.map((transfer, i) => (
            <div key={i} className="card animate-fade-in" style={{ marginBottom: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar name={transfer.from.name} size="sm" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>pays</span>
                  <IoArrowForward style={{ color: 'var(--blue)', fontSize: '16px' }} />
                </div>
                <Avatar name={transfer.to.name} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', fontSize: '17px' }}>{currSymbol}{transfer.amount.toFixed(2)}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {transfer.from.name?.split(' ')[0]} to {transfer.to.name?.split(' ')[0]}
                  </p>
                </div>
                <button
                  onClick={() => handleSettleSingle(transfer)}
                  style={{ padding: '8px 16px', background: 'var(--blue-light)', color: 'var(--blue)', borderRadius: '9999px', fontWeight: '600', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'transform 120ms ease-out' }}
                >
                  Settle
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-state-icon">
            <IoCheckmarkCircle style={{ fontSize: '32px', color: 'var(--green)' }} />
          </div>
          <h3 className="empty-state-title">All settled!</h3>
          <p className="empty-state-text">Everyone's even. Great teamwork!</p>
        </div>
      )}

      {data?.transfers?.length > 0 && (
        <button className="btn-primary" onClick={() => setShowSettleModal(true)} style={{ marginTop: '24px', marginBottom: '32px' }}>
          Settle All Balances
        </button>
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
