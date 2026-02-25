import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import useGroupStore from '../stores/groupStore';

export default function JoinGroup() {
  const navigate = useNavigate();
  const { joinGroup, loading, error } = useGroupStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [joinError, setJoinError] = useState('');

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);
    setJoinError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Try to extract a 6 character code from pasted text
      const match = text.match(/[A-Z0-9]{6}/i);
      if (match) {
        const chars = match[0].toUpperCase().split('');
        setCode(chars);
        setJoinError('');
      }
    } catch {
      // clipboard access denied
    }
  };

  const handleJoin = async () => {
    const inviteCode = code.join('');
    if (inviteCode.length !== 6) {
      setJoinError('Please enter a 6-digit code');
      return;
    }

    try {
      const group = await joinGroup(inviteCode);
      navigate(`/groups/${group._id}`, { replace: true });
    } catch (err) {
      setJoinError(err.message);
    }
  };

  return (
    <div className="page page-white" style={{ padding: '0 20px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="header">
        <button className="header-back" onClick={() => navigate(-1)}>
          <IoChevronBack /> Back
        </button>
        <span className="header-title">Join Group</span>
        <div style={{ width: '60px' }}></div>
      </div>

      <h1 className="title-large" style={{ textAlign: 'center', marginTop: '24px', marginBottom: '12px' }}>
        Enter Invite Code
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.5', marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px' }}>
        Ask your friend for the 6-digit code to join their group.
      </p>

      {/* Code Input */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--blue-light)' }}>
        {code.map((char, i) => (
          <React.Fragment key={i}>
            <input
              ref={(el) => inputRefs.current[i] = el}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: '36px',
                height: '44px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '600',
                border: 'none',
                borderBottom: '2px solid var(--gray-300)',
                background: 'transparent',
                color: 'var(--text-primary)',
                letterSpacing: '2px'
              }}
            />
            {i === 2 && (
              <div style={{ width: '2px', height: '44px', background: 'var(--gray-300)', margin: '0 4px', alignSelf: 'center' }}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {joinError && (
        <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: '14px', marginTop: '8px' }}>{joinError}</p>
      )}

      {/* OR divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }}></div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--gray-200)' }}></div>
      </div>

      {/* Paste Invite Link */}
      <button
        onClick={handlePaste}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: 'none', color: 'var(--blue)', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
      >
        <HiOutlineClipboardDocument style={{ fontSize: '20px' }} />
        Paste Invite Link
      </button>

      <div style={{ flex: 1 }}></div>

      <button className="btn-primary" onClick={handleJoin} disabled={loading || code.join('').length !== 6} style={{ marginBottom: '32px' }}>
        {loading ? 'Joining...' : 'Join Group'}
      </button>
    </div>
  );
}
