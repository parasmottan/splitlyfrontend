import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoSettingsOutline, IoAddCircleOutline, IoReceiptOutline } from 'react-icons/io5';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';
import useAuthStore from '../stores/authStore';
import useNotificationStore from '../stores/notificationStore';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';

export default function GroupDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeGroup, loading, fetchGroup } = useGroupStore();
  const { user } = useAuthStore();
  const { sendReminder } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('expenses');
  const [remindModal, setRemindModal] = useState(null);
  const [customMsg, setCustomMsg] = useState('');
  const [remindLoading, setRemindLoading] = useState(false);

  useEffect(() => {
    fetchGroup(id);
  }, [id]);

  const handleSendReminder = useCallback(async (msg) => {
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
  }, [remindModal, id, sendReminder]);

  const g = activeGroup;

  if (!loading && !g) {
    return <div className="page"><div className="empty-state"><p>Group not found</p></div></div>;
  }

  const currSymbol = g?.currencySymbol || '\u20B9';

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="header" style={{ padding: '12px 20px' }}>
        <button className="header-back" onClick={() => navigate('/groups')}>
          <IoChevronBack style={{ fontSize: '20px' }} /> Groups
        </button>
        <span className="header-title">{g?.name || 'Loading...'}</span>
        <button
          className="header-action"
          onClick={() => navigate(`/groups/${id}/settings`)}
          style={{ fontSize: '17px' }}
        >
          Settings
        </button>
      </div>

      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
        {/* Skeleton */}
        {loading && !g && (
          <div className="animate-fade-in">
            <div className="card" style={{ padding: '24px', margin: '8px 0 16px', textAlign: 'center' }}>
              <Skeleton width="100px" height="13px" style={{ margin: '0 auto 8px' }} />
              <Skeleton width="180px" height="36px" style={{ margin: '0 auto 8px' }} />
              <Skeleton width="140px" height="14px" style={{ margin: '0 auto' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <Skeleton height="48px" borderRadius="14px" style={{ flex: 1 }} />
              <Skeleton height="48px" borderRadius="14px" style={{ flex: 1 }} />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Skeleton width="40px" height="40px" borderRadius="10px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="120px" height="16px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="80px" height="13px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real Content */}
        {g && (
          <>
            {/* Balance Summary */}
            <div className="card" style={{ padding: '24px', margin: '8px 0 16px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your balance</p>
              {(g.balance?.youOwe > 0) ? (
                <p style={{ fontSize: '34px', fontWeight: '700', color: 'var(--red)', letterSpacing: '-0.5px' }}>
                  You owe {currSymbol}{g.balance.youOwe.toFixed(0)}
                </p>
              ) : (g.balance?.youAreOwed > 0) ? (
                <p style={{ fontSize: '34px', fontWeight: '700', color: 'var(--green)', letterSpacing: '-0.5px' }}>
                  You are owed {currSymbol}{g.balance.youAreOwed.toFixed(0)}
                </p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontSize: '17px', fontWeight: '600', color: 'var(--green)' }}>All Settled</span>
                </div>
              )}
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Total group spend {currSymbol}{(g.balance?.totalSpend || 0).toFixed(2)}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '14px', gap: '8px', borderRadius: '14px' }}
                onClick={() => navigate(`/groups/${id}/add-expense`)}
                disabled={g.archived}
              >
                <IoAddCircleOutline style={{ fontSize: '20px' }} />
                Add Expense
              </button>
              <button
                style={{ flex: 1, padding: '14px', background: 'var(--white)', color: 'var(--blue)', fontWeight: '600', fontSize: '15px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)', border: '0.5px solid rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'transform 120ms ease-out' }}
                onClick={() => navigate(`/groups/${id}/settle`)}
                disabled={g.archived}
              >
                <HiOutlineBanknotes style={{ fontSize: '20px' }} />
                Settle Up
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', marginBottom: '16px', background: 'var(--gray-200)', borderRadius: '10px', padding: '2px' }}>
              {['expenses', 'members'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: activeTab === tab ? 'var(--white)' : 'transparent',
                    borderRadius: activeTab === tab ? '8px' : '0',
                    color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab ? '600' : '400',
                    fontSize: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                    textTransform: 'capitalize',
                    transition: 'all 200ms ease-out'
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
                    <div className="empty-state-icon">
                      <IoReceiptOutline style={{ fontSize: '32px' }} />
                    </div>
                    <h3 className="empty-state-title">No expenses yet</h3>
                    <p className="empty-state-text">Add your first expense to start tracking.</p>
                    {!g.archived && (
                      <button className="btn-primary" style={{ maxWidth: '220px' }} onClick={() => navigate(`/groups/${id}/add-expense`)}>
                        + Add Expense
                      </button>
                    )}
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

                    const initial = (expense.category || 'other').charAt(0).toUpperCase();

                    return (
                      <div key={expense._id} className="card animate-fade-in" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            {initial}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', fontSize: '17px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.description}</span>
                              <span style={{ fontWeight: '600', fontSize: '17px', color: amountColor, flexShrink: 0, marginLeft: '8px' }}>
                                {displayAmount}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                {isPayer ? 'You paid' : `${expense.paidBy?.name || 'Someone'} paid`} {currSymbol}{expense.amount.toFixed(2)}
                              </span>
                              <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
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
                  const amIOwedByThem = (g.balance?.youAreOwed > 0) && (m._id !== user?._id) && isDebtor;

                  return (
                    <div key={m._id} className="card" style={{ marginBottom: '8px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar name={m.name} size="sm" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', fontSize: '17px' }}>
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
                                  style={{ border: 'none', background: 'var(--blue-light)', color: 'var(--blue)', fontSize: '13px', fontWeight: '600', padding: '4px 12px', borderRadius: '8px', marginTop: '6px', cursor: 'pointer', transition: 'transform 120ms ease-out' }}
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

            {/* Reminder Modal */}
            {remindModal && (
              <Modal
                show={!!remindModal}
                onClose={() => setRemindModal(null)}
                title={`Remind ${remindModal.name}`}
                variant="sheet"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                    Send a friendly nudge to {remindModal.name} about the {currSymbol}{Math.abs(remindModal.amount).toFixed(2)} outstanding balance.
                  </p>

                  <button
                    className="btn-secondary"
                    onClick={() => handleSendReminder("Hey! Just a reminder about the payment.")}
                    disabled={remindLoading}
                    style={{ padding: '12px', textAlign: 'left', background: 'var(--gray-50)', color: 'var(--text-primary)', justifyContent: 'flex-start', borderRadius: '12px' }}
                  >
                    "Hey! Just a reminder about the payment."
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => handleSendReminder("Don't forget to settle up!")}
                    disabled={remindLoading}
                    style={{ padding: '12px', textAlign: 'left', background: 'var(--gray-50)', color: 'var(--text-primary)', justifyContent: 'flex-start', borderRadius: '12px' }}
                  >
                    "Don't forget to settle up!"
                  </button>

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Message</label>
                    <textarea
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      placeholder="Write your own message..."
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', minHeight: '80px', outline: 'none', fontSize: '15px', fontFamily: 'inherit', resize: 'none', transition: 'border-color 200ms ease, box-shadow 200ms ease' }}
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
          </>
        )}
      </div>
    </div>
  );
}
