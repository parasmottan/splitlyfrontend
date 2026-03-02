import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const PAGE_BG = '#EAEAF5';

const sections = [
  {
    icon: (
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,71,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6347F5" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    title: 'Acceptance of Terms',
    body: 'By creating an account, you confirm that you are at least 13 years old and have the legal capacity to enter into binding contracts.',
  },
  {
    icon: (
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99,71,245,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="#6347F5" stroke="#6347F5" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    title: 'Use of Platform',
    body: 'You agree to use Splitly only for lawful purposes. You are responsible for all activity that occurs under your account credentials.',
  },
  {
    icon: (
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="#34C759" strokeWidth="2" />
          <path d="M2 10h20" stroke="#34C759" strokeWidth="2" />
          <circle cx="7" cy="15" r="1.5" fill="#34C759" />
        </svg>
      </div>
    ),
    title: 'Financial Disclaimer',
    body: 'Splitly is not a bank. Funds are held by our licensed banking partners. We do not provide financial advice. Gamification rewards have no cash value unless explicitly stated.',
  },
  {
    icon: (
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#FF3B30" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    ),
    title: 'Limitation of Liability',
    body: 'To the maximum extent permitted by law, Splitly shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.',
  },
];

export default function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      <SEO
        title="Terms & Conditions - Splitly"
        description="Read the Terms & Conditions for using the Splitly group expense splitting application."
        canonical="/terms"
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1C1C1E', margin: 0, marginRight: 32 }}>Terms &amp; Conditions</h1>
      </div>

      <div style={{ padding: '0 20px 60px' }}>

        {/* Active Development banner — orange */}
        <div style={{
          background: 'rgba(255,149,0,0.08)',
          border: '1.5px solid rgba(255,149,0,0.4)',
          borderRadius: 18, padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🔧</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: '800', color: '#FF9500', margin: '0 0 5px' }}>Active Development</p>
            <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.55, margin: 0 }}>
              Splitly is currently in beta. These terms may be updated frequently as we roll out new features.
            </p>
          </div>
        </div>

        {/* Last updated card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 14, color: '#1C1C1E', margin: '0 0 8px' }}>
            Last updated: <strong>October 24, 2023</strong>
          </p>
          <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6, margin: 0 }}>
            Please read these terms carefully before using the Splitly platform. By accessing or using our service, you agree to be bound by these terms.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map(sec => (
            <div key={sec.title} style={{ background: '#fff', borderRadius: 20, padding: '18px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {sec.icon}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: '800', color: '#1C1C1E', margin: '0 0 8px' }}>{sec.title}</p>
                <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.65, margin: 0 }}>{sec.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', padding: '36px 8px 0' }}>
          <p style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: '0 0 10px' }}>Questions?</p>
          <p style={{ fontSize: 14, color: '#8E8E93', margin: '0 0 20px', lineHeight: 1.55 }}>
            If you have any questions about these Terms, please contact us at:
          </p>
          <a
            href="mailto:legal@splitly.app"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#6347F5', borderRadius: 100, padding: '13px 26px',
              textDecoration: 'none', fontSize: 15, fontWeight: '700', color: '#fff',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="#fff" strokeWidth="2" />
              <path d="M2 7l10 7 10-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            legal@splitly.app
          </a>
        </div>

        {/* Dev credit */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#AEAEB2', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600', margin: 0 }}>
            Developed by codexcoder
          </p>
        </div>
      </div>
    </div>
  );
}
