import React from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_BG = '#EAEAF5';
const CARD = { background: '#fff', borderRadius: 20, padding: '20px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 14 };
const H2 = { fontSize: 16, fontWeight: '800', color: '#1C1C1E', marginBottom: 10, marginTop: 0 };
const P = { fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: '0 0 10px' };

const sections = [
  {
    title: 'Introduction',
    content: 'Welcome to Splitly ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and services.',
  },
  {
    title: 'Data We Collect',
    content: 'We collect information you provide directly: your name, email address, and password when you register. We also collect activity data including expenses, group memberships, and settlement records that you create within the app. We do not collect payment card details.',
  },
  {
    title: 'How We Use Your Data',
    content: 'We use your information to: operate and maintain your account, process and display group expenses, calculate and simplify debts, send notification emails (such as OTP verification and settlement reminders), and improve our services. We do not sell your personal data to third parties.',
  },
  {
    title: 'Data Security',
    content: 'Your password is hashed using bcrypt with a salt factor of 12 before storage — we never store it in plain text. API access is protected by short-lived JWT access tokens and long-lived refresh tokens stored in HTTP-only cookies. All data is stored on MongoDB Atlas with encryption at rest.',
  },
  {
    title: 'Third-Party Services',
    content: 'Splitly uses the following third-party services: MongoDB Atlas (database hosting), Zeabur (backend hosting), Vercel (frontend hosting), and Nodemailer via Gmail SMTP (email delivery). Each of these services has their own privacy policies and data handling practices.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your personal data for as long as your account is active. You may delete your account at any time from Account → Settings, which permanently removes your profile and removes you from all groups. Some anonymized aggregate data may be retained for 30 days after deletion.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about this Privacy Policy or how your data is handled, please contact us.',
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>

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
        <h1 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Privacy Policy</h1>
      </div>

      <div style={{ padding: '4px 20px 60px' }}>

        {/* Last updated */}
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
            Splitly is currently under active development. Some major and minor features may be incomplete, temporarily unavailable, or updated soon. By using the app, users acknowledge that the platform is still evolving and improvements are ongoing.
          </p>
        </div>

        {/* Sections */}
        {sections.map((sec) => (
          <div key={sec.title} style={CARD}>
            <h2 style={H2}>{sec.title}</h2>
            <p style={{ ...P, marginBottom: 0 }}>{sec.content}</p>
          </div>
        ))}

        {/* Support email */}
        <div style={{ ...CARD, background: 'rgba(99,71,245,0.06)', border: '1.5px solid rgba(99,71,245,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>📩</div>
          <p style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 }}>Privacy Questions?</p>
          <a
            href="mailto:noreplysplitly@gmail.com"
            style={{ fontSize: 15, fontWeight: '800', color: '#6347F5', textDecoration: 'none' }}
          >
            noreplysplitly@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
