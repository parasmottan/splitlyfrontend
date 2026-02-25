import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoSettingsOutline, IoAddCircleOutline } from 'react-icons/io5';
import { HiOutlineBanknotes, HiOutlineDocumentText } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useNotificationStore from '../stores/notificationStore';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import Modal from '../components/Modal';

const CATEGORY_ICONS = {
  food: '🍽️',
  transport: '🚗',
  groceries: '🛒',
  entertainment: '🎬',
  utilities: '💡',
  rent: '🏠',
  travel: '✈️',
  shopping: '🛍️',
  other: '📋'
};

export default function GroupDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeGroup, loading, fetchGroup } = useGroupStore();
  const { user } = useAuthStore();
  const { sendReminder } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('expenses');
  const [remindModal, setRemindModal] = useState(null); // { id, name, amount }
  const [customMsg, setCustomMsg] = useState('');
  const [remindLoading, setRemindLoading] = useState(false);

  useEffect(() => {
    fetchGroup(id);
  }, [id]);

  const handleSendReminder = async (msg) => {
    if (!remindModal) return;
    setRemindLoading(true);
    try {
      await sendReminder(remindModal.id, id, Math.abs(remindModal.amount), msg);
      setRemindModal(null);
      setCustomMsg('');
      alert('Reminder sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reminder');
    } finally {
      setRemindLoading(false);
    }
  };

  if (loading && !activeGroup) {
    return <div className="page"><div className="loading-center"><div className="spinner"></div></div></div>;
  }

  if (!activeGroup) {
    return <div className="page"><div className="empty-state"><p>Group not found</p></div></div>;
  }

  const g = activeGroup;
  const currSymbol = g.currencySymbol || '₹';

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Header title={g.name} onBack={() => navigate('/groups')} />

      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
        {/* Balance Summary */}
        <div className="card" style={{ padding: '20px', margin: '8px 0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '2px' }}>You owe</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: g.balance?.youOwe > 0 ? 'var(--red)' : 'var(--text-tertiary)' }}>
                {currSymbol}{(g.balance?.youOwe || 0).toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '2px' }}>You're owed</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: g.balance?.youAreOwed > 0 ? 'var(--green)' : 'var(--text-tertiary)' }}>
                {currSymbol}{(g.balance?.youAreOwed || 0).toFixed(2)}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--gray-100)' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total spend</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{currSymbol}{(g.balance?.totalSpend || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '14px', gap: '8px', borderRadius: 'var(--radius-md)' }}
            onClick={() => navigate(`/groups/${id}/add-expense`)}
            disabled={g.archived}
          >
            <IoAddCircleOutline style={{ fontSize: '20px' }} />
            Add Expense
          </button>
          <button
            style={{ flex: 1, padding: '14px', background: 'var(--white)', color: 'var(--blue)', fontWeight: '600', fontSize: '15px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate(`/groups/${id}/settle`)}
            disabled={g.archived}
          >
            <HiOutlineBanknotes style={{ fontSize: '20px' }} />
            Settle Up
          </button>
        </div>

        {/* Settings Toggle */}
        <button
          onClick={() => navigate(`/groups/${id}/settings`)}
          style={{ width: '100%', padding: '14px', background: 'var(--gray-50)', border: 'none', borderRadius: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
        >
          <IoSettingsOutline style={{ fontSize: '18px' }} />
          Group Settings & Members
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '16px', background: 'var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
          {['expenses', 'members'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab ? 'var(--white)' : 'transparent',
                borderRadius: activeTab === tab ? 'var(--radius-sm)' : '0',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? '600' : '400',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div>
            {(!g.expenses || g.expenses.length === 0) ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-state-icon"><HiOutlineDocumentText /></div>
                <h3 className="empty-state-title">No expenses yet</h3>
                <p className="empty-state-text">Add your first expense to get started.</p>
              </div>
            ) : (
              g.expenses.map(expense => {
                const isPayer = expense.paidBy?._id === user?._id;
                const userSplit = expense.splits?.find(s => s.user === user?._id || s.user?._id === user?._id);
                let displayAmount;
                let amountColor;

                if (isPayer) {
                  displayAmount = `+${currSymbol}${(expense.amount - (userSplit?.amount || 0)).toFixed(2)}`;
                  amountColor = 'var(--green)';
                } else if (userSplit) {
                  displayAmount = `-${currSymbol}${userSplit.amount.toFixed(2)}`;
                  amountColor = 'var(--red)';
                } else {
                  displayAmount = `${currSymbol}0.00`;
                  amountColor = 'var(--text-secondary)';
                }

                return (
                  <div key={expense._id} className="card animate-fade-in" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        {CATEGORY_ICONS[expense.category] || '📋'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.description}</span>
                          <span style={{ fontWeight: '600', fontSize: '16px', color: amountColor, flexShrink: 0, marginLeft: '8px' }}>
                            {displayAmount}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {isPayer ? 'You paid' : `${expense.paidBy?.name || 'Someone'} paid`} {currSymbol}{expense.amount.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            {g.members?.map(member => {
              const m = member.user;
              const balance = g.memberBalances?.[m._id];
              const net = balance?.net || 0;
              const isDebtor = net < -0.01;
              const isYouDebtor = user?._id === m._id && net < -0.01;
              const amIOwedByThem = (g.balance?.youAreOwed > 0) && (m._id !== user?._id) && isDebtor;

              return (
                <div key={m._id} className="card" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar name={m.name} size="sm" />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>
                          {m._id === user?._id ? 'You' : m.name}
                          {member.role === 'owner' && <span style={{ fontSize: '12px', color: 'var(--blue)', marginLeft: '6px' }}>Owner</span>}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontWeight: '600', fontSize: '15px', color: net > 0 ? 'var(--green)' : net < 0 ? 'var(--red)' : 'var(--text-secondary)' }}>
                            {net > 0 ? `+${currSymbol}${net.toFixed(2)}` : net < 0 ? `-${currSymbol}${Math.abs(net).toFixed(2)}` : 'Settled'}
                          </span>
                          {amIOwedByThem && !g.archived && (
                            <button
                              onClick={() => setRemindModal({ id: m._id, name: m.name, amount: net })}
                              style={{ border: 'none', background: 'var(--blue-light)', color: 'var(--blue)', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px', marginTop: '6px', cursor: 'pointer' }}
                            >
                              Remind
                            </button>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Paid: {currSymbol}{(balance?.paid || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {remindModal && (
        <Modal
          show={!!remindModal}
          onClose={() => setRemindModal(null)}
          title={`Remind ${remindModal.name}`}
          icon="🔔"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Send a friendly nudge to {remindModal.name} about the {currSymbol}{Math.abs(remindModal.amount).toFixed(2)} outstanding balance.
            </p>

            <button
              className="btn-secondary"
              onClick={() => handleSendReminder("Hey! Just a reminder about the payment 🙂")}
              disabled={remindLoading}
              style={{ padding: '12px', textAlign: 'left', background: 'var(--gray-50)', color: 'var(--text-primary)', justifyContent: 'flex-start' }}
            >
              "Hey! Just a reminder about the payment 🙂"
            </button>

            <button
              className="btn-secondary"
              onClick={() => handleSendReminder("Don't forget to settle up!")}
              disabled={remindLoading}
              style={{ padding: '12px', textAlign: 'left', background: 'var(--gray-50)', color: 'var(--text-primary)', justifyContent: 'flex-start' }}
            >
              "Don't forget to settle up!"
            </button>

            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>CUSTOM MESSAGE</label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Write your own message..."
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', minHeight: '80px', outline: 'none', fontSize: '14px' }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={() => handleSendReminder(customMsg)}
              disabled={remindLoading || (!customMsg.trim())}
              style={{ marginTop: '8px' }}
            >
              {remindLoading ? 'Sending...' : 'Send Custom Reminder'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
