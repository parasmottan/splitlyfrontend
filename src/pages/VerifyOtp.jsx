import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, error, clearError } = useAuthStore();

  const { name, email, password } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(24);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newOtp = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 4) return;
    setLoading(true);
    try {
      await verifyOtp(name, email, password, otpCode);
      navigate('/groups', { replace: true });
    } catch (err) { }
    setLoading(false);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await resendOtp(email);
      setTimer(60);
      setOtp(['', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) { }
    setResending(false);
  };

  const formatTime = (s) => `0:${s.toString().padStart(2, '0')}`;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh',
      background: 'linear-gradient(155deg, #EBEDff 0%, #D9E0FF 30%, #C8D6FF 60%, #DDE6F8 100%)',
      padding: '0',
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: '52px', left: '24px',
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', color: '#111827', cursor: 'pointer',
        }}
      >
        ←
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '100px 28px 0' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px', color: '#0F1130', letterSpacing: '-0.8px', lineHeight: '1.1' }}>
          Check your vibe 💌
        </h1>
        <p style={{ color: '#555875', fontSize: '16px', fontWeight: '400', marginBottom: '44px', lineHeight: '1.5' }}>
          We sent a code to your email.
        </p>

        {error && (
          <div style={{ background: 'rgba(255,59,48,0.1)', color: '#DC2626', padding: '14px 16px', borderRadius: '16px', marginBottom: '24px', fontSize: '15px', border: '1px solid rgba(220,38,38,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* 4-digit OTP boxes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => { handleChange(e, index); clearError(); }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                style={{
                  width: '64px', height: '72px',
                  borderRadius: '20px',
                  border: digit ? '2.5px solid rgba(99,71,245,0.7)' : '2px solid rgba(255,255,255,0.7)',
                  background: digit ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(12px)',
                  fontSize: '28px', fontWeight: '700',
                  color: digit ? '#6347F5' : '#9CA3AF',
                  textAlign: 'center', outline: 'none',
                  boxShadow: digit ? '0 8px 24px rgba(99,71,245,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 200ms ease',
                }}
              />
            ))}
          </div>

          <p style={{ textAlign: 'center', marginBottom: '36px', fontSize: '15px', fontWeight: '600' }}>
            {timer > 0 ? (
              <span style={{ color: 'var(--blue)' }}>Resend code in {formatTime(timer)}</span>
            ) : (
              <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={handleResend}>
                {resending ? 'Resending...' : 'Resend Code'}
              </span>
            )}
          </p>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 4}
            style={{
              width: '100%', padding: '18px 24px',
              background: 'linear-gradient(135deg, #6347F5 0%, #4B32CC 100%)',
              color: 'white', fontSize: '17px', fontWeight: '700',
              borderRadius: '100px', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,71,245,0.35)',
              opacity: (loading || otp.join('').length < 4) ? 0.5 : 1,
              transition: 'opacity 200ms',
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
