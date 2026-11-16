import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SidiLogoEmblem } from './BrandVisuals';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register, navigate } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('user@siditravel.com');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kano');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAuthModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [authModalOpen, setAuthModalOpen]);

  if (!authModalOpen) return null;

  const handleQuickLogin = async (demoEmail: string, target: '/dashboard' | '/admin') => {
    setBusy(true);
    const user = await login(demoEmail);
    setBusy(false);
    if (user) {
      navigate(target);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === 'login') {
      const user = await login(email);
      if (user) {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } else {
      const user = await register({ name, email, phone, city });
      if (user) {
        navigate('/dashboard');
      }
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122B]/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAuthModalOpen(false);
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl">
        {/* Luxury Top Banner */}
        <div className="bg-gradient-to-r from-[#05122B] via-[#0A224E] to-[#102F6A] px-6 py-5 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <SidiLogoEmblem className="w-10 h-10 shrink-0" />
            <div>
              <h2 id="auth-modal-title" className="font-display text-xl font-bold text-white">
                {mode === 'login' ? 'Portal Access' : 'Create Traveler Account'}
              </h2>
              <p className="text-xs text-[#F5B800]">Sidi Travel &amp; Tours Ltd.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close sign in dialog"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1-Click Demo Login Panel */}
          <div className="bg-[#FAF9F6] border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              1-Click Demo Quick Access
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('user@siditravel.com', '/dashboard')}
                className="flex items-center justify-between gap-2 p-2.5 text-left bg-white border border-slate-200 hover:border-[#0A224E] rounded-xl transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-[#FBF6E6] text-[#9A7412] flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0A224E] truncate">Pilgrim Demo</p>
                    <p className="text-[10px] font-mono text-slate-500 truncate">user@siditravel.com</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => handleQuickLogin('admin@siditravel.com', '/admin')}
                className="flex items-center justify-between gap-2 p-2.5 text-left bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-white/10 text-[#F5B800] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Admin Demo</p>
                    <p className="text-[10px] font-mono text-slate-300 truncate">admin@siditravel.com</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5B800] shrink-0" />
              </button>
            </div>
          </div>

          {/* Mode Switch */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login' ? 'bg-white text-[#0A224E] shadow-xs' : 'text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register' ? 'bg-white text-[#0A224E] shadow-xs' : 'text-slate-600'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sadiq Abubakar"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="auth-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="auth-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0803..."
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                    />
                  </div>
                  <div>
                    <label htmlFor="auth-city" className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      id="auth-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@siditravel.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 text-sm font-semibold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-sm"
            >
              {busy ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : 'Create Traveler Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
