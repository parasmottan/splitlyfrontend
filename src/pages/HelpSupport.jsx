import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PAGE_BG = '#EAEAF5';
const CARD_STYLE = { background: '#fff', borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12, overflow: 'hidden' };
const INPUT_STYLE = { width: '100%', padding: '13px 14px', border: '1.5px solid #E5E5EA', borderRadius: 12, fontSize: 15, color: '#1C1C1E', background: '#F9F9FB', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" };
const LABEL_STYLE = { fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'block' };
const SECTION_TITLE = { fontSize: 13, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 };

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: type === 'error' ? '#FF3B30' : '#34C759', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
      {msg}
    </div>
  );
}

// FAQ accordion item
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F2F2F7' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E', flex: 1, paddingRight: 10 }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }}>
          <path d="M6 9L12 15L18 9" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6, margin: '0 18px 16px', padding: '0 0 2px' }}>{a}</p>
      )}
    </div>
  );
}

const faqs = [
  { q: 'How do I add an expense to a group?', a: 'Open the group → tap the + FAB button at the bottom → fill in the expense details and split method. The expense will be split among group members immediately.' },
  { q: 'How does settling up work?', a: 'On the group dashboard, tap "Settle Up" next to a member\'s name. You\'ll be redirected to a settlement screen. After completing the payment externally, mark it as settled in the app.' },
  { q: 'Can I invite someone who isn\'t on Capaz?', a: 'Yes! Go to a group → Group Settings → Share Invite Link. They\'ll get a link to join the group and can register when they first open it.' },
  { q: 'How is the balance calculated?', a: 'Capaz uses an optimized debt simplification algorithm. It minimises the number of transactions needed to settle all debts in a group, so you pay or receive fewer but fairer amounts.' },
  { q: 'What happens if I leave a group?', a: 'You can only leave a group after all your balances are settled. If you are owed money or owe money, you\'ll need to settle first.' },
  { q: 'Is my data safe?', a: 'Yes. Passwords are hashed with bcrypt. All API calls use JWT authentication. Your data is stored securely on MongoDB Atlas.' },
];

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
      showToast('Message sent! We\'ll get back to you soon. ✅');
    } catch {
      showToast('Failed to send. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Help & Support</h1>
      </div>

      <div style={{ padding: '8px 20px 100px' }}>

        {/* FAQ */}
        <p style={SECTION_TITLE}>Frequently Asked Questions</p>
        <div style={CARD_STYLE}>
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>

        {/* Contact form */}
        <p style={{ ...SECTION_TITLE, marginTop: 8 }}>Contact Support</p>
        <div style={{ ...CARD_STYLE, padding: '18px 18px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} style={INPUT_STYLE} placeholder="What's the issue about?" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={LABEL_STYLE}>Message</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)} rows={5}
              style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
              placeholder="Describe your issue in detail..."
            />
          </div>
          <button onClick={handleSubmit} disabled={sending} style={{ width: '100%', padding: 14, background: sending ? '#C7C7CC' : 'linear-gradient(135deg, #6347F5, #4B32CC)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: '800', cursor: sending ? 'not-allowed' : 'pointer' }}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {/* App info */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#C7C7CC', marginBottom: 8 }}>Capaz v1.0.0</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            <span onClick={() => navigate('/terms')} style={{ fontSize: 13, color: '#6347F5', fontWeight: '600', cursor: 'pointer' }}>Terms of Service</span>
            <span onClick={() => navigate('/privacy')} style={{ fontSize: 13, color: '#6347F5', fontWeight: '600', cursor: 'pointer' }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
