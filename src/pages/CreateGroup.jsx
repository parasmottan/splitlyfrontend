import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiOutlineCamera } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';

const TYPES = ['Trip', 'House', 'Project', 'Couple', 'Other'];
const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export default function CreateGroup() {
  const navigate = useNavigate();
  const { createGroup, loading } = useGroupStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('trip');
  const [currency, setCurrency] = useState('INR');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const selectedCurrency = CURRENCIES.find(c => c.code === currency);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const group = await createGroup({
        name: name.trim(),
        type: type.toLowerCase(),
        currency,
        currencySymbol: selectedCurrency?.symbol || '₹'
      });
      navigate(`/groups/${group._id}`, { replace: true });
    } catch (err) {
      // error handled in store
    }
  };

  return (
    <div className="page page-white" style={{ padding: '0 20px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack /> Back
        </button>
      </div>

      <h1 className="title-large" style={{ marginBottom: '8px' }}>New Group</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
        Give your group a name and add a photo.
      </p>

      {/* Photo placeholder */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <HiOutlineCamera style={{ fontSize: '32px', color: 'var(--gray-400)' }} />
          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>✎</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div className="form-row">
          <span className="form-row-label">Name</span>
          <input
            type="text"
            placeholder="e.g. Summer Trip"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ textAlign: 'right', border: 'none', fontSize: '16px', color: 'var(--text-tertiary)', background: 'transparent', width: '60%' }}
          />
        </div>

        <div className="form-row" onClick={() => setShowTypePicker(!showTypePicker)} style={{ cursor: 'pointer' }}>
          <span className="form-row-label">Type</span>
          <span className="form-row-value">
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <IoChevronForward style={{ fontSize: '16px', color: 'var(--gray-400)' }} />
          </span>
        </div>

        {showTypePicker && (
          <div style={{ padding: '8px 0', borderTop: '1px solid var(--gray-100)' }}>
            {TYPES.map(t => (
              <div
                key={t}
                style={{ padding: '10px 0', cursor: 'pointer', color: type === t.toLowerCase() ? 'var(--blue)' : 'var(--text-primary)', fontWeight: type === t.toLowerCase() ? '600' : '400' }}
                onClick={() => { setType(t.toLowerCase()); setShowTypePicker(false); }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: '0 16px', marginBottom: '32px' }}>
        <div className="form-row" onClick={() => setShowCurrencyPicker(!showCurrencyPicker)} style={{ cursor: 'pointer' }}>
          <span className="form-row-label">Currency</span>
          <span className="form-row-value">
            {selectedCurrency?.label}
            <IoChevronForward style={{ fontSize: '16px', color: 'var(--gray-400)' }} />
          </span>
        </div>

        {showCurrencyPicker && (
          <div style={{ padding: '8px 0', borderTop: '1px solid var(--gray-100)' }}>
            {CURRENCIES.map(c => (
              <div
                key={c.code}
                style={{ padding: '10px 0', cursor: 'pointer', color: currency === c.code ? 'var(--blue)' : 'var(--text-primary)', fontWeight: currency === c.code ? '600' : '400' }}
                onClick={() => { setCurrency(c.code); setShowCurrencyPicker(false); }}
              >
                {c.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
        You can add more people to the group after it's created. Everyone will be notified via email.
      </p>

      <div style={{ flex: 1 }}></div>

      <button className="btn-primary" onClick={handleCreate} disabled={loading || !name.trim()} style={{ marginBottom: '32px' }}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </div>
  );
}
