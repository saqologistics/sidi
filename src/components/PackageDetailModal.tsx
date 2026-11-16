import React, { useEffect, useState } from 'react';
import { Building2, Calendar, Check, MapPin, Minus, Plane, Plus, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  clampDepositMin,
  formatDisplayDate,
  formatMoney,
  getSeatsRemaining,
} from '../utils/travelLogic';
import { SafeImage, TierBadge } from './BrandVisuals';

export function PackageDetailModal() {
  const { db, selectedPackageId, setSelectedPackageId, currency, startCheckout } = useApp();
  const pkg = db.packages.find((p) => p.id === selectedPackageId) || null;

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [travelers, setTravelers] = useState(1);

  useEffect(() => {
    if (pkg && pkg.schedules.length > 0) {
      setSelectedScheduleId(pkg.schedules[0].id);
      setTravelers(1);
    }
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPackageId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pkg, setSelectedPackageId]);

  if (!pkg) return null;

  const activeSchedule =
    pkg.schedules.find((s) => s.id === selectedScheduleId) || pkg.schedules[0];
  const seatsLeft = activeSchedule ? getSeatsRemaining(activeSchedule) : 10;
  const totalCost = pkg.priceNgn * travelers;
  const minDeposit = clampDepositMin(totalCost, 500000);

  const handleBook = (planHint: 'Full' | 'Installment') => {
    if (!activeSchedule) return;
    startCheckout({
      bookingType: 'Umrah Package',
      itemId: pkg.id,
      itemTitle: pkg.title,
      tierOrCabin: `${pkg.tier} (${pkg.hotelRating})`,
      scheduleId: activeSchedule.id,
      scheduleLabel: `${activeSchedule.label} (${formatDisplayDate(activeSchedule.departureDate)} – ${formatDisplayDate(activeSchedule.returnDate)})`,
      departureDate: activeSchedule.departureDate,
      returnDate: activeSchedule.returnDate,
      routeOrLocation: `${activeSchedule.departureRoute} · ${activeSchedule.returnRoute}`,
      unitPriceNgn: pkg.priceNgn,
      passengersCount: travelers,
      hotelSummary: `${pkg.makkahHotel} & ${pkg.madinahHotel}`,
      existingRemainingNgn: planHint === 'Installment' ? 1 : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122B]/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pkg-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedPackageId(null);
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#05122B] via-[#0A224E] to-[#102F6A] text-white shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#F5B800]">{pkg.season}</span>
              <TierBadge tier={pkg.tier} />
            </div>
            <h2 id="pkg-detail-title" className="font-display text-xl sm:text-2xl font-bold">
              {pkg.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPackageId(null)}
            aria-label="Close package details"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-60 md:h-auto relative">
              <SafeImage
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover"
                fallbackTitle={pkg.title}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#05122B]/90 to-transparent text-white">
                <p className="text-[11px] font-semibold text-[#F5B800]">{pkg.hotelRating}</p>
                <p className="text-xs">{pkg.distanceToHaram}</p>
              </div>
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-medium text-slate-500">Per Pilgrim Rate</span>
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-[#0A224E] tabular-nums">
                    {formatMoney(pkg.priceNgn, currency)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  Installments from {formatMoney(minDeposit, currency)}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{pkg.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A224E] mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Makkah Hotel</span>
                  </div>
                  <p className="text-slate-700 leading-snug">{pkg.makkahHotel}</p>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-[#0A224E] mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Madinah Hotel</span>
                  </div>
                  <p className="text-slate-700 leading-snug">{pkg.madinahHotel}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Package Inclusions
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Flight Schedule Selector */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-[#0A224E] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Select Departure Flight Schedule</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 font-semibold tabular-nums">
                {seatsLeft} seats left on selected batch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pkg.schedules.map((sched) => {
                const selected = sched.id === activeSchedule?.id;
                const remaining = getSeatsRemaining(sched);
                const occupancyPct = Math.min(
                  100,
                  Math.round((sched.seatsBooked / Math.max(1, sched.seatsTotal)) * 100)
                );
                const escort = db.escorts.find((e) => e.id === sched.escortId);

                return (
                  <button
                    key={sched.id}
                    type="button"
                    onClick={() => setSelectedScheduleId(sched.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selected
                        ? 'border-[#0A224E] bg-[#0A224E]/[0.04] ring-2 ring-[#0A224E]/20 shadow-sm'
                        : 'border-slate-200 hover:border-[#D4AF37]/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0A224E]">{sched.label}</span>
                      <span className="text-[11px] font-mono font-semibold text-amber-700 tabular-nums">
                        {remaining} left
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-700">
                      <p className="flex items-center gap-1.5">
                        <Plane className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span className="font-mono font-medium">
                          {formatDisplayDate(sched.departureDate)}
                        </span>
                        <span className="text-slate-500 truncate">({sched.departureRoute})</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Plane className="w-3 h-3 text-slate-400 rotate-180 shrink-0" />
                        <span className="font-mono">{formatDisplayDate(sched.returnDate)}</span>
                        <span className="truncate">({sched.returnRoute})</span>
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full"
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                      {escort && (
                        <p className="text-[10px] text-slate-500 truncate">
                          Escort: <span className="font-medium text-slate-700">{escort.name}</span>
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="px-6 py-4 border-t border-slate-200 bg-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0A224E]" />
              <span className="text-xs font-semibold text-slate-700">Pilgrims</span>
              <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  aria-label="Decrease pilgrims"
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                  className="p-1.5 text-slate-600 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 font-mono text-xs font-bold text-[#0A224E]" aria-live="polite">
                  {travelers}
                </span>
                <button
                  type="button"
                  aria-label="Increase pilgrims"
                  onClick={() => setTravelers((t) => Math.min(10, t + 1))}
                  className="p-1.5 text-slate-600 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <span className="block text-[11px] text-slate-500">Total Package Fare</span>
              <span className="font-mono text-lg font-bold text-[#0A224E] tabular-nums">
                {formatMoney(totalCost, currency)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleBook('Installment')}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-[#0A224E] bg-[#FBF6E6] hover:bg-[#F5B800]/30 border border-[#D4AF37] rounded-xl transition-colors whitespace-nowrap"
            >
              Pay in Installments
            </button>
            <button
              type="button"
              onClick={() => handleBook('Full')}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#102F6A] rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              Book Full Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
