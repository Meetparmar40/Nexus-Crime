import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const lightCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;
const darkCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M3 3l7.5 18 2.5-7.5L20.5 11z'/%3E%3C/svg%3E"), auto`;

const AuthView = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nexus_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    localStorage.setItem('nexus_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Milder, balanced color palette synchronized with HeroView
  const theme = isDark ? {
    bgPage: '#0f1013',         // Mild dark canvas
    navBg: 'rgba(21, 23, 28, 0.94)',
    bgCard: '#15171c',         // Elevated card
    border: '#292c35',
    borderInput: '#2a2e38',
    inputBg: '#1b1d24',
    textHeading: '#ffffff',
    textBody: '#c4c6ce',
    textMuted: '#8b8e99',      // Subtle muted placeholder tone
    btnPrimaryBg: '#242732',
    btnPrimaryText: '#ffffff',
    btnPrimaryBorder: '#3d4255',
    navPillBg: '#1f222a',
    navPillText: '#f4f4f5',
    navPillBorder: '#2f3340',
    cardShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)'
  } : {
    bgPage: '#f7f7f5',
    navBg: 'rgba(255, 255, 255, 0.92)',
    bgCard: '#ffffff',
    border: '#e4e4df',
    borderInput: '#e2e4e8',
    inputBg: '#ffffff',
    textHeading: '#111111',
    textBody: '#444446',
    textMuted: '#717175',
    btnPrimaryBg: '#111111',
    btnPrimaryText: '#ffffff',
    btnPrimaryBorder: '#111111',
    navPillBg: '#f2f2ef',
    navPillText: '#111111',
    navPillBorder: '#e4e4df',
    cardShadow: '0 20px 45px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px #e4e4df'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/c');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        navigate('/c');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between transition-colors duration-200 select-none"
      style={{
        backgroundColor: theme.bgPage,
        color: theme.textBody,
        cursor: isDark ? darkCursor : lightCursor
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Header Navigation Bar (Back Button + Theme Toggle)         */}
      {/* ------------------------------------------------------------- */}
      <header
        className="w-full py-4 px-6 sm:px-12 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200 flex justify-between items-center"
        style={{
          backgroundColor: theme.navBg,
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: theme.navPillBg,
            color: theme.navPillText,
            border: `1px solid ${theme.navPillBorder}`
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:opacity-90"
            style={{
              backgroundColor: theme.navPillBg,
              color: theme.navPillText,
              border: `1px solid ${theme.navPillBorder}`
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. Centered Authentication Card                               */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div
          className="w-full max-w-md rounded-[24px] p-8 sm:p-10 transition-all duration-200"
          style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <div
              onClick={() => navigate('/')}
              className="w-13 h-13 rounded-2xl mb-4 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: isDark ? '#ffffff' : '#111111',
                color: isDark ? '#111111' : '#ffffff'
              }}
              title="Return to Home"
            >
              <Dna size={26} />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight mb-1 transition-colors"
              style={{ color: theme.textHeading }}
            >
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p
              className="text-xs sm:text-sm text-center leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              {isLogin
                ? 'Please enter your details to sign in.'
                : 'Please enter your details to sign up.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-5 p-3 rounded-xl text-xs text-center font-medium border"
              style={{
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2',
                color: '#f87171'
              }}
            >
              {error}
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                className="text-[11px] font-mono font-semibold uppercase tracking-wider block"
                style={{ color: theme.textMuted }}
              >
                E-Mail Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none"
                style={{
                  backgroundColor: theme.inputBg,
                  border: `1px solid ${theme.borderInput}`,
                  color: theme.textHeading
                }}
                placeholder="name@agency.gov"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                className="text-[11px] font-mono font-semibold uppercase tracking-wider block"
                style={{ color: theme.textMuted }}
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl text-sm transition-all focus:outline-none"
                  style={{
                    backgroundColor: theme.inputBg,
                    border: `1px solid ${theme.borderInput}`,
                    color: theme.textHeading
                  }}
                  placeholder="••••••••"
                />

                {/* Seamless Eye Button (No White Box) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 cursor-pointer transition-opacity hover:opacity-75"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: theme.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password (Text-only, No White Pill) */}
            {isLogin && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded cursor-pointer"
                    style={{ accentColor: isDark ? '#3d4255' : '#111111' }}
                  />
                  <span style={{ color: theme.textMuted }}>
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your verified e-mail.")}
                  className="hover:underline transition-all cursor-pointer"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: theme.textMuted,
                    fontSize: '12px'
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center mt-3 shadow-sm cursor-pointer hover:opacity-90 disabled:opacity-60 text-sm"
              style={{
                backgroundColor: theme.btnPrimaryBg,
                color: theme.btnPrimaryText,
                border: `1px solid ${theme.btnPrimaryBorder}`
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Bottom Switch Link (Text-only, No White Pill) */}
          <div
            className="mt-7 pt-4 text-center flex items-center justify-center gap-1.5 text-xs"
            style={{
              borderTop: `1px solid ${theme.border}`,
              color: theme.textMuted
            }}
          >
            <span>{isLogin ? "Don't have an account yet?" : "Already have an account?"}</span>
            <button
              type="button"
              onClick={() => navigate(isLogin ? '/signup' : '/login')}
              className="font-semibold hover:underline cursor-pointer"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: isDark ? '#c4c6ce' : '#111111'
              }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. Minimal Subtle Bottom Bar                                  */}
      {/* ------------------------------------------------------------- */}
      <footer
        className="w-full py-4 text-center text-[11px] transition-colors duration-200"
        style={{ color: theme.textMuted }}
      >
        <span>CrimeNexus — Forensic Intelligence Platform</span>
      </footer>
    </div>
  );
};

export default AuthView;