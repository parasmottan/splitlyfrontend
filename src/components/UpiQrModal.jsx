import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * UpiQrModal — shown on desktop when a UPI deep link can't be auto-launched.
 * The user scans this QR with their phone to open the UPI app.
 *
 * Props:
 *   upiLink    - Full UPI deep link string
 *   amount     - Amount to pay (number)
 *   receiver   - Receiver name (string)
 *   onClose    - Close handler
 *   onSettle   - Called when user clicks "Mark as Settled"
 *   settling   - Boolean loading state for settle action
 */
export default function UpiQrModal({ upiLink, amount, receiver, onClose, onSettle, settling }) {
  const overlayRef = useRef(null);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 28, padding: '32px 28px',
        maxWidth: 380, width: '100%', textAlign: 'center',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        animation: 'slideUp 220ms ease both',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 36 }}>📱</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: '800', color: '#1C1C1E', margin: '0 0 6px' }}>
          Scan to Pay
        </h2>
        <p style={{ fontSize: 14, color: '#8E8E93', margin: '0 0 24px', lineHeight: 1.5 }}>
          Open your UPI app and scan this QR to pay{' '}
          <strong style={{ color: '#1C1C1E' }}>{receiver}</strong>
        </p>

        {/* QR Code */}
        <div style={{
          display: 'inline-flex', padding: 16,
          background: '#F8F8FF', borderRadius: 20,
          border: '1.5px solid #E8E5FF', marginBottom: 20,
        }}>
          <QRCodeSVG
            value={upiLink}
            size={200}
            level="M"
            fgColor="#1C1C1E"
            bgColor="transparent"
          />
        </div>

        {/* Amount pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 20px', background: 'rgba(99,71,245,0.08)',
          border: '1px solid rgba(99,71,245,0.2)', borderRadius: 100,
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 13, fontWeight: '700', color: '#6347F5' }}>
            ₹{Number(amount).toFixed(2)} · UPI
          </span>
        </div>

        {/* Notice */}
        <p style={{ fontSize: 12, color: '#AEAEB2', margin: '0 0 20px', lineHeight: 1.4 }}>
          After completing the payment in your UPI app, tap "Mark as Settled" below to update the group balance.
        </p>

        {/* Mark as Settled CTA */}
        <button
          onClick={onSettle}
          disabled={settling}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #34C759 0%, #28A745 100%)',
            color: '#fff', fontSize: 16, fontWeight: '700',
            borderRadius: 100, border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(52,199,89,0.35)',
            marginBottom: 10,
            opacity: settling ? 0.7 : 1,
            transition: 'opacity 150ms',
          }}
        >
          {settling ? 'Marking...' : '✓ Mark as Settled'}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: 'transparent', color: '#8E8E93',
            fontSize: 15, fontWeight: '600', border: 'none', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
