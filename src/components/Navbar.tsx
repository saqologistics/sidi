import React, { useState } from 'react';
import {
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { BRAND_CONTACT } from '../data/seedData';
import { AppRoute, useApp } from '../context/AppContext';
import { SidiLogoEmblem } from './BrandVisuals';

const NAV_LINKS: { label: string; to: AppRoute }[] = [
  { label: 'Home', to: '/' },
  { label: 'Hajj & Umrah', to: '/umrah-packages' },
  { label: 'Flights', to: '/flights' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Visa Services', to: '/visa-services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const {
    route,
    navigate,
    currency,
    setCurrency,
    currentUser,
    setAuthModalOpen,
    logout,
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (to: AppRoute) => {
    navigate(to);
    setMobileOpen(false);
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_16px_rgba(5,18,43,0.05)] no-print">
      {/* Slim Top Utility Strip (Desktop) */}
      <div className="hidden lg:block bg-[#05122B] text-slate-200 text-xs border-b border-[#D4AF37]/25">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 truncate">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Kano Desk Active
            </span>
            <a
              href={`tel:${BRAND_CONTACT.phones[0]}`}
              className="flex items-center gap-1.5 hover:text-[#F5B800] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-mono tabular-nums text-[11px]">
                {BRAND_CONTACT.phones[0]} / {BRAND_CONTACT.phones[1]}
              </span>
            </a>
            <a
              href={`mailto:${BRAND_CONTACT.email}`}
              className="flex items-center gap-1.5 hover:text-[#F5B800] transition-colors whitespace-nowrap"
            >
              <Mail className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-[11px]">{BRAND_CONTACT.email}</span>
            </a>
            <span className="flex items-center gap-1.5 text-slate-300/90 truncate text-[11px]">
              <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
              <span className="truncate">Opp. Ado Bayero Mall, Zoo Road, Kano State</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-slate-400">Currency</span>
            <div
              className="inline-flex rounded-md border border-white/15 bg-white/5 p-0.5"
              role="group"
              aria-label="Currency selector"
            >
              <button
                type="button"
                onClick={() => setCurrency('NGN')}
                className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded transition-colors whitespace-nowrap ${
                  currency === 'NGN'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                NGN ₦
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded transition-colors whitespace-nowrap ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                USD $
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-17 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A224E] rounded-lg py-1"
        >
          <SidiLogoEmblem className="w-10 h-10 shrink-0 drop-shadow-xs" />
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-[#0A224E] block leading-none">
              Sidi Travel &amp; Tours
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A7412] block mt-1">
              Hajj · Umrah · Aviation
            </span>
          </div>
        </button>

        {/* Zone 2: Primary Text Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium text-slate-600" aria-label="Primary">
          {NAV_LINKS.map((item) => {
            const active = route === item.to;
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => handleNav(item.to)}
                className={`relative px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-[#0A224E] font-semibold bg-[#0A224E]/[0.05]'
                    : 'hover:text-[#0A224E] hover:bg-slate-100/70'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5B800]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
                className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs border border-[#D4AF37]/30"
              >
                <span className="w-6 h-6 rounded-lg bg-[#D4AF37] text-[#05122B] font-bold text-[11px] flex items-center justify-center">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : (
                    userInitials
                  )}
                </span>
                <span>{currentUser.role === 'admin' ? 'Admin Console' : 'Pilgrim Portal'}</span>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#F5B800]/80" />
              </button>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="p-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs border border-[#D4AF37]/25"
            >
              <User className="w-4 h-4 text-[#F5B800]" />
              <span>Login / Dashboard</span>
            </button>
          )}

          {/* Mobile Currency & Menu Toggle */}
          <button
            type="button"
            onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
            className="lg:hidden px-2.5 py-1.5 text-xs font-mono font-semibold border border-slate-200 bg-white rounded-lg text-[#0A224E] shadow-2xs"
            aria-label="Toggle currency"
          >
            {currency === 'NGN' ? '₦ NGN' : '$ USD'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden p-2 text-[#0A224E] hover:bg-slate-100 rounded-xl transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => handleNav(item.to)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  route === item.to
                    ? 'bg-[#0A224E] text-white font-semibold'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNav(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
                  className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-[#0A224E] rounded-xl"
                >
                  {currentUser.role === 'admin' ? 'Admin Console' : 'Pilgrim Portal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-[#0A224E] rounded-xl"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
