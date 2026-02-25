import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMailOutline } from 'react-icons/io5';
import useAuthStore from '../stores/authStore';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, error, clearError } = useAuthStore();

  // Get registration data from location state
  const { name, email, password } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
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

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
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
    <div className="page page-white" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '40px 20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        <IoMailOutline style={{ fontSize: '32px', color: 'var(--blue)' }} />
      </div>

      <h1 className="title-large" style={{ marginBottom: '8px', textAlign: 'center' }}>Verify Email</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'center', marginBottom: '48px', maxWidth: '280px', lineHeight: '1.5' }}>
        We've sent a 6-digit code to your email <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{email}</span>.
      </p>

      {error && (
        <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '32px', fontSize: '14px', width: '100%' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '40px' }}>
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
              style={{
                width: '48px',
                height: '56px',
                borderRadius: '50%',
                border: digit ? '2px solid var(--blue)' : '1px solid var(--gray-300)',
                background: 'var(--white)',
                fontSize: '20px',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '15px', color: 'var(--text-secondary)' }}>
          {timer > 0 ? (
            <span>Resend code in <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{formatTime(timer)}</span></span>
          ) : (
            <span style={{ color: 'var(--blue)', fontWeight: '600', cursor: 'pointer' }} onClick={handleResend}>
              {resending ? 'Resending...' : 'Resend OTP'}
            </span>
          )}
        </p>

        <button className="btn-primary" type="submit" disabled={loading || otp.join('').length < 6}>
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>
    </div>
  );
}
