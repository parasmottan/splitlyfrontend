import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import useGroupStore from '../stores/groupStore';
import useExpenseStore from '../stores/expenseStore';
import useAuthStore from '../stores/authStore';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';

const CATEGORIES = [
  { key: 'food', label: 'Food', emoji: '🍔', color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
  { key: 'drinks', label: 'Drinks', emoji: '🍺', color: '#5AC8FA', bg: 'rgba(90,200,250,0.12)' },
  { key: 'transport', label: 'Ride', emoji: '🚕', color: '#FFCC00', bg: 'rgba(255,204,0,0.12)' },
  { key: 'rent', label: 'Rent', emoji: '🏠', color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  { key: 'entertainment', label: 'Fun', emoji: '🎬', color: '#AF52DE', bg: 'rgba(175,82,222,0.12)' },
  { key: 'groceries', label: 'Market', emoji: '🛒', color: '#34C759', bg: 'rgba(52,199,89,0.12)' },
  { key: 'travel', label: 'Travel', emoji: '✈️', color: '#007AFF', bg: 'rgba(0,122,255,0.12)' },
  { key: 'other', label: 'Other', emoji: '💸', color: '#8E8E93', bg: 'rgba(142,142,147,0.12)' },
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
  const [customSplits, setCustomSplits] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeGroup || activeGroup._id !== id) fetchGroup(id);
  }, [id]);

  useEffect(() => {
    if (user) setPaidBy(user._id);
  }, [user]);

  const selectedCat = CATEGORIES.find(c => c.key === category) || CATEGORIES[0];

  const handleSubmit = async () => {
    if (!description.trim()) { setError('Description is required'); return; }
    if (!amount || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }

    const expenseData = { groupId: id, description: description.trim(), amount: parseFloat(amount), category, paidBy, splitType };

    if (splitType === 'custom') {
      const splits = Object.entries(customSplits).map(([userId, amt]) => ({ user: userId, amount: parseFloat(amt) || 0 })).filter(s => s.amount > 0);
      const totalSplit = splits.reduce((s, x) => s + x.amount, 0);
      if (Math.abs(totalSplit - parseFloat(amount)) > 0.01) {
        setError(`Split total (₹${totalSplit.toFixed(2)}) doesn't match amount (₹${parseFloat(amount).toFixed(2)})`);
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
      <div style={{ background: '#F5F3F0', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  const currSymbol = activeGroup.currencySymbol || '$';
  const members = activeGroup.members || [];
  const paidByMember = members.find(m => m.user._id === paidBy)?.user;

  return (
    <div style={{ background: '#F5F3F0', minHeight: '100dvh', display: 'flex', flexDirection: 'column', maxWidth: '430px', margin: '0 auto' }}>
      {/* Bottom sheet header drag indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
        <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(0,0,0,0.15)' }} />
      </div>

      {/* Sheet header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 8px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: '600', color: '#8E8E93', cursor: 'pointer' }}>Cancel</button>
        <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1C1C1E' }}>New Expense</h2>
        <div style={{ width: '48px' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 40px' }}>
        {error && (
          <div style={{ background: 'rgba(255,59,48,0.1)', color: '#DC2626', padding: '12px 16px', borderRadius: '16px', marginBottom: '16px', fontSize: '15px', border: '1px solid rgba(220,38,38,0.2)' }}>
            {error}
          </div>
        )}

        {/* Amount hero */}
        <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: '300', color: '#8E8E93', marginRight: '4px' }}>{currSymbol}</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(''); }}
              style={{
                fontSize: '64px', fontWeight: '800', border: 'none', width: '200px', textAlign: 'center',
                background: 'transparent', outline: 'none', color: '#0F1130', letterSpacing: '-2px',
              }}
            />
          </div>
          {/* Currency selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(255,255,255,0.7)', borderRadius: '100px', marginTop: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1C1C1E' }}>USD</span>
            <span style={{ color: '#8E8E93', fontSize: '14px' }}>▾</span>
          </div>
        </div>

        {/* Description */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <input
            type="text"
            placeholder="What's this for?"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError(''); }}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: '20px', color: description ? '#1C1C1E' : '#C7C7CC',
              textAlign: 'center', width: '100%', fontWeight: '500',
            }}
          />
        </div>

        {/* Category */}
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E93', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '12px' }}>CATEGORY</p>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '28px', WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map(cat => {
            const isSelected = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  flexShrink: 0, padding: '0', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: isSelected ? cat.bg : 'rgba(255,255,255,0.7)',
                  border: isSelected ? `3px solid ${cat.color}` : '3px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', transition: 'all 150ms ease',
                  boxShadow: isSelected ? `0 4px 16px ${cat.color}30` : '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {cat.emoji}
                </div>
                <span style={{ fontSize: '12px', fontWeight: isSelected ? '700' : '500', color: isSelected ? cat.color : '#8E8E93' }}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Who Paid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#8E8E93', letterSpacing: '0.8px', textTransform: 'uppercase' }}>WHO PAID?</p>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--blue)', cursor: 'pointer' }}>Split options</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '28px', WebkitOverflowScrolling: 'touch' }}>
          {members.map(member => {
            const isMe = member.user._id === user?._id;
            const isPaid = paidBy === member.user._id;
            return (
              <button
                key={member.user._id}
                onClick={() => setPaidBy(member.user._id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden',
                  border: isPaid ? '3px solid var(--blue)' : '3px solid transparent',
                  filter: isPaid ? 'none' : 'grayscale(100%)',
                  transition: 'all 150ms ease',
                }}>
                  <Avatar name={member.user.name} style={{ width: '100%', height: '100%', fontSize: '22px' }} />
                </div>
                {isPaid && (
                  <div style={{ position: 'absolute', bottom: '22px', right: '-2px', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4.2 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
                <span style={{ fontSize: '12px', fontWeight: '600', color: isPaid ? 'var(--blue)' : '#8E8E93' }}>
                  {isMe ? 'You' : member.user.name?.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Split Breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: splitType === 'custom' ? '16px' : '0' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#1C1C1E' }}>Split Breakdown</span>
            <button
              onClick={() => setSplitType(prev => prev === 'equal' ? 'custom' : 'equal')}
              style={{ padding: '5px 12px', background: 'rgba(52,199,89,0.1)', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#34C759', letterSpacing: '0.5px' }}>
                {splitType === 'equal' ? 'EQUALLY' : 'CUSTOM'}
              </span>
            </button>
          </div>

          {splitType === 'custom' && members.map(member => (
            <div key={member.user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '0.5px solid var(--gray-200)' }}>
              <span style={{ fontSize: '16px', color: '#1C1C1E' }}>{member.user._id === user?._id ? 'You' : member.user.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#8E8E93' }}>{currSymbol}</span>
                <input type="number" placeholder="0.00" value={customSplits[member.user._id] || ''} onChange={(e) => setCustomSplits({ ...customSplits, [member.user._id]: e.target.value })} style={{ width: '80px', textAlign: 'right', border: 'none', fontSize: '17px', fontWeight: '600', background: 'transparent', outline: 'none' }} />
              </div>
            </div>
          ))}

          {splitType === 'equal' && amount && (
            <p style={{ fontSize: '14px', color: '#8E8E93', marginTop: '4px' }}>
              {currSymbol}{(parseFloat(amount) / (members.length || 1)).toFixed(2)} per person
            </p>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '18px 24px',
            background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
            color: 'white', fontSize: '17px', fontWeight: '700',
            borderRadius: '100px', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Adding...' : 'Add it'}
        </button>
      </div>
    </div>
  );
}
