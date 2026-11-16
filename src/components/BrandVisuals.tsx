import React, { useState } from 'react';
import { Building2, Compass, Crown, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import type { BookingStatus, PackageTier, VisaStage } from '../types/travel';

export function SidiLogoEmblem({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sidiNavyGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#102F6A" />
          <stop offset="100%" stopColor="#05122B" />
        </linearGradient>
        <linearGradient id="sidiGoldGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5B800" />
          <stop offset="100%" stopColor="#C89D28" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="url(#sidiNavyGrad)" stroke="url(#sidiGoldGrad)" strokeWidth="2.8" />
      <circle cx="32" cy="32" r="21" stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="1.1" strokeDasharray="3 3" />
      <ellipse cx="32" cy="32" rx="10" ry="21" stroke="#F5B800" strokeOpacity="0.85" strokeWidth="1.35" />
      <line x1="11" y1="32" x2="53" y2="32" stroke="#F5B800" strokeOpacity="0.85" strokeWidth="1.35" />
      <path
        d="M16 44C24 24 38 14 52 12"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      <path d="M45 9L54 11L49 18L47 14L45 9Z" fill="#F5B800" />
    </svg>
  );
}

export function IslamicGeometricBackdrop({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="haramain-lattice"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 4L40 24L60 32L40 40L32 60L24 40L4 32L24 24Z"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.7"
            strokeOpacity="0.16"
          />
          <circle
            cx="32"
            cy="32"
            r="10"
            fill="none"
            stroke="#F5B800"
            strokeWidth="0.6"
            strokeOpacity="0.12"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#haramain-lattice)" />
    </svg>
  );
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0A224E] to-[#05122B] text-white p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-8 h-8 text-[#D4AF37] mb-2" />
        <p className="text-sm font-medium text-white/90">{fallbackTitle || alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

export function TierBadge({ tier }: { tier: PackageTier }) {
  if (tier === 'Premium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-gradient-to-r from-[#0A224E] to-[#102F6A] text-[#F5B800] border border-[#D4AF37]/60 shadow-xs">
        <Crown className="w-3 h-3" />
        <span>Premium VIP</span>
      </span>
    );
  }
  if (tier === 'Luxury') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#FBF6E6] text-[#8E6B10] border border-[#D4AF37]/55">
        <Sparkles className="w-3 h-3 text-[#C89D28]" />
        <span>Luxury · Most Popular</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
      <ShieldCheck className="w-3 h-3 text-[#0A224E]" />
      <span>Economy</span>
    </span>
  );
}

export function StatusPill({ status }: { status: BookingStatus | VisaStage }) {
  const styles: Record<string, string> = {
    Confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Visa Approved & Issued': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Part-Paid': 'bg-amber-50 text-amber-800 border-amber-200',
    'Processing at Embassy': 'bg-blue-50 text-blue-800 border-blue-200',
    'Pending Review': 'bg-amber-50 text-amber-800 border-amber-200',
    'Pending Transfer': 'bg-slate-100 text-slate-700 border-slate-200',
    'Re-upload Requested': 'bg-rose-50 text-rose-800 border-rose-200',
    Cancelled: 'bg-rose-50 text-rose-800 border-rose-200',
  };
  const dotColors: Record<string, string> = {
    Confirmed: 'bg-emerald-500',
    'Visa Approved & Issued': 'bg-emerald-500',
    'Part-Paid': 'bg-amber-500',
    'Processing at Embassy': 'bg-blue-500',
    'Pending Review': 'bg-amber-500',
    'Pending Transfer': 'bg-slate-400',
    'Re-upload Requested': 'bg-rose-500',
    Cancelled: 'bg-rose-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || 'bg-slate-400'}`} />
      <span>{status}</span>
    </span>
  );
}

export function HotelLandmarkBadge({ city }: { city: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
      <Building2 className="w-3.5 h-3.5 text-[#0A224E]" />
      <span>{city}</span>
    </div>
  );
}

export function AirlineCrest({ code, airline }: { code: string; airline: string }) {
  const palette: Record<string, string> = {
    SV: 'bg-gradient-to-br from-emerald-900 to-emerald-950 text-amber-300 border border-emerald-700/40',
    ET: 'bg-gradient-to-br from-emerald-800 to-teal-950 text-yellow-300 border border-emerald-600/40',
    QR: 'bg-gradient-to-br from-rose-950 to-[#4C0D26] text-amber-200 border border-rose-800/40',
    MS: 'bg-gradient-to-br from-[#0A224E] to-[#05122B] text-[#F5B800] border border-[#D4AF37]/40',
    P4: 'bg-gradient-to-br from-blue-900 to-slate-950 text-white border border-blue-700/40',
  };
  const cls =
    palette[code] ||
    'bg-gradient-to-br from-[#0A224E] to-[#05122B] text-white border border-slate-700';

  return (
    <div
      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono text-xs font-bold shrink-0 shadow-xs ${cls}`}
      title={airline}
    >
      <Plane className="w-3.5 h-3.5 opacity-85 mb-0.5" />
      <span className="leading-none">{code}</span>
    </div>
  );
}
