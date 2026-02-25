import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { IoArrowForward } from 'react-icons/io5';
import useSettlementStore from '../stores/settlementStore';
import useGroupStore from '../stores/groupStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';

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

  const handleSettleAll = async () => {
    setSettling(true);
    try {
      await settleAll(id);
      await fetchGroup(id);
      navigate(`/groups/${id}/settled`, { replace: true });
    } catch (err) {
      // error handled in store
    }
    setSettling(false);
  };

  const handleSettleSingle = async (transfer) => {
    try {
      await settleSingle(id, {
        fromUser: transfer.from._id,
        toUser: transfer.to._id,
        amount: transfer.amount
      });
      fetchSettlements(id);
      fetchGroup(id);
    } catch (err) { }
  };

  if (loading && !settlementData) {
    return <div className="page"><div className="loading-center"><div className="spinner"></div></div></div>;
  }

  const data = settlementData;
  const currSymbol = data?.currencySymbol || '₹';

  return (
    <div className="page page-white" style={{ padding: '0 20px' }}>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack /> Back
        </button>
        <span className="header-title">Settle Up</span>
        <div style={{ width: '60px' }}></div>
      </div>

      {/* Summary */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Total to settle</p>
        <p style={{ fontSize: '36px', fontWeight: '800' }}>
          {currSymbol}{(data?.totalToSettle || 0).toFixed(2)}
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {data?.pendingCount || 0} payment{data?.pendingCount !== 1 ? 's' : ''} needed
        </p>
      </div>

      {/* Transfers */}
      {data?.transfers?.length > 0 ? (
        <div>
          <h3 className="caption" style={{ marginBottom: '12px' }}>OPTIMIZED PAYMENTS</h3>
          {data.transfers.map((transfer, i) => (
            <div key={i} className="card animate-fade-in" style={{ marginBottom: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar name={transfer.from.name} size="sm" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>pays</span>
                  <IoArrowForward style={{ color: 'var(--blue)', fontSize: '18px' }} />
                </div>
                <Avatar name={transfer.to.name} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', fontSize: '16px' }}>{currSymbol}{transfer.amount.toFixed(2)}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {transfer.from.name?.split(' ')[0]} → {transfer.to.name?.split(' ')[0]}
                  </p>
                </div>
                <button
                  onClick={() => handleSettleSingle(transfer)}
                  style={{ padding: '8px 16px', background: 'var(--blue-light)', color: 'var(--blue)', borderRadius: 'var(--radius-full)', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Settle
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-state-icon">✅</div>
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
        icon="💸"
        title="Settle All?"
        message={`Mark all ${data?.pendingCount || 0} payment(s) totalling ${currSymbol}${(data?.totalToSettle || 0).toFixed(2)} as settled?`}
        onClose={() => setShowSettleModal(false)}
      >
        <div className="modal-actions">
          <div className="modal-actions-row">
            <button onClick={() => setShowSettleModal(false)} style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }}>Cancel</button>
            <button onClick={handleSettleAll} disabled={settling} style={{ background: 'var(--blue)', color: 'white' }}>
              {settling ? 'Settling...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
