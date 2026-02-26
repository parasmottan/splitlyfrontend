import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiOutlineCamera } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';

const TYPES = ['Trip', 'House', 'Project', 'Couple', 'Other'];
const CURRENCIES = [
  { code: 'INR', symbol: '\u20B9', label: 'INR (\u20B9)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '\u20AC', label: 'EUR (\u20AC)' },
  { code: 'GBP', symbol: '\u00A3', label: 'GBP (\u00A3)' },
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
        currencySymbol: selectedCurrency?.symbol || '\u20B9'
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
          <IoChevronBack style={{ fontSize: '20px' }} /> Back
        </button>
        <span className="header-title">New Group</span>
        <div style={{ width: '60px' }}></div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px', marginTop: '8px' }}>
        Give your group a name and add a photo.
      </p>

      {/* Photo placeholder */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <HiOutlineCamera style={{ fontSize: '32px', color: 'var(--gray-400)' }} />
          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
            style={{ textAlign: 'right', border: 'none', fontSize: '17px', color: name ? 'var(--text-primary)' : 'var(--text-tertiary)', background: 'transparent', width: '60%', outline: 'none' }}
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
          <div style={{ padding: '8px 0', borderTop: '0.5px solid var(--gray-200)' }}>
            {TYPES.map(t => (
              <div
                key={t}
                style={{ padding: '10px 0', cursor: 'pointer', color: type === t.toLowerCase() ? 'var(--blue)' : 'var(--text-primary)', fontWeight: type === t.toLowerCase() ? '600' : '400', fontSize: '17px' }}
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
          <div style={{ padding: '8px 0', borderTop: '0.5px solid var(--gray-200)' }}>
            {CURRENCIES.map(c => (
              <div
                key={c.code}
                style={{ padding: '10px 0', cursor: 'pointer', color: currency === c.code ? 'var(--blue)' : 'var(--text-primary)', fontWeight: currency === c.code ? '600' : '400', fontSize: '17px' }}
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
