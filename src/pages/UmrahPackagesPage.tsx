import React, { useMemo, useState } from 'react';
import { Calendar, Check, Filter, MapPin, Plane, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PackageTier } from '../types/travel';
import {
  clampDepositMin,
  filterUmrahPackages,
  formatDisplayDate,
  formatMoney,
  getSeatsRemaining,
} from '../utils/travelLogic';
import { IslamicGeometricBackdrop, SafeImage, TierBadge } from '../components/BrandVisuals';

export function UmrahPackagesPage() {
  const { db, currency, searchState, setSelectedPackageId } = useApp();

  const [tier, setTier] = useState<'All' | PackageTier>(searchState.umrahTier || 'All');
  const [season, setSeason] = useState<string>(searchState.umrahSeason || 'All');
  const [batchLabel, setBatchLabel] = useState<string>(searchState.umrahBatchLabel || 'All');
  const [airport, setAirport] = useState<'All' | 'Jeddah' | 'Madinah'>('All');
  const [month, setMonth] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);

  const filtered = useMemo(
    () =>
      filterUmrahPackages(db.packages, {
        tier,
        season,
        batchLabel,
        departureAirport: airport,
        month,
        maxPriceNgn: maxPrice,
      }),
    [db.packages, tier, season, batchLabel, airport, month, maxPrice]
  );

  const resetFilters = () => {
    setTier('All');
    setSeason('All');
    setBatchLabel('All');
    setAirport('All');
    setMonth('All');
    setMaxPrice(15000000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Compact Navy Page Header */}
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
              Ramadan 2027, Regular Umrah &amp; Hajj Caravans
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
              Hajj &amp; Umrah Packages
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Every package includes Saudi Airlines return flights from Kano, visa processing,
              verified hotels in Makkah and Madinah, guided Ziyarat, and 24/7 escort support.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-[#F5B800] self-start md:self-auto">
            {filtered.length} package(s) available
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-5 shadow-xs lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#0A224E] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                <span>Filter Packages</span>
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-[#0A224E] inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Package Tier
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['All', 'Economy', 'Luxury', 'Premium'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      tier === t
                        ? 'bg-[#0A224E] text-white border-[#0A224E] shadow-2xs'
                        : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="filter-season" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Season / Category
              </label>
              <select
                id="filter-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
              >
                <option value="All">All Seasons &amp; Caravans</option>
                <option value="Ramadan 2027">Ramadan 2027 Umrah</option>
                <option value="Regular Umrah">Regular Umrah</option>
                <option value="Hajj">Hajj 2027</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-airport" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Arrival Airport
              </label>
              <select
                id="filter-airport"
                value={airport}
                onChange={(e) => setAirport(e.target.value as typeof airport)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
              >
                <option value="All">All Routes (Kano → Jeddah / Madinah)</option>
                <option value="Jeddah">Kano → Jeddah</option>
                <option value="Madinah">Kano → Madinah</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-month" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Departure Window
              </label>
              <select
                id="filter-month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
              >
                <option value="All">All Months (Feb – May 2027)</option>
                <option value="2027-02">February 2027 (Ramadan Batches 1–5)</option>
                <option value="2027-04">April 2027 (Regular Umrah)</option>
                <option value="2027-05">May 2027 (Hajj Caravan)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="filter-price" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Max Budget
                </label>
                <span className="font-mono font-bold text-[#0A224E] tabular-nums">
                  {formatMoney(maxPrice, currency)}
                </span>
              </div>
              <input
                id="filter-price"
                type="range"
                min={3500000}
                max={15000000}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0A224E]"
              />
            </div>
          </aside>

          {/* Package Catalog Grid */}
          <div className="lg:col-span-9 space-y-5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <p className="text-base font-bold text-[#0A224E]">No packages match your filters</p>
                <p className="text-sm text-slate-500 mt-1">
                  Try widening your budget slider or clearing the arrival airport filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                >
                  Show All Packages
                </button>
              </div>
            ) : (
              filtered.map((pkg) => {
                const totalRemaining = pkg.schedules.reduce(
                  (sum, s) => sum + getSeatsRemaining(s),
                  0
                );
                const minDep = clampDepositMin(pkg.priceNgn, 500000);
                return (
                  <article
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 sidi-card-hover"
                  >
                    <div className="md:col-span-4 aspect-[4/3] md:aspect-auto md:min-h-[270px] bg-slate-100 relative overflow-hidden">
                      <SafeImage
                        src={pkg.coverImage}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        fallbackTitle={pkg.title}
                      />
                      <div className="absolute top-3 left-3">
                        <TierBadge tier={pkg.tier} />
                      </div>
                      <div className="absolute inset-x-3 bottom-3 px-2.5 py-1 rounded-lg bg-[#05122B]/80 backdrop-blur-xs text-[11px] font-medium text-white">
                        {pkg.hotelRating} · {pkg.distanceToHaram}
                      </div>
                    </div>
                    <div className="md:col-span-8 p-6 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                          <span className="font-semibold text-[#9A7412]">{pkg.category}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 font-mono text-amber-800 font-semibold tabular-nums text-[11px]">
                            {totalRemaining} seats left · {pkg.schedules.length} schedule(s)
                          </span>
                        </div>

                        <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                          {pkg.title}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{pkg.description}</p>

                        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF9F6] border border-slate-200/70">
                            <MapPin className="w-3.5 h-3.5 text-[#C89D28] shrink-0" />
                            <span className="truncate">Makkah: {pkg.makkahHotel}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 p-2 rounded-lg bg-[#FAF9F6] border border-slate-200/70">
                            <Calendar className="w-3.5 h-3.5 text-[#C89D28] shrink-0" />
                            <span className="truncate">Madinah: {pkg.madinahHotel}</span>
                          </span>
                        </div>

                        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {pkg.inclusions.slice(0, 4).map((inc) => (
                            <div key={inc} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                        </div>

                        {pkg.schedules.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {pkg.schedules.slice(0, 3).map((s) => (
                              <span
                                key={s.id}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600"
                              >
                                {s.label}: {formatDisplayDate(s.departureDate)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-slate-500 block">
                            Package Price / Pilgrim · Installments from {formatMoney(minDep, currency)}
                          </span>
                          <span className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">
                            {formatMoney(pkg.priceNgn, currency)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors shadow-xs"
                        >
                          <Plane className="w-3.5 h-3.5 text-[#F5B800]" />
                          <span>View {pkg.schedules.length} Schedules &amp; Book</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
