import React from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_BG = '#EAEAF5';
const CARD_STYLE = { background: '#fff', borderRadius: 20, padding: '18px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12 };
const SECTION_TITLE = { fontSize: 13, fontWeight: '800', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 };

// Payment methods are NOT stored in the backend currently.
// This page shows a clear empty state with a note about upcoming support.
// Required backend when ready:
//   POST   /api/user/payment-methods  { type, last4, brand, token }
//   GET    /api/user/payment-methods
//   DELETE /api/user/payment-methods/:id

export default function PaymentMethods() {
  const navigate = useNavigate();

  const placeholderCards = [];

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Payment Methods</h1>
      </div>

      <div style={{ padding: '8px 20px 100px' }}>

        {placeholderCards.length === 0 ? (
          <>
            {/* Empty state */}
            <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99,71,245,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="3" stroke="#6347F5" strokeWidth="2" />
                  <path d="M2 10H22" stroke="#6347F5" strokeWidth="2" />
                  <circle cx="6" cy="15" r="1" fill="#6347F5" />
                  <circle cx="10" cy="15" r="1" fill="#6347F5" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: '800', color: '#1C1C1E', marginBottom: 8 }}>No Payment Methods</h3>
              <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6, marginBottom: 24 }}>
                Payment method storage is coming soon! You'll be able to save cards and bank accounts for faster settlements.
              </p>
              <div style={{ background: 'rgba(99,71,245,0.06)', borderRadius: 14, padding: '16px 18px', width: '100%', textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: '700', color: '#6347F5', marginBottom: 4 }}>🚀 Coming Soon</p>
                <p style={{ fontSize: 12, color: '#8E8E93', lineHeight: 1.5, margin: 0 }}>
                  Save UPI IDs, debit cards, and bank accounts. Settlements will be instant with saved methods.
                </p>
              </div>
            </div>

            {/* How Capaz handles payments now */}
            <p style={SECTION_TITLE}>How Settlements Work Now</p>
            {[
              { icon: '💬', title: 'In-App Requests', desc: 'Send payment reminders directly to group members.' },
              { icon: '🔗', title: 'External Transfer', desc: 'Settle via UPI, bank transfer, or cash and mark as settled.' },
              { icon: '✅', title: 'Mark Settled', desc: 'Once paid, mark the debt as settled in the group dashboard.' },
            ].map(step => (
              <div key={step.title} style={{ ...CARD_STYLE, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 3 }}>{step.title}</p>
                  <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.4, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
