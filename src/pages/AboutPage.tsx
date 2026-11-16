import React from 'react';
import { Award, Calendar, MapPin, Phone, ShieldCheck, Users } from 'lucide-react';
import { BRAND_CONTACT, BRAND_IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { IslamicGeometricBackdrop, SafeImage } from '../components/BrandVisuals';

export function AboutPage() {
  const { db, navigate } = useApp();

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Page Banner */}
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
            About {BRAND_CONTACT.companyName}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
            Your Trusted Travel Partner for Hajj, Umrah &amp; Global Aviation
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Story Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-base text-slate-600 leading-relaxed">
              Headquartered at Shopping Complex Plaza, Opposite Ado Bayero Mall on Zoo Road in Kano
              State, Sidi Travel &amp; Tours Ltd. combines deep pilgrimage hospitality with modern
              online booking convenience. From economy group departures to 5-star Haram Courtyard VIP
              stays, every pilgrim receives personal care from Kano to Makkah and Madinah.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <Award className="w-5 h-5 text-[#C89D28] mb-2.5" />
                <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">400+</p>
                <p className="text-xs text-slate-600 mt-0.5">Umrah Visas Issued (Sept–Nov 2026)</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <Users className="w-5 h-5 text-[#C89D28] mb-2.5" />
                <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">5 Batches</p>
                <p className="text-xs text-slate-600 mt-0.5">Ramadan 2027 Direct Kano Schedules</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#C89D28] mb-2.5" />
                <p className="font-mono text-2xl font-bold text-[#0A224E]">100%</p>
                <p className="text-xs text-slate-600 mt-0.5">Guided Ziyarat &amp; Escort Support</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] shadow-lg">
            <SafeImage
              src={BRAND_IMAGES.madinahNabawi}
              alt="Masjid an-Nabawi in Madinah"
              className="w-full h-full object-cover"
              fallbackTitle={BRAND_CONTACT.companyName}
            />
          </div>
        </section>

        {/* Executive Leadership: Founder & CEO Spotlight */}
        <section
          aria-labelledby="ceo-leadership-heading"
          className="relative rounded-3xl border border-[#D4AF37]/35 bg-gradient-to-br from-white via-[#FAF9F6] to-[#FBF6E6] p-6 sm:p-8 lg:p-11 overflow-hidden shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/45 bg-[#05122B] shadow-xl">
                <SafeImage
                  src={BRAND_IMAGES.ceoPortrait}
                  alt="Alh Ja’afar Nasir Sidi — Chief Executive Officer, Sidi Travel & Tours Ltd."
                  className="w-full h-full object-cover object-top"
                  fallbackTitle="Alh Ja’afar Nasir Sidi"
                />
                <div className="absolute inset-x-3 bottom-3 p-4 rounded-xl bg-[#05122B]/90 backdrop-blur-md border border-[#D4AF37]/40 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5B800]">
                    Founder &amp; Chief Executive Officer
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Alh Ja’afar Nasir Sidi
                  </h2>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                Executive Leadership · Kano to the Haramain
              </p>
              <h2
                id="ceo-leadership-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] leading-tight"
              >
                Meet Alh Ja’afar Nasir Sidi
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                As Chief Executive Officer of Sidi Travel &amp; Tours Ltd.,{' '}
                <strong className="font-bold text-[#0A224E]">Alh Ja’afar Nasir Sidi</strong>{' '}
                leads our operations from Kano State with a singular commitment: delivering honest,
                dignified, and stress-free pilgrimage and international travel for every Nigerian
                family.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Under his hands-on leadership, our team personally oversees Saudi Airlines seat
                allocations, close-proximity hotels in Makkah and Madinah, transparent Naira
                installment plans, and timely visa issuance—backed by our recent milestone of 400+
                Umrah visas issued between September and November 2026.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="text-xs font-bold text-[#0A224E]">Pilgrim-First Accountability</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct Kano Head Office support and on-ground Haramain escort supervision.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="text-xs font-bold text-[#0A224E]">Transparent Pricing</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Clear Economy, Luxury, and Premium VIP tiers with flexible installment locking.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/umrah-packages')}
                  className="px-5 py-2.5 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors"
                >
                  Explore Ramadan 2027 Packages
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="px-5 py-2.5 text-xs font-bold border border-slate-300 bg-white hover:border-[#0A224E] text-[#0A224E] rounded-xl transition-colors"
                >
                  Contact Kano Head Office
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Escort & Leadership Structure */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                Pilgrim Welfare &amp; Field Operations
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] mt-1">
                Dedicated Escort &amp; Guidance Team
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/umrah-packages')}
              className="px-4 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
            >
              Book with Our Team
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {db.escorts.map((esc) => {
              const initials = esc.name
                .split(' ')
                .slice(0, 2)
                .map((s) => s[0])
                .join('')
                .toUpperCase();
              return (
                <div
                  key={esc.id}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs sidi-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A224E] to-[#05122B] text-[#F5B800] font-bold text-sm flex items-center justify-center shrink-0">
                      {initials}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0A224E]">{esc.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{esc.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${esc.phone}`}
                      className="flex items-center gap-1.5 font-mono font-semibold text-[#0A224E] hover:text-[#9A7412]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C89D28]" />
                      <span>{esc.phone}</span>
                    </a>
                    <p>Languages: {esc.languages}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {esc.assignedBatches.map((batch) => (
                        <span
                          key={batch}
                          className="px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-slate-200 text-[10px] font-semibold text-[#0A224E]"
                        >
                          {batch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Official Notice Board */}
        <section className="relative bg-[#05122B] text-white rounded-3xl p-6 sm:p-9 space-y-6 overflow-hidden border border-[#D4AF37]/30">
          <IslamicGeometricBackdrop className="opacity-35" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
                Management Bulletins
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                Official Notices &amp; Briefings
              </h2>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {db.notices.map((notice) => (
              <div
                key={notice.id}
                className="p-6 rounded-2xl bg-white/[0.06] border border-[#D4AF37]/30 space-y-3 backdrop-blur-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#05122B] font-bold">
                    {notice.audience}
                  </span>
                  <span className="font-mono text-[#F5B800]">{notice.dateLabel}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">{notice.title}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{notice.message}</p>
                <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F5B800]" />
                    <span>Time: {notice.timeLabel}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F5B800] shrink-0 mt-0.5" />
                    <span>{notice.venue}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
