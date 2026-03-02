import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

const PAGE_BG = '#EAEAF5';

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: type === 'error' ? '#FF3B30' : '#34C759', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  );
}

// FAQ accordion item
function FaqItem({ q, a, icon }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#fff', borderRadius: 20, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '18px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 14 }}
      >
        {icon && (
          <div style={{ width: 44, height: 44, borderRadius: 12, background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon.el}
          </div>
        )}
        <span style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', flex: 1, textAlign: 'left' }}>{q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
          <path d="M6 9L12 15L18 9" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.6, margin: '0 18px 18px', paddingTop: 0 }}>{a}</p>
      )}
    </div>
  );
}

const faqs = [
  {
    q: 'How do I split a bill?',
    a: 'Open a group → tap the + FAB button → fill in the expense details and choose a split method. The expense will be distributed among group members instantly.',
    icon: {
      bg: 'rgba(99,71,245,0.08)',
      el: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#6347F5" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#6347F5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  },
  {
    q: 'When do I get paid out?',
    a: 'Once a friend marks a settlement as paid in the app, the balance updates immediately. Actual money transfer happens externally via UPI, bank transfer, or cash — Splitly tracks who owes what.',
    icon: {
      bg: 'rgba(99,71,245,0.12)',
      el: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#6347F5" strokeWidth="2" />
          <path d="M3 10h18" stroke="#6347F5" strokeWidth="2" />
          <circle cx="8" cy="15" r="1.5" fill="#6347F5" />
        </svg>
      ),
    },
  },
  {
    q: 'How does Karma work?',
    a: 'Karma is your reputation score. You earn points for settling debts on time, inviting friends, and being active in groups. Higher karma unlocks achievement badges and bragging rights!',
    icon: {
      bg: 'rgba(255,149,0,0.1)',
      el: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#FF9500" strokeWidth="2" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.5" fill="#FF9500" stroke="#FF9500" strokeWidth="1.5" />
        </svg>
      ),
    },
  },
];

const INPUT_STYLE = {
  width: '100%', padding: '14px 16px', fontSize: 15,
  background: '#F9F9FB', border: '1.5px solid #E5E5EA',
  borderRadius: 14, color: '#1C1C1E', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};
const LABEL_STYLE = {
  fontSize: 11, fontWeight: '700', color: '#8E8E93',
  textTransform: 'uppercase', letterSpacing: '0.8px',
  display: 'block', marginBottom: 8,
};

export default function HelpSupport() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return showToast('Please fill in all fields', 'error');
    setSending(true);
    try {
      await api.post('/user/support', { subject: subject.trim(), message: message.trim() });
      setSubject(''); setMessage('');
      showToast("Message sent! We'll get back to you soon. ✅");
    } catch {
      showToast('Failed to send. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      <SEO
        title="Help & Support - Splitly"
        description="Get help with interpreting balances, adding expenses, or managing groups on Splitly."
        canonical="/account/help"
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#1C1C1E', margin: 0, marginRight: 38 }}>Help &amp; Support</h1>
      </div>

      <div style={{ padding: '8px 20px 60px' }}>

        {/* FAQ section */}
        <h2 style={{ fontSize: 22, fontWeight: '800', color: '#1C1C1E', margin: '0 0 16px' }}>Common Questions</h2>
        {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} icon={f.icon} />)}

        {/* Contact Us section */}
        <h2 style={{ fontSize: 22, fontWeight: '800', color: '#1C1C1E', margin: '28px 0 16px' }}>Contact Us</h2>
        <div style={{ background: '#fff', borderRadius: 24, padding: '24px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Subject</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={INPUT_STYLE}
              placeholder="e.g. Payment Issue"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={LABEL_STYLE}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
              placeholder="Describe your issue in detail..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              width: '100%', padding: '17px 24px',
              background: sending ? '#AEAEB2' : 'linear-gradient(135deg, #7B5CF5, #5B3FD4)',
              color: '#fff', border: 'none', borderRadius: 100,
              fontSize: 17, fontWeight: '700', cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            {sending ? 'Sending...' : (
              <>
                Send Message
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 8 }}>
            <span onClick={() => navigate('/privacy')} style={{ fontSize: 13, color: '#8E8E93', cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ fontSize: 13, color: '#C7C7CC', margin: '0 12px' }}>|</span>
            <span onClick={() => navigate('/terms')} style={{ fontSize: 13, color: '#8E8E93', cursor: 'pointer' }}>Terms of Service</span>
          </div>
          <p style={{ fontSize: 12, color: '#C7C7CC', margin: 0 }}>Version 2.4.1 (Build 890)</p>
        </div>
      </div>
    </div>
  );
}
