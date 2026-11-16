import React from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { BRAND_CONTACT } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { IslamicGeometricBackdrop, SidiLogoEmblem } from './BrandVisuals';

export function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="relative bg-[#05122B] text-slate-300 border-t-2 border-[#D4AF37]/40 overflow-hidden no-print">
      <IslamicGeometricBackdrop className="opacity-35" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SidiLogoEmblem className="w-11 h-11 shrink-0" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {BRAND_CONTACT.companyName}
              </h3>
              <p className="text-xs font-medium text-[#F5B800]">{BRAND_CONTACT.taglinePrimary}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {BRAND_CONTACT.taglineSecondary}. Dedicated pilgrim care, direct Saudi Airlines flights
            from Kano, verified Haram-proximity hotels, and express global visa assistance.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
            <span>400+ Umrah Visas Issued · Sept–Nov 2026</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5B800] mb-4">
            Travel Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Ramadan 2027 Umrah Packages', to: '/umrah-packages' as const },
              { label: 'International Flight Search', to: '/flights' as const },
              { label: 'Makkah & Madinah Hotels', to: '/hotels' as const },
              { label: 'Visa Assistance Portal', to: '/visa-services' as const },
              { label: 'Photo & Video Gallery', to: '/gallery' as const },
            ].map((item) => (
              <li key={item.to}>
                <button
                  type="button"
                  onClick={() => navigate(item.to)}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#F5B800] transition-colors text-left"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Kano Head Office */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5B800] mb-4">
            Kano Head Office
          </h4>
          <p className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
            <span>{BRAND_CONTACT.address}</span>
          </p>
          <p className="flex items-center gap-2.5 text-sm">
            <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <a
              href={`mailto:${BRAND_CONTACT.email}`}
              className="hover:text-[#F5B800] transition-colors break-all"
            >
              {BRAND_CONTACT.email}
            </a>
          </p>
          <div className="pt-2 space-y-1 text-xs text-slate-400">
            <p>
              Instagram:{' '}
              <a
                href="https://www.instagram.com/Sidi_travelandtours/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 hover:text-[#F5B800]"
              >
                {BRAND_CONTACT.instagram}
              </a>
            </p>
            <p>
              TikTok:{' '}
              <a
                href="https://www.tiktok.com/@sidi.travel.and.t"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 hover:text-[#F5B800]"
              >
                {BRAND_CONTACT.tiktok}
              </a>
            </p>
          </div>
        </div>

        {/* Column 4: Official Phone Lines */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5B800] mb-4">
            24/7 Booking Desk
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm font-mono tabular-nums">
            {BRAND_CONTACT.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-slate-200 hover:text-[#F5B800] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{phone}</span>
              </a>
            ))}
          </div>
          <div className="pt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] hover:brightness-105 rounded-xl transition-all"
            >
              Contact Kano Desk
            </button>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="px-4 py-2 text-xs font-medium border border-white/20 text-white hover:border-[#D4AF37] rounded-xl transition-colors"
            >
              About Us
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#040E22]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {BRAND_CONTACT.companyName} All rights reserved.</p>
          <p>Kano, Nigeria · Direct Haramain &amp; Global Aviation Services</p>
        </div>
      </div>
    </footer>
  );
}
