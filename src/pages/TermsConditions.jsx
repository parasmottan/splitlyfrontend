import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const PAGE_BG = '#EAEAF5';
const CARD = { background: '#fff', borderRadius: 20, padding: '20px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 14 };
const H2 = { fontSize: 16, fontWeight: '800', color: '#1C1C1E', marginBottom: 10, marginTop: 0 };
const P = { fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: '0 0 8px' };

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using Splitly, you confirm that you are at least 13 years of age and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must discontinue use of the application immediately.',
  },
  {
    title: '2. Use of Platform',
    content: 'Splitly is a personal expense-splitting and group finance management tool. You agree to use it only for lawful purposes and in a manner that does not infringe on the rights of others. You must not misuse the platform, attempt to gain unauthorized access, or introduce malicious code of any kind.',
  },
  {
    title: '3. Financial Disclaimer',
    content: 'Splitly is NOT a payment processor, bank, or financial institution. We do not process, hold, or transfer money. All financial settlements between users happen independently outside the platform via third-party services (UPI, bank transfers, cash, etc.). Splitly only tracks and displays expense records as entered by users. We are not responsible for incorrect records or disputes between users.',
  },
  {
    title: '4. Account Responsibility',
    content: 'You are responsible for maintaining the security of your account credentials. Do not share your password with anyone. You are responsible for all activity that occurs under your account. Notify us immediately at noreplysplitly@gmail.com if you suspect unauthorized access.',
  },
  {
    title: '5. User Content',
    content: 'You retain ownership of any data you enter into Splitly (expense names, amounts, group names). By using the service, you grant us a limited license to store and display that data to provide the service. You must not input false, defamatory, or harmful information.',
  },
  {
    title: '6. Limitation of Liability',
    content: 'Splitly is provided "as is" without any warranties. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including loss of data, financial disputes between users, or service interruptions.',
  },
  {
    title: '7. Modifications',
    content: 'We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms. We will make reasonable efforts to notify users of significant changes via email or in-app notification.',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Terms & Conditions</h1>
      </div>

      <div style={{ padding: '4px 20px 60px' }}>

        <p style={{ fontSize: 12, color: '#8E8E93', marginBottom: 16, fontWeight: '500' }}>
          Last updated: March 2026
        </p>

        {/* ⚠️ Development notice */}
        <div style={{
          background: 'rgba(99,71,245,0.06)',
          border: '1.5px solid rgba(99,71,245,0.25)',
          borderRadius: 18, padding: '16px 18px', marginBottom: 18,
        }}>
          <p style={{ fontSize: 14, fontWeight: '800', color: '#6347F5', margin: '0 0 8px' }}>⚠️ Active Development Notice</p>
          <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.6, margin: 0 }}>
            Splitly is currently under active development. Some major and minor features may be incomplete, temporarily unavailable, or subject to change. By using this app you acknowledge that it is still evolving and agree that we are not liable for any issues arising from features that are in development.
          </p>
        </div>

        {sections.map((sec) => (
          <div key={sec.title} style={CARD}>
            <h2 style={H2}>{sec.title}</h2>
            <p style={{ ...P, marginBottom: 0 }}>{sec.content}</p>
          </div>
        ))}

        {/* Support */}
        <div style={{ ...CARD, background: 'rgba(99,71,245,0.06)', border: '1.5px solid rgba(99,71,245,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>📩</div>
          <p style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 }}>Legal Questions?</p>
          <a
            href="mailto:noreplysplitly@gmail.com"
            style={{ fontSize: 15, fontWeight: '800', color: '#6347F5', textDecoration: 'none' }}
          >
            noreplysplitly@gmail.com
          </a>
        </div>

        {/* Developer credit */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid rgba(99,71,245,0.15)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#C7C7CC', margin: '0 0 3px', letterSpacing: '0.3px' }}>Developed by</p>
          <p style={{ fontSize: 13, fontWeight: '700', color: '#6347F5', margin: 0, opacity: 0.75 }}>
            codexcoder <span style={{ color: '#8E8E93', fontWeight: '500' }}>(parasmottan)</span>
          </p>
        </div>

      </div>
    </div>
  );
}
