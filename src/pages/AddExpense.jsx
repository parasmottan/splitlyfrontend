import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiOutlineCamera } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';
import useExpenseStore from '../stores/expenseStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';

const CATEGORIES = [
  { key: 'food', label: 'Food & Dining', initial: 'F' },
  { key: 'transport', label: 'Transport', initial: 'T' },
  { key: 'groceries', label: 'Groceries', initial: 'G' },
  { key: 'entertainment', label: 'Entertainment', initial: 'E' },
  { key: 'utilities', label: 'Utilities', initial: 'U' },
  { key: 'rent', label: 'Rent', initial: 'R' },
  { key: 'travel', label: 'Travel', initial: 'T' },
  { key: 'shopping', label: 'Shopping', initial: 'S' },
  { key: 'other', label: 'Others', initial: 'O' },
];

export default function AddExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeGroup, fetchGroup } = useGroupStore();
  const { addExpense, loading } = useExpenseStore();
  const { user } = useAuthStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPaidByPicker, setShowPaidByPicker] = useState(false);
  const [customSplits, setCustomSplits] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeGroup || activeGroup._id !== id) {
      fetchGroup(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) setPaidBy(user._id);
  }, [user]);

  const selectedCategory = CATEGORIES.find(c => c.key === category);
  const paidByMember = activeGroup?.members?.find(m => m.user._id === paidBy)?.user;

  const handleSubmit = async () => {
    if (!description.trim()) { setError('Description is required'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }

    const expenseData = {
      groupId: id,
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      paidBy,
      splitType,
    };

    if (splitType === 'custom') {
      const splits = Object.entries(customSplits).map(([userId, amt]) => ({
        user: userId,
        amount: parseFloat(amt) || 0
      })).filter(s => s.amount > 0);

      const totalSplit = splits.reduce((s, x) => s + x.amount, 0);
      if (Math.abs(totalSplit - parseFloat(amount)) > 0.01) {
        setError(`Split total (\u20B9${totalSplit.toFixed(2)}) doesn't match amount (\u20B9${parseFloat(amount).toFixed(2)})`);
        return;
      }
      expenseData.splits = splits;
    }

    try {
      await addExpense(expenseData);
      await fetchGroup(id);
      navigate(`/groups/${id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!activeGroup) {
    return (
      <div className="page page-white">
        <div className="header" style={{ padding: '12px 20px' }}>
          <button className="header-back" onClick={() => navigate(-1)}>
            <IoChevronBack style={{ fontSize: '20px' }} /> Back
          </button>
          <span className="header-title">Add Expense</span>
          <div style={{ width: '60px' }}></div>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Skeleton width="60px" height="14px" style={{ margin: '0 auto 8px' }} />
            <Skeleton width="120px" height="40px" style={{ margin: '0 auto' }} />
          </div>
          <div className="form-group">
            <Skeleton width="100px" height="13px" style={{ marginBottom: '8px' }} />
            <Skeleton height="48px" borderRadius="12px" />
          </div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="form-row"><Skeleton width="100%" height="20px" /></div>
            <div className="form-row"><Skeleton width="100%" height="20px" /></div>
          </div>
          <Skeleton height="56px" borderRadius="14px" />
        </div>
      </div>
    );
  }

  const currSymbol = activeGroup.currencySymbol || '\u20B9';

  return (
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Header */}
      <div className="header" style={{ padding: '12px 20px' }}>
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack style={{ fontSize: '20px' }} /> Back
        </button>
        <span className="header-title">Add Expense</span>
        <div style={{ width: '60px' }}></div>
      </div>

      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginTop: '8px' }}>
          {error && (
            <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '15px', lineHeight: '1.4' }}>
              {error}
            </div>
          )}

          {/* Amount */}
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>Amount</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-primary)', marginRight: '4px' }}>{currSymbol}</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                style={{ fontSize: '36px', fontWeight: '700', border: 'none', width: '160px', textAlign: 'center', background: 'transparent', outline: 'none' }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Dinner at restaurant"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setError(''); }}
            />
          </div>

          {/* Options */}
          <div className="card" style={{ padding: '0 16px', marginBottom: '16px' }}>
            {/* Category */}
            <div className="form-row" onClick={() => setShowCategoryPicker(!showCategoryPicker)} style={{ cursor: 'pointer' }}>
              <span className="form-row-label">Category</span>
              <span className="form-row-value">
                <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--gray-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginRight: '6px' }}>
                  {selectedCategory?.initial}
                </span>
                {selectedCategory?.label}
                <IoChevronForward style={{ fontSize: '16px', color: 'var(--gray-400)' }} />
              </span>
            </div>

            {showCategoryPicker && (
              <div style={{ padding: '4px 0', borderTop: '0.5px solid var(--gray-200)' }}>
                {CATEGORIES.map(c => (
                  <div
                    key={c.key}
                    style={{ padding: '10px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: category === c.key ? 'var(--blue)' : 'var(--text-primary)', fontWeight: category === c.key ? '600' : '400', fontSize: '17px' }}
                    onClick={() => { setCategory(c.key); setShowCategoryPicker(false); }}
                  >
                    <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--gray-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                      {c.initial}
                    </span>
                    {c.label}
                  </div>
                ))}
              </div>
            )}

            {/* Paid By */}
            <div className="form-row" onClick={() => setShowPaidByPicker(!showPaidByPicker)} style={{ cursor: 'pointer' }}>
              <span className="form-row-label">Paid by</span>
              <span className="form-row-value">
                {paidByMember?._id === user?._id ? 'You' : paidByMember?.name || 'Select'}
                <IoChevronForward style={{ fontSize: '16px', color: 'var(--gray-400)' }} />
              </span>
            </div>

            {showPaidByPicker && (
              <div style={{ padding: '4px 0', borderTop: '0.5px solid var(--gray-200)' }}>
                {activeGroup.members?.map(member => (
                  <div
                    key={member.user._id}
                    style={{ padding: '10px 0', cursor: 'pointer', color: paidBy === member.user._id ? 'var(--blue)' : 'var(--text-primary)', fontWeight: paidBy === member.user._id ? '600' : '400', fontSize: '17px' }}
                    onClick={() => { setPaidBy(member.user._id); setShowPaidByPicker(false); }}
                  >
                    {member.user._id === user?._id ? 'You' : member.user.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Split Type */}
          <h3 className="caption" style={{ marginBottom: '12px' }}>SPLIT METHOD</h3>
          <div style={{ display: 'flex', marginBottom: '16px', background: 'var(--gray-200)', borderRadius: '10px', padding: '2px' }}>
            {['equal', 'custom'].map(type => (
              <button
                key={type}
                onClick={() => setSplitType(type)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: splitType === type ? 'var(--white)' : 'transparent',
                  borderRadius: splitType === type ? '8px' : '0',
                  color: splitType === type ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: splitType === type ? '600' : '400',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: splitType === type ? 'var(--shadow-sm)' : 'none',
                  textTransform: 'capitalize',
                  transition: 'all 200ms ease-out'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Custom Splits */}
          {splitType === 'custom' && (
            <div className="card" style={{ padding: '8px 16px', marginBottom: '16px' }}>
              {activeGroup.members?.map(member => (
                <div key={member.user._id} className="form-row">
                  <span style={{ fontSize: '17px' }}>
                    {member.user._id === user?._id ? 'You' : member.user.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{currSymbol}</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={customSplits[member.user._id] || ''}
                      onChange={(e) => setCustomSplits({ ...customSplits, [member.user._id]: e.target.value })}
                      style={{ width: '80px', textAlign: 'right', border: 'none', fontSize: '17px', fontWeight: '600', background: 'transparent', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {splitType === 'equal' && amount && (
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '16px' }}>
              {currSymbol}{(parseFloat(amount) / (activeGroup.members?.length || 1)).toFixed(2)} per person
            </p>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginBottom: '32px' }}>
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
