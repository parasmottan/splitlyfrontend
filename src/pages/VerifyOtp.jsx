import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMailOutline } from 'react-icons/io5';
import useAuthStore from '../stores/authStore';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, error, clearError } = useAuthStore();

  const { name, email, password } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
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
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;

    setLoading(true);
    try {
      await verifyOtp(name, email, password, otpCode);
      navigate('/groups', { replace: true });
    } catch (err) {
      // error handled in store
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    try {
      await resendOtp(email);
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) { }
    setResending(false);
  };

  return (
    <div className="page" style={{
      display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '40px 24px',
      background: 'linear-gradient(160deg, #EAEBFF 0%, #D8E5FF 50%, #E2EDF8 100%)'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '50px', left: '20px', fontSize: '24px', color: '#111827' }}>
          &#8592;
        </button>

        <h1 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px', textAlign: 'center', color: '#111827', letterSpacing: '-0.5px' }}>
          Check your vibe 💌
        </h1>
        <p style={{ color: '#4B5563', fontSize: '17px', textAlign: 'center', fontWeight: '500', marginBottom: '40px', maxWidth: '280px', lineHeight: '1.5' }}>
          We sent a code to your email.
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '16px', borderRadius: '16px', marginBottom: '32px', fontSize: '15px', fontWeight: '500', width: '100%' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
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
                  width: '52px',
                  height: '64px',
                  borderRadius: '16px',
                  border: digit ? '2px solid var(--blue)' : '2px solid rgba(255,255,255,0.6)',
                  background: digit ? 'var(--white)' : 'rgba(255,255,255,0.4)',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--blue)',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease, background 200ms ease',
                  boxShadow: digit ? '0 8px 20px rgba(99, 71, 245, 0.15)' : 'none'
                }}
              />
            ))}
          </div>

          <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '15px', color: '#4B5563', fontWeight: '600' }}>
            {timer > 0 ? (
              <span style={{ color: 'var(--blue)' }}>Resend code in {formatTime(timer)}</span>
            ) : (
              <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={handleResend}>
                {resending ? 'Resending...' : 'Resend Code'}
              </span>
            )}
          </p>

          <button className="btn-primary" type="submit" disabled={loading || otp.join('').length < 6}>
            {loading ? 'Verifying...' : 'Verify & Enter'}
          </button>
        </form>
      </div>

      <div style={{ paddingBottom: '20px' }} />
    </div>
  );
}
