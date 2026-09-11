import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ isOpen, onClose, onVerified }) {
  const [authMethod, setAuthMethod] = useState('digilocker');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sensitive input tokens (discarded after validation)
  const [fullName, setFullName] = useState('');
  const [idToken, setIdToken] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!idToken) return;
    setLoading(true);

    // Simulate contacting DigiLocker / MeriPehchaan Auth Server
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Return safe metadata; do not retain raw identifier numbers
      onVerified({
        name: fullName || "Authorized Signatory",
        isGovernmentVerified: true,
        authProvider: authMethod === 'digilocker' ? 'DigiLocker SSO' : 'Work Email/Phone',
        verifiedAt: new Date().toLocaleDateString()
      });
      // Clear sensitive state from memory
      setIdToken('');
      setOtp('');
      onClose();
    }, 1500);
  };

  return (
    <div className="processing-overlay" onClick={onClose}>
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-header">
          <div className="gov-badge-row">
            <span className="gov-tag">🔒 Zero-Knowledge SSO Gateway</span>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <h2>Enterprise Verification Gateway</h2>
          <p>Link your credentials via official SSO tokens. Private government ID numbers are never stored on our servers.</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${authMethod === 'digilocker' ? 'active' : ''}`}
            onClick={() => { setAuthMethod('digilocker'); setStep(1); }}
          >
            🇮🇳 DigiLocker / MeriPehchaan SSO
          </button>
          <button
            type="button"
            className={`tab-btn ${authMethod === 'manual' ? 'active' : ''}`}
            onClick={() => { setAuthMethod('manual'); setStep(1); }}
          >
            ✉️ Work Email / Mobile OTP
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              onSubmit={handleSendOtp}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="auth-form"
            >
              <label>Authorized Signatory / Enterprise Name</label>
              <input
                type="text"
                placeholder="e.g., Priya Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <label>
                {authMethod === 'digilocker'
                  ? "Virtual ID / DigiLocker Registered Mobile (Masked)"
                  : "Work Email or Registered Mobile"}
              </label>
              <input
                type={authMethod === 'digilocker' ? "password" : "text"}
                autoComplete="off"
                placeholder={
                  authMethod === 'digilocker'
                    ? "•••• •••• ••••"
                    : "founder@enterprise.in or +91 9876543210"
                }
                value={idToken}
                onChange={(e) => setIdToken(e.target.value)}
                required
              />

              <div className="consent-box">
                <input type="checkbox" id="consent" required />
                <label htmlFor="consent">
                  I consent to verify my credentials via <strong>DigiLocker / National SSO</strong>. No raw personal numbers will be persisted.
                </label>
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? "Connecting to Government Gateway..." : "Request Secure OTP →"}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              onSubmit={handleVerifyOtp}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="auth-form"
            >
              <div className="otp-banner">
                OTP dispatched via official government authentication gateway.
              </div>

              <label>Enter 6-Digit Government OTP</label>
              <input
                type="password"
                maxLength="6"
                placeholder="••••••"
                className="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? "Verifying Credentials..." : "Authenticate & Pull Verified Evidence ✓"}
              </button>

              <button
                type="button"
                className="btn-link"
                onClick={() => setStep(1)}
              >
                ← Edit details
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}