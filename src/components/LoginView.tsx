import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Store, ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  onNavigateToLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigateToLanding }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMsg('');

    // Simulate small delays for smooth, realistic premium loading animation
    setTimeout(() => {
      const result = login(username, password);
      
      if (result.success) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setPassword(''); // Clear only password
        setErrorMsg('Username atau password salah.');
        setIsShaking(true); // Trigger shake animation
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 text-white z-40 overflow-hidden font-sans">
      {/* Dynamic Background elements matching Splash page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />

      <div className="w-full max-w-md px-6 z-10">
        {/* Animated Card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: isShaking ? 0.5 : 0.8, ease: "easeInOut" }}
          onAnimationComplete={() => setIsShaking(false)}
          className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Card subtle top-glow accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* Logo Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/10 border border-blue-400/20">
              <Store className="h-7 w-7 text-white" />
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-white mb-1 flex items-center gap-1.5">
              KonterIQ
            </h1>
            <p className="text-[11px] font-mono tracking-widest text-slate-500 font-bold uppercase">
              Smart Business Dashboard
            </p>
          </div>

          {/* Elegant Error Message Alert */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-200 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                {errorMsg}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/10"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/50 rounded-xl py-3 pl-11 pr-11 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/10"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  id="btn-toggle-password-visibility"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={isLoading}
                id="btn-login-submit"
                className="w-full max-w-xs sm:max-w-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 border border-blue-400/10 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5" />
                    Masuk Ke Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
            <button
              onClick={onNavigateToLanding}
              id="btn-back-to-landing"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Halaman Utama (Beranda)
            </button>
          </div>
        </motion.div>

        {/* Brand Copyright */}
        <p className="text-center text-[11px] text-slate-700 font-mono mt-6">
          © {new Date().getFullYear()} KonterIQ. All rights reserved.
        </p>
      </div>
    </div>
  );
};
