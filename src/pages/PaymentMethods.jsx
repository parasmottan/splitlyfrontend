import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_BG = '#EAEAF5';
const SECTION_LABEL = {
  fontSize: 11, fontWeight: '800', color: '#8E8E93',
  textTransform: 'uppercase', letterSpacing: '1.2px',
  margin: '0 0 10px',
};

// Visa card illustration
function VisaCardIcon() {
  return (
    <div style={{ width: 48, height: 34, borderRadius: 6, background: 'linear-gradient(135deg, #C9E5F5, #A8D8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <svg width="28" height="10" viewBox="0 0 50 16" fill="none">
        <text x="0" y="13" fontSize="14" fontWeight="bold" fill="#1A4A7A" fontFamily="serif">VISA</text>
      </svg>
    </div>
  );
}

// Mastercard illustration
function MastercardIcon() {
  return (
    <div style={{ width: 48, height: 34, borderRadius: 6, background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ position: 'relative', width: 32, height: 20 }}>
        <div style={{ position: 'absolute', left: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(235,60,0,0.85)' }} />
        <div style={{ position: 'absolute', right: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,180,0,0.9)' }} />
      </div>
    </div>
  );
}

// PayPal icon
function PayPalIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,48,135,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#003087" strokeWidth="2" />
        <path d="M7 10h5a2.5 2.5 0 0 1 0 5H9l-.5 3" stroke="#003087" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 8h4a2 2 0 0 1 0 4h-2" stroke="#009CDE" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Apple Pay icon
function ApplePayIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C10.5 3 9 3.8 8.5 5c-1.5 0-3 1.2-3 3 0 .5.1 1 .3 1.4C4.7 10 4 11.2 4 12.5 4 15 5.8 17 8 17h.5C9 18.2 10.4 19 12 19s3-0.8 3.5-2H16c2.2 0 4-2 4-4.5 0-1.3-.7-2.5-1.8-3.1.2-.4.3-.9.3-1.4C18.5 5.2 17 4 15.5 4 15 3.8 13.5 3 12 3z" fill="white" />
      </svg>
    </div>
  );
}

function ThreeDotMenu() {
  return (
    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#8E8E93' }} />)}
    </button>
  );
}

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto', paddingBottom: 100 }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#6347F5', color: '#fff', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: '700', zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

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
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#1C1C1E', margin: 0, marginRight: 38 }}>Payment Methods</h1>
      </div>

      <div style={{ padding: '8px 20px 120px' }}>

        {/* YOUR CARDS */}
        <p style={SECTION_LABEL}>Your Cards</p>

        {/* Visa Debit */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <VisaCardIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <p style={{ fontSize: 15, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Visa Debit</p>
              <span style={{ background: 'rgba(52,199,89,0.12)', color: '#34C759', fontSize: 10, fontWeight: '800', padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Default</span>
            </div>
            <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>•••• •••• •••• 4289</p>
            <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>Expires 12/26</p>
          </div>
          <ThreeDotMenu />
        </div>

        {/* Mastercard */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <MastercardIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: '800', color: '#1C1C1E', margin: '0 0 3px' }}>Mastercard</p>
            <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>•••• •••• •••• 8832</p>
            <p style={{ fontSize: 12, color: '#AEAEB2', margin: '2px 0 0' }}>Expires 09/25</p>
          </div>
          <ThreeDotMenu />
        </div>

        {/* LINKED ACCOUNTS */}
        <p style={SECTION_LABEL}>Linked Accounts</p>

        {/* PayPal */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <PayPalIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: '800', color: '#1C1C1E', margin: '0 0 3px' }}>PayPal</p>
            <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>alex.rivera@example.com</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#C7C7CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Apple Pay */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <ApplePayIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: '800', color: '#1C1C1E', margin: '0 0 3px' }}>Apple Pay</p>
            <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>Connected on iPhone 14</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#C7C7CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Sticky Add New Method button */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, padding: '16px 20px',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, #EAEAF5 60%, transparent)',
      }}>
        <button
          onClick={() => showToast('💳 Payment methods coming soon!')}
          style={{
            width: '100%', padding: '17px 24px',
            background: 'linear-gradient(135deg, #7B5CF5, #5B3FD4)',
            color: '#fff', border: 'none', borderRadius: 100,
            fontSize: 17, fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="2" />
            <path d="M2 10H22" stroke="#fff" strokeWidth="2" />
            <path d="M6 15h3M12 15h2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add New Method
        </button>
      </div>
    </div>
  );
}
