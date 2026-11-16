import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Clock,
  Compass,
  FileCheck2,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { BRAND_IMAGES, RAMADAN_2027_SCHEDULES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import {
  clampDepositMin,
  formatDisplayDate,
  formatMoney,
  getSeatsRemaining,
} from '../utils/travelLogic';
import {
  AirlineCrest,
  IslamicGeometricBackdrop,
  SafeImage,
  TierBadge,
} from '../components/BrandVisuals';

type SearchTab = 'flights' | 'umrah' | 'hotels' | 'visa';

export function HomePage() {
  const {
    db,
    currency,
    navigate,
    searchState,
    setSearchState,
    setSelectedPackageId,
    startCheckout,
    notify,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SearchTab>('flights');

  const featuredUmrah = db.packages.filter((p) => p.featured).slice(0, 3);
  const popularFlights = db.flights.slice(0, 3);
  const homeGallery = db.gallery.filter((g) => g.featuredOnHome).slice(0, 4);

  return (
    <div className="bg-[#FAF9F6]">
      {/* Executive Full-Bleed Aviation Hero + Floating 4-Tab Search Engine */}
      <section className="relative bg-[#05122B] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={BRAND_IMAGES.heroAeroplane}
            alt="Commercial passenger jetliner soaring through golden hour clouds"
            className="w-full h-full object-cover object-center scale-[1.02]"
            fallbackTitle="Sidi Travel & Tours Aviation"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#05122B]/95 via-[#0A224E]/80 to-[#05122B]/35"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#05122B] via-transparent to-[#05122B]/40"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl space-y-5 mb-9 sm:mb-11"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 backdrop-blur-sm text-xs font-semibold text-[#F5B800]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sidi Travel &amp; Tours Ltd. · Kano, Nigeria</span>
            </div>

            <h1
              className="font-display font-bold tracking-tight text-white leading-[1.08]"
              style={{ fontSize: 'clamp(2.35rem, 4.4vw, 3.85rem)', textWrap: 'balance' }}
            >
              Your Trusted Travel Partner for{' '}
              <span className="italic text-[#F5B800]">Hajj, Umrah</span> &amp; Global Flights
            </h1>

            <p className="text-base sm:text-[17px] text-slate-200/95 leading-relaxed max-w-xl">
              Your Journey, Our Priority. Reserve Ramadan 2027 Umrah packages from Kano to Jeddah
              and Madinah, direct Saudi Airlines flights, Haram-view hotels, and express visa
              processing with flexible Naira installments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/umrah-packages')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] hover:brightness-105 rounded-xl transition-all whitespace-nowrap shadow-[0_10px_28px_-6px_rgba(245,184,0,0.45)]"
              >
                <span>Explore Ramadan 2027 Umrah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/visa-services')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-white rounded-xl transition-colors whitespace-nowrap backdrop-blur-sm"
              >
                <FileCheck2 className="w-4 h-4 text-[#F5B800]" />
                <span>Visa Assistance</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              {[
                '400+ Umrah Visas Issued',
                'Saudi Airlines Direct from Kano',
                'Pay Small Small Installments',
              ].map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#05122B]/65 border border-white/15 text-slate-200 backdrop-blur-xs"
                >
                  <Check className="w-3.5 h-3.5 text-[#F5B800]" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Elevated Floating 4-Tab Booking Engine */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white text-slate-900 rounded-2xl border border-white/60 shadow-[0_28px_70px_-15px_rgba(5,18,43,0.55)] overflow-hidden"
          >
            <div
              className="grid grid-cols-2 sm:flex sm:flex-wrap border-b border-slate-200/80 bg-[#F4F6FA] p-2 sm:px-4 sm:pt-3 sm:pb-0 gap-1.5 sm:gap-1"
              role="tablist"
              aria-label="Travel booking tabs"
            >
              {[
                { id: 'flights' as const, label: 'Flights', icon: Plane },
                { id: 'umrah' as const, label: 'Hajj & Umrah', icon: Compass },
                { id: 'hotels' as const, label: 'Hotels', icon: Building2 },
                { id: 'visa' as const, label: 'Visa Assistance', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative inline-flex items-center justify-center sm:justify-start gap-2 px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-b-none sm:rounded-t-xl transition-all whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#0A224E] shadow-xs sm:shadow-none border border-[#D4AF37]/50 sm:border-b-0 sm:border-t-2 sm:border-x sm:border-t-[#D4AF37] sm:border-slate-200 sm:-mb-px'
                        : 'text-slate-600 hover:text-[#0A224E] hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#C89D28]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === 'flights' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/flights');
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/70">
                      {(['Round-Trip', 'One-Way', 'Multi-City'] as const).map((type) => (
                        <label
                          key={type}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            searchState.tripType === type
                              ? 'bg-white text-[#0A224E] shadow-2xs'
                              : 'text-slate-600 hover:text-[#0A224E]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tripType"
                            checked={searchState.tripType === type}
                            onChange={() => setSearchState((s) => ({ ...s, tripType: type }))}
                            className="sr-only"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-400 font-medium mr-1">Popular:</span>
                      {[
                        { label: 'KAN → JED', o: 'KAN', d: 'JED' },
                        { label: 'KAN → MED', o: 'KAN', d: 'MED' },
                        { label: 'KAN → DXB', o: 'KAN', d: 'DXB' },
                        { label: 'LOS → LHR', o: 'LOS', d: 'LHR' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setSearchState((s) => ({
                              ...s,
                              originCode: preset.o,
                              destinationCode: preset.d,
                            }))
                          }
                          className="px-2.5 py-1 rounded-md font-mono font-semibold bg-[#FAF9F6] hover:bg-[#FBF6E6] text-[#0A224E] border border-slate-200 hover:border-[#D4AF37] transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div>
                      <label htmlFor="flt-origin" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        From
                      </label>
                      <select
                        id="flt-origin"
                        value={searchState.originCode}
                        onChange={(e) => setSearchState((s) => ({ ...s, originCode: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                      >
                        <option value="KAN">KAN - Kano</option>
                        <option value="LOS">LOS - Lagos</option>
                        <option value="ABV">ABV - Abuja</option>
                        <option value="ALL">All Nigerian Airports</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="flt-dest" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        To
                      </label>
                      <select
                        id="flt-dest"
                        value={searchState.destinationCode}
                        onChange={(e) => setSearchState((s) => ({ ...s, destinationCode: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                      >
                        <option value="ALL">All Destinations</option>
                        <option value="JED">JED - Jeddah</option>
                        <option value="MED">MED - Madinah</option>
                        <option value="DXB">DXB - Dubai</option>
                        <option value="LHR">LHR - London</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="flt-dep" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Departure
                      </label>
                      <input
                        id="flt-dep"
                        type="date"
                        value={searchState.departureDate}
                        onChange={(e) => setSearchState((s) => ({ ...s, departureDate: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                      />
                    </div>
                    <div>
                      <label htmlFor="flt-ret" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Return
                      </label>
                      <input
                        id="flt-ret"
                        type="date"
                        disabled={searchState.tripType === 'One-Way'}
                        value={searchState.returnDate}
                        onChange={(e) => setSearchState((s) => ({ ...s, returnDate: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                      />
                    </div>
                    <div>
                      <label htmlFor="flt-cabin" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Travelers &amp; Cabin
                      </label>
                      <select
                        id="flt-cabin"
                        value={searchState.cabinClass}
                        onChange={(e) =>
                          setSearchState((s) => ({
                            ...s,
                            cabinClass: e.target.value as typeof searchState.cabinClass,
                          }))
                        }
                        className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                      >
                        <option value="All">{searchState.travelers} Traveler · Any Cabin</option>
                        <option value="Economy">Economy Class</option>
                        <option value="Business">Business Class</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors whitespace-nowrap shadow-sm"
                      >
                        Search Flights
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'umrah' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/umrah-packages');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
                >
                  <div>
                    <label htmlFor="umr-season" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Season
                    </label>
                    <select
                      id="umr-season"
                      value={searchState.umrahSeason}
                      onChange={(e) => setSearchState((s) => ({ ...s, umrahSeason: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="All">All Seasons</option>
                      <option value="Ramadan 2027">Ramadan 2027</option>
                      <option value="Regular Umrah">Regular Umrah</option>
                      <option value="Hajj">Hajj 2027</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="umr-tier" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Package Tier
                    </label>
                    <select
                      id="umr-tier"
                      value={searchState.umrahTier}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          umrahTier: e.target.value as typeof searchState.umrahTier,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="All">All Tiers (Economy / Luxury / Premium)</option>
                      <option value="Economy">Economy — ₦4,700,000</option>
                      <option value="Luxury">Luxury — ₦6,000,000</option>
                      <option value="Premium">Premium — ₦11,000,000</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="umr-batch" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Departure Batch
                    </label>
                    <select
                      id="umr-batch"
                      value={searchState.umrahBatchLabel}
                      onChange={(e) => setSearchState((s) => ({ ...s, umrahBatchLabel: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="All">All 5 Batches (Feb – Mar 2027)</option>
                      {RAMADAN_2027_SCHEDULES.map((b) => (
                        <option key={b.id} value={b.label}>
                          {b.label}: {formatDisplayDate(b.departureDate)} ({b.departureRoute})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors whitespace-nowrap shadow-sm"
                    >
                      View Umrah Packages
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'hotels' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      searchState.hotelCheckIn &&
                      searchState.hotelCheckOut &&
                      searchState.hotelCheckOut <= searchState.hotelCheckIn
                    ) {
                      notify('Check-out date must be after check-in date.', 'error');
                      return;
                    }
                    navigate('/hotels');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
                >
                  <div>
                    <label htmlFor="htl-city" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Destination City
                    </label>
                    <select
                      id="htl-city"
                      value={searchState.hotelCity}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          hotelCity: e.target.value as typeof searchState.hotelCity,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="All">All Partner Cities</option>
                      <option value="Makkah">Makkah</option>
                      <option value="Madinah">Madinah</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Lagos">Lagos</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="htl-in" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Check-in
                    </label>
                    <input
                      id="htl-in"
                      type="date"
                      value={searchState.hotelCheckIn}
                      onChange={(e) =>
                        setSearchState((s) => ({ ...s, hotelCheckIn: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="htl-out" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Check-out
                    </label>
                    <input
                      id="htl-out"
                      type="date"
                      value={searchState.hotelCheckOut}
                      onChange={(e) =>
                        setSearchState((s) => ({ ...s, hotelCheckOut: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="htl-stars" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Star Rating
                    </label>
                    <select
                      id="htl-stars"
                      value={searchState.hotelStars}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          hotelStars: e.target.value as typeof searchState.hotelStars,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="All">All Ratings (3★ / 4★ / 5★)</option>
                      <option value="3">3★ Quality Hotels</option>
                      <option value="4">4★ Luxury Hotels</option>
                      <option value="5">5★ Haram Courtyard</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors whitespace-nowrap shadow-sm"
                    >
                      Search Hotels
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'visa' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/visa-services');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
                >
                  <div>
                    <label htmlFor="vsa-country" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Destination Country
                    </label>
                    <select
                      id="vsa-country"
                      value={searchState.visaCountry}
                      onChange={(e) => {
                        const country = e.target.value;
                        const defaultCat =
                          country === 'UAE (Dubai)'
                            ? 'UAE Dubai Visa'
                            : country === 'United Kingdom'
                              ? 'UK Visa'
                              : country === 'Schengen (Europe)'
                                ? 'Schengen Visa'
                                : 'Umrah Visa';
                        setSearchState((s) => ({
                          ...s,
                          visaCountry: country,
                          visaCategory: defaultCat,
                        }));
                      }}
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="UAE (Dubai)">UAE (Dubai)</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Schengen (Europe)">Schengen (Europe)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vsa-cat" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Visa Category
                    </label>
                    <select
                      id="vsa-cat"
                      value={searchState.visaCategory}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          visaCategory: e.target.value as typeof searchState.visaCategory,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="Umrah Visa">Umrah Visa</option>
                      <option value="Saudi Tourist Visa">Saudi Tourist / Stopover Visa</option>
                      <option value="UAE Dubai Visa">UAE Dubai Visa</option>
                      <option value="UK Visa">UK Standard Visitor</option>
                      <option value="Schengen Visa">Schengen Visitor Visa</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vsa-speed" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Processing Speed
                    </label>
                    <select
                      id="vsa-speed"
                      value={searchState.visaSpeed}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          visaSpeed: e.target.value as typeof searchState.visaSpeed,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm font-medium border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    >
                      <option value="Standard (5-7 Days)">Standard (5–7 Days)</option>
                      <option value="Express (48-72 Hours)">Express (48–72 Hours)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-bold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors whitespace-nowrap shadow-sm"
                    >
                      Start Visa Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Featured Ramadan 2027 Umrah Packages */}
      <section className="py-18 bg-[#FAF9F6] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                Ramadan 2027 Collection · Makkah &amp; Madinah
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A224E] mt-1.5">
                Featured Umrah Packages
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/umrah-packages')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0A224E] bg-white border border-slate-200 hover:border-[#D4AF37] rounded-xl transition-colors whitespace-nowrap self-start md:self-auto shadow-2xs"
            >
              <span>View all packages &amp; 5 schedules</span>
              <ArrowRight className="w-4 h-4 text-[#C89D28]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredUmrah.map((pkg) => {
              const isLuxury = pkg.tier === 'Luxury';
              const isPremium = pkg.tier === 'Premium';
              const minDep = clampDepositMin(pkg.priceNgn, 500000);
              return (
                <article
                  key={pkg.id}
                  className={`bg-white rounded-2xl overflow-hidden flex flex-col sidi-card-hover ${
                    isLuxury
                      ? 'border-2 border-[#D4AF37] shadow-[0_14px_40px_-14px_rgba(212,175,55,0.28)]'
                      : isPremium
                        ? 'border border-[#0A224E]/30 shadow-[0_14px_40px_-14px_rgba(10,34,78,0.18)]'
                        : 'border border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative group">
                    <SafeImage
                      src={pkg.coverImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackTitle={pkg.title}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#05122B]/80 via-transparent to-black/15"
                      aria-hidden="true"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <TierBadge tier={pkg.tier} />
                    </div>
                    <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between gap-2 text-white">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#05122B]/75 backdrop-blur-xs border border-white/15">
                        {pkg.hotelRating}
                      </span>
                      <span className="text-[11px] font-medium text-[#F5B800] truncate">
                        {pkg.distanceToHaram}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="min-h-[4rem]">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {pkg.season}
                      </p>
                      <h3 className="font-display text-lg lg:text-[1.15rem] font-bold text-[#0A224E] leading-snug mt-0.5">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{pkg.subtitle}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-medium text-slate-500 block">Per Pilgrim</span>
                        <span className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">
                          {formatMoney(pkg.priceNgn, currency)}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold whitespace-nowrap shrink-0">
                        From {formatMoney(minDep, currency)} deposit
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-[#FAF9F6] border border-slate-200/70 space-y-1 text-[11px] text-slate-600">
                      <p className="truncate">
                        <strong className="text-[#0A224E]">Makkah:</strong> {pkg.makkahHotel}
                      </p>
                      <p className="truncate">
                        <strong className="text-[#0A224E]">Madinah:</strong> {pkg.madinahHotel}
                      </p>
                    </div>

                    <ul className="mt-4 space-y-2 flex-1">
                      {pkg.inclusions.slice(0, 4).map((inc) => (
                        <li key={inc} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`w-full py-3 px-4 text-xs font-bold rounded-xl transition-all ${
                          isLuxury || isPremium
                            ? 'bg-gradient-to-r from-[#0A224E] to-[#102F6A] hover:brightness-110 text-white shadow-sm'
                            : 'bg-[#0A224E] hover:bg-[#102F6A] text-white'
                        }`}
                      >
                        Select Schedule &amp; Book
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Interactive 5 Flight Schedule Board */}
          <div className="mt-10 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#0A224E] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C89D28]" />
                  <span>Ramadan 2027 Flight Schedule (Kano Departures)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any departure batch to view matching packages and lock your seat early.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FBF6E6] border border-[#D4AF37]/40 text-xs font-semibold text-[#8E6B10]">
                Limited Seats · Pay Small Small Eligible
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {RAMADAN_2027_SCHEDULES.map((s) => {
                const seatsLeft = getSeatsRemaining(s);
                const pct = Math.min(100, Math.round((s.seatsBooked / s.seatsTotal) * 100));
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSearchState((prev) => ({ ...prev, umrahBatchLabel: s.label }));
                      navigate('/umrah-packages');
                    }}
                    className="text-left p-4 rounded-xl bg-[#FAF9F6] hover:bg-white border border-slate-200 hover:border-[#D4AF37] transition-all group shadow-2xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0A224E] group-hover:text-[#9A7412]">
                        {s.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px] font-mono font-semibold">
                        {seatsLeft} left
                      </span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-slate-800">
                      {formatDisplayDate(s.departureDate)}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-2">{s.departureRoute}</p>
                    <p className="text-[11px] font-mono text-slate-600">
                      Ret: {formatDisplayDate(s.returnDate)}
                    </p>
                    <p className="text-[11px] text-slate-500">{s.returnRoute}</p>
                    <div className="mt-3 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 400+ Umrah Visas Milestone & Haramain Trust Pillars */}
      <section className="relative py-18 bg-[#05122B] text-white overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-45" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-xs font-semibold text-[#F5B800]">
              Verified Operational Track Record
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.15] text-white">
              Alhamdulillah! <span className="text-[#F5B800]">400+ Umrah Visas</span> Successfully Issued
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              From{' '}
              <span className="text-white font-semibold">1st September to 1st November 2026</span>,
              our Kano desk processed and issued over 400 Umrah visas with complete Saudi Airlines
              ticketing, Makkah &amp; Madinah hotel stays, ground transport, and guided Ziyarat.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              {[
                { title: 'Trusted Service', desc: 'Your satisfaction is our priority', icon: ShieldCheck },
                { title: 'Experienced Team', desc: 'Dedicated bilingual escorts', icon: Users },
                { title: 'Best Price Guarantee', desc: 'Flexible Naira installments', icon: Award },
                { title: 'Comfortable Journey', desc: 'Direct flights & prime hotels', icon: HeartHandshake },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/12 transition-colors backdrop-blur-xs"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-[#F5B800]" />
                    </span>
                    <h3 className="text-xs font-bold text-white">{pillar.title}</h3>
                    <p className="text-[11px] text-slate-300/90 mt-1 leading-snug">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/40 relative aspect-[4/3] bg-[#0A224E] shadow-2xl">
              <SafeImage
                src={BRAND_IMAGES.makkahHaram}
                alt="Masjid al-Haram and Holy Kaaba in Makkah"
                className="w-full h-full object-cover"
                fallbackTitle="Masjid al-Haram, Makkah"
              />
              <div className="absolute inset-x-3 bottom-3 p-4 rounded-xl bg-[#05122B]/88 backdrop-blur-md border border-[#D4AF37]/35">
                <p className="text-[11px] font-mono font-semibold text-[#F5B800]">
                  Sept – Nov 2026 Milestone
                </p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Kano → Jeddah &amp; Madinah · Direct Haramain Operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Popular Flight Deals & Haramain Media Showcase */}
      <section className="py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-18">
          {/* Popular Flight Deals */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                  Live Kano &amp; International Fares
                </p>
                <h2 className="font-display text-3xl font-bold text-[#0A224E] mt-1">
                  Popular Flight Deals
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/flights')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A224E] hover:text-[#9A7412] transition-colors"
              >
                <span>Search all flights</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularFlights.map((flt) => (
                <div
                  key={flt.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-[#FAF9F6] flex flex-col justify-between gap-5 sidi-card-hover"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <AirlineCrest code={flt.airlineCode} airline={flt.airline} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#0A224E] truncate">{flt.airline}</p>
                          <p className="text-xs font-mono text-slate-500">
                            {flt.flightNumber} · {flt.cabinClass}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                          flt.stops === 0
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {flt.stops === 0 ? 'Direct' : `${flt.stops} Stop`}
                      </span>
                    </div>

                    {/* Flight Route Strip */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-base font-bold text-[#0A224E]">{flt.departureTime}</p>
                        <p className="text-xs font-semibold text-slate-600">
                          {flt.originCity} ({flt.originCode})
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {flt.duration}
                        </span>
                        <div className="w-full h-px bg-slate-200 my-1.5 relative">
                          <Plane className="w-3 h-3 text-[#C89D28] absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white" />
                        </div>
                        <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                          {flt.stops === 0 ? 'Non-stop' : flt.stopCity}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-base font-bold text-[#0A224E]">{flt.arrivalTime}</p>
                        <p className="text-xs font-semibold text-slate-600">
                          {flt.destinationCity} ({flt.destinationCode})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-[#C89D28]" />
                        {flt.baggage}
                      </span>
                      <span className="font-mono text-amber-700 font-semibold">
                        {flt.seatsAvailable} seats left
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-slate-200/80">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Round-trip fare</span>
                      <span className="font-mono text-xl font-bold text-[#0A224E] tabular-nums">
                        {formatMoney(flt.priceNgn, currency)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        startCheckout({
                          bookingType: 'Flight',
                          itemId: flt.id,
                          itemTitle: `${flt.airline} ${flt.flightNumber} · ${flt.originCity} → ${flt.destinationCity}`,
                          tierOrCabin: flt.cabinClass,
                          departureDate: searchState.departureDate || '2027-02-08',
                          returnDate: searchState.returnDate || '2027-03-06',
                          routeOrLocation: `${flt.originCode} → ${flt.destinationCode}`,
                          unitPriceNgn: flt.priceNgn,
                          passengersCount: 1,
                        })
                      }
                      className="px-4 py-2.5 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-xs"
                    >
                      Book Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Gallery Preview */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                  Makkah, Madinah, Aviation &amp; Suites
                </p>
                <h2 className="font-display text-3xl font-bold text-[#0A224E] mt-1">
                  Photo &amp; Video Gallery
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/gallery')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A224E] hover:text-[#9A7412] transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-[#C89D28]" />
                <span>Open full gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {homeGallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="text-left group rounded-2xl border border-slate-200/90 overflow-hidden bg-white sidi-card-hover"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    <SafeImage
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackTitle={item.title}
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#05122B]/75 text-white backdrop-blur-xs text-[10px] font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C89D28] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <h3 className="text-sm font-bold text-[#0A224E] mt-1 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Leadership & About Us Spotlight */}
      <section className="py-16 bg-[#FAF9F6] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-[#D4AF37]/35 bg-gradient-to-br from-white via-[#FAF9F6] to-[#FBF6E6] p-6 sm:p-9 lg:p-11 shadow-[0_18px_50px_-20px_rgba(6,21,51,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-10 items-center">
              <div className="md:col-span-4 lg:col-span-3">
                <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[270px] md:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-[#05122B] shadow-xl">
                  <SafeImage
                    src={BRAND_IMAGES.ceoPortrait}
                    alt="Alh Ja’afar Nasir Sidi — Chief Executive Officer"
                    className="w-full h-full object-cover object-top"
                    fallbackTitle="Alh Ja’afar Nasir Sidi"
                  />
                  <div className="absolute inset-x-2.5 bottom-2.5 p-3.5 rounded-xl bg-[#05122B]/90 backdrop-blur-md border border-[#D4AF37]/40 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5B800]">
                      Founder &amp; CEO
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-white leading-snug mt-0.5">
                      Alh Ja’afar Nasir Sidi
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-4 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7412]">
                  About Sidi Travel &amp; Tours Ltd. · Executive Leadership
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A224E] leading-tight">
                  Dedicated Leadership from Kano to Makkah &amp; Madinah
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Led by <strong className="font-bold text-[#0A224E]">Alh Ja’afar Nasir Sidi</strong>,
                  Sidi Travel &amp; Tours Ltd. combines transparent Naira installment plans, verified
                  Haram-proximity hotels, and direct Saudi Airlines flights from Kano with personal
                  on-ground escort care for every pilgrim and traveler.
                </p>
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-xs"
                  >
                    <span>Read Leadership &amp; Notices</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5B800]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold border border-slate-300 bg-white hover:border-[#0A224E] text-[#0A224E] rounded-xl transition-colors"
                  >
                    <span>Visit Kano Office</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
