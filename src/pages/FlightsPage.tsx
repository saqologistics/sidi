import React, { useMemo, useState } from 'react';
import { Briefcase, Clock, Filter, Plane, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { filterFlightOffers, formatMoney } from '../utils/travelLogic';
import { AirlineCrest, IslamicGeometricBackdrop } from '../components/BrandVisuals';

export function FlightsPage() {
  const { db, currency, searchState, setSearchState, startCheckout } = useApp();

  const [maxStops, setMaxStops] = useState<number | null>(null);
  const [airlineFilter, setAirlineFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(4500000);

  const airlines = useMemo(
    () => Array.from(new Set(db.flights.map((f) => f.airline))),
    [db.flights]
  );

  const filtered = useMemo(
    () =>
      filterFlightOffers(db.flights, {
        originCode: searchState.originCode,
        destinationCode: searchState.destinationCode,
        maxStops,
        airline: airlineFilter,
        maxPriceNgn: maxPrice,
        cabinClass: searchState.cabinClass,
      }),
    [db.flights, searchState, maxStops, airlineFilter, maxPrice]
  );

  const resetFilters = () => {
    setSearchState((s) => ({
      ...s,
      originCode: 'ALL',
      destinationCode: 'ALL',
      cabinClass: 'All',
    }));
    setMaxStops(null);
    setAirlineFilter('All');
    setMaxPrice(4500000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
              Global Flight Inventory · Kano, Abuja &amp; Lagos Departures
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
              Flight Search &amp; Booking
            </h1>
          </div>
          <p className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-[#F5B800] font-mono tabular-nums self-start md:self-auto">
            Showing {filtered.length} available flight option(s)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Inline Quick Route Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-xs">
          <div>
            <label htmlFor="flts-origin" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Origin
            </label>
            <select
              id="flts-origin"
              value={searchState.originCode}
              onChange={(e) => setSearchState((s) => ({ ...s, originCode: e.target.value }))}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
            >
              <option value="ALL">All Origins</option>
              <option value="KAN">KAN - Kano</option>
              <option value="LOS">LOS - Lagos</option>
              <option value="ABV">ABV - Abuja</option>
            </select>
          </div>
          <div>
            <label htmlFor="flts-dest" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Destination
            </label>
            <select
              id="flts-dest"
              value={searchState.destinationCode}
              onChange={(e) => setSearchState((s) => ({ ...s, destinationCode: e.target.value }))}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
            >
              <option value="ALL">All Destinations</option>
              <option value="JED">JED - Jeddah</option>
              <option value="MED">MED - Madinah</option>
              <option value="DXB">DXB - Dubai</option>
              <option value="LHR">LHR - London</option>
            </select>
          </div>
          <div>
            <label htmlFor="flts-dep" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Departure Date
            </label>
            <input
              id="flts-dep"
              type="date"
              value={searchState.departureDate}
              onChange={(e) => setSearchState((s) => ({ ...s, departureDate: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
            />
          </div>
          <div>
            <label htmlFor="flts-cabin" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Cabin Class
            </label>
            <select
              id="flts-cabin"
              value={searchState.cabinClass}
              onChange={(e) =>
                setSearchState((s) => ({
                  ...s,
                  cabinClass: e.target.value as typeof searchState.cabinClass,
                }))
              }
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
            >
              <option value="All">All Cabins</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Panel */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-5 shadow-xs lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#0A224E] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                <span>Refine Flights</span>
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Stops
              </p>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Any Number of Stops', val: null },
                  { label: 'Direct Flights Only', val: 0 },
                  { label: 'Up to 1 Stop', val: 1 },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="stops"
                      checked={maxStops === opt.val}
                      onChange={() => setMaxStops(opt.val)}
                      className="accent-[#0A224E]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="flt-airline" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Airline
              </label>
              <select
                id="flt-airline"
                value={airlineFilter}
                onChange={(e) => setAirlineFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-[#FAF9F6]"
              >
                <option value="All">All Airlines</option>
                {airlines.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="flt-max-price" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Max Fare
                </label>
                <span className="font-mono font-bold text-[#0A224E] tabular-nums">
                  {formatMoney(maxPrice, currency)}
                </span>
              </div>
              <input
                id="flt-max-price"
                type="range"
                min={1000000}
                max={4500000}
                step={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0A224E]"
              />
            </div>
          </aside>

          {/* Flight Results */}
          <div className="lg:col-span-9 space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <p className="text-base font-bold text-[#0A224E]">
                  No flights matched this exact route filter
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Reset filters to view all Kano, Lagos, and Abuja departures.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                >
                  Show All Flights
                </button>
              </div>
            ) : (
              filtered.map((flt) => (
                <div
                  key={flt.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 sidi-card-hover"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <AirlineCrest code={flt.airlineCode} airline={flt.airline} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-[#0A224E]">{flt.airline}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{flt.flightNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {flt.cabinClass}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3 sm:gap-5">
                        <div>
                          <p className="font-mono text-lg sm:text-xl font-bold text-[#0A224E] tabular-nums">
                            {flt.departureTime}
                          </p>
                          <p className="text-xs font-medium text-slate-600">
                            {flt.originCity} ({flt.originCode})
                          </p>
                        </div>

                        <div className="flex flex-col items-center flex-1 max-w-[180px] px-1">
                          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {flt.duration}
                          </span>
                          <div className="w-full h-px bg-slate-300 my-1.5 relative">
                            <Plane className="w-3.5 h-3.5 text-[#D4AF37] absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white" />
                          </div>
                          <span
                            className={`text-[11px] font-semibold text-center ${
                              flt.stops === 0 ? 'text-emerald-700' : 'text-slate-600'
                            }`}
                          >
                            {flt.stops === 0 ? 'Direct Non-Stop' : `1 Stop (${flt.stopCity})`}
                          </span>
                        </div>

                        <div className="text-right sm:text-left">
                          <p className="font-mono text-lg sm:text-xl font-bold text-[#0A224E] tabular-nums">
                            {flt.arrivalTime}
                          </p>
                          <p className="text-xs font-medium text-slate-600">
                            {flt.destinationCity} ({flt.destinationCode})
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#C89D28]" />
                          Baggage: {flt.baggage}
                        </span>
                        <span
                          className={`font-mono font-semibold tabular-nums ${
                            flt.seatsAvailable <= 10 ? 'text-amber-700' : 'text-slate-600'
                          }`}
                        >
                          {flt.seatsAvailable} seats left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-500 block">Total Return Fare</span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#0A224E] tabular-nums">
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
                          returnDate:
                            searchState.tripType === 'One-Way'
                              ? undefined
                              : searchState.returnDate || '2027-03-06',
                          routeOrLocation: `${flt.originCode} → ${flt.destinationCode}${
                            flt.stops === 0 ? ' (Direct)' : ` (via ${flt.stopCity})`
                          }`,
                          unitPriceNgn: flt.priceNgn,
                          passengersCount: 1,
                        })
                      }
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors whitespace-nowrap shadow-xs"
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
