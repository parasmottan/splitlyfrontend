import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const PAGE_BG = '#EAEAF5';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ background: PAGE_BG, minHeight: '100dvh', maxWidth: '430px', margin: '0 auto' }}>
      <SEO
        title="Privacy Policy - Splitly"
        description="Learn how Splitly collects, uses, and protects your personal data and privacy."
        canonical="/privacy"
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
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1C1C1E', margin: 0, marginRight: 32 }}>Privacy Policy</h1>
      </div>

      <div style={{ padding: '0 20px 60px' }}>

        {/* Active Development banner */}
        <div style={{
          background: 'rgba(99,71,245,0.06)',
          border: '1.5px solid rgba(99,71,245,0.3)',
          borderRadius: 18, padding: '14px 16px', marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🔧</span>
          <div>
            <p style={{ fontSize: 11, fontWeight: '800', color: '#6347F5', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Active Development</p>
            <p style={{ fontSize: 13, color: '#3C3C43', lineHeight: 1.55, margin: 0 }}>
              Splitly is currently in beta. Our privacy practices are evolving as we add new features. Last updated: Oct 2023.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#6347F5', flexShrink: 0 }} />
            <h2 style={{ fontSize: 18, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Introduction</h2>
          </div>
          <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: 0 }}>
            At Splitly, we believe transparency is the new currency. This policy outlines how we handle your personal information when you use our gamified money-sharing platform. By using Splitly, you trust us with your data, and we take that responsibility seriously.
          </p>
        </div>

        {/* Data Collection */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#FF3B30', flexShrink: 0 }} />
            <h2 style={{ fontSize: 18, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Data Collection</h2>
          </div>
          <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: '0 0 12px' }}>
            We collect information you provide directly, such as your user profile, transaction details, and social connections within the app.
          </p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {[
              'Account information (Name, Email, Avatar)',
              'Financial transaction metadata',
              'Device and usage information',
            ].map(item => (
              <li key={item} style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.8 }}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Usage */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#FF3B30', flexShrink: 0 }} />
            <h2 style={{ fontSize: 18, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Usage</h2>
          </div>
          <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: '0 0 16px' }}>
            Your data fuels the gamification engine, helping us calculate your Karma Score and track streak achievements. We do not sell your personal data to third-party advertisers. We use your information to:
          </p>
          {[
            { icon: '🛡️', text: 'Verify your identity' },
            { icon: '⚡', text: 'Process rapid transactions' },
            { icon: '🏆', text: 'Award achievements & badges' },
          ].map(row => (
            <div key={row.text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,71,245,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {row.icon}
              </div>
              <span style={{ fontSize: 14, color: '#3C3C43', fontWeight: '500' }}>{row.text}</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#34C759', flexShrink: 0 }} />
            <h2 style={{ fontSize: 18, fontWeight: '800', color: '#1C1C1E', margin: 0 }}>Security</h2>
          </div>
          <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.7, margin: 0 }}>
            We implement industry-standard encryption for data in transit and at rest. While no service is 100% secure, we continuously monitor our systems for potential vulnerabilities to keep your financial data safe.
          </p>
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', padding: '32px 16px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 17, fontWeight: '700', color: '#1C1C1E', margin: '0 0 8px' }}>Have questions about your privacy?</p>
          <p style={{ fontSize: 14, color: '#8E8E93', margin: '0 0 20px', lineHeight: 1.5 }}>
            Our support team is available to help clarify any concerns regarding your data.
          </p>
          <a
            href="mailto:noreplysplitly@gmail.com"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid rgba(99,71,245,0.25)',
              borderRadius: 100, padding: '12px 24px', textDecoration: 'none',
              fontSize: 15, fontWeight: '700', color: '#6347F5',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="#6347F5" strokeWidth="2" />
              <path d="M2 7l10 7 10-7" stroke="#6347F5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            noreplysplitly@gmail.com
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
