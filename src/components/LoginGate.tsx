import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';

interface LoginGateProps {
  onSuccess: () => void;
}

const AUTHORIZED_EMAIL = 'arasheed5662@gmail.com';
const AUTHORIZED_PASSWORD = 'MzH$566289$97';
export const AUTH_STORAGE_KEY = 'zialogy_auth_token';

export const LoginGate: React.FC<LoginGateProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // Try backend endpoint first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const token = data.token || btoa(`${cleanEmail}:${Date.now()}`);
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, token);
        }
        setIsLoading(false);
        onSuccess();
        return;
      }
    } catch {
      // Offline fallback
    }

    // Direct credential check
    if (cleanEmail === AUTHORIZED_EMAIL.toLowerCase() && cleanPass === AUTHORIZED_PASSWORD) {
      const token = btoa(`${cleanEmail}:${Date.now()}`);
      if (rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, token);
      }
      setIsLoading(false);
      onSuccess();
    } else {
      setIsLoading(false);
      setError('Invalid email or password. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08090C] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Background Video Loop (Login Page Only) - Sharp, High-Contrast Cinematic Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85 scale-100 filter brightness-105 contrast-125 saturate-110 transition-all duration-700"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        />
        {/* Crisp Ambient Lighting & Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Helium luminous glow orbs behind card */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gradient-to-tr from-cyan-500/20 via-pink-500/20 to-amber-400/20 rounded-full blur-[90px] pointer-events-none z-0 animate-pulse duration-1000" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-violet-600/25 via-fuchsia-500/20 to-cyan-400/20 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Monogram */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 opacity-80 blur-md group-hover:opacity-100 transition duration-500" />
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/40 flex items-center justify-center p-1.5 bg-black/60 backdrop-blur-xl shadow-[0_0_35px_rgba(236,72,153,0.35)] transition-transform hover:scale-105">
              <img
                src="https://res.cloudinary.com/dawlj9ne4/image/upload/Z_Logo_j2whtg.png"
                alt="Zialogy Monogram"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-syne font-extrabold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-cyan-200 mt-4 drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
            Z I A L O G Y
          </h1>
          <p className="text-xs text-cyan-200/90 mt-1 tracking-wider uppercase flex items-center gap-1.5 drop-shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            Protected AI Ad Film Studio
          </p>
        </div>

        {/* Luminous Helium Glassmorphic Form Container */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/35 via-cyan-400/25 to-pink-500/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.6),0_0_40px_rgba(6,182,212,0.15)]">
          <div className="bg-gradient-to-b from-black/40 via-black/30 to-black/55 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-white tracking-wide drop-shadow-[0_1px_8px_rgba(255,255,255,0.3)]">
                Sign In to Continue
              </h2>
              <p className="text-xs text-neutral-300/80 mt-1">
                Enter your authorized credentials to access the 4K AI video generation suite.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-400/40 backdrop-blur-md flex items-start gap-2.5 text-red-200 text-xs shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-200/90 mb-1.5">
                  Authorized Login Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-300/70">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arasheed5662@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.07] border border-white/20 hover:border-cyan-400/50 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 backdrop-blur-lg transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-200/90 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-300/70">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-white/[0.07] border border-white/20 hover:border-pink-400/50 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-400/30 backdrop-blur-lg transition-all font-mono shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-pink-300" />
                    ) : (
                      <Eye className="w-4 h-4 text-cyan-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-black/40 border-white/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-400"
                  />
                  <span className="text-xs text-neutral-300 hover:text-white transition-colors">
                    Keep me signed in
                  </span>
                </label>

                <span className="text-[11px] text-cyan-200/80 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-300" />
                  Encrypted Session
                </span>
              </div>

              {/* Submit Button with Option 2 Cyan-to-Purple Pill Gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 px-6 rounded-full btn-pill-cyan text-white font-bold text-xs sm:text-sm tracking-[0.2em] flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="w-6 h-6" /> {/* Balance spacer */}
                <div className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <span>UNLOCK STUDIO</span>
                  )}
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/30 group-hover:scale-105 transition-all shrink-0">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-white/50 drop-shadow">
            Aati.tv Ad Film Studio &copy; {new Date().getFullYear()} &bull; Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};
