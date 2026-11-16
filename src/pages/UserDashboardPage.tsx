import React, { useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  Phone,
  Plane,
  Receipt,
  Upload,
  User,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisaDocumentItem } from '../types/travel';
import {
  formatDisplayDate,
  formatMoney,
  getDaysUntilDeparture,
} from '../utils/travelLogic';
import { IslamicGeometricBackdrop, StatusPill } from '../components/BrandVisuals';

type DashTab = 'overview' | 'bookings' | 'wallet' | 'visas' | 'escort';

export function UserDashboardPage() {
  const {
    db,
    currency,
    currentUser,
    login,
    startCheckout,
    setReceiptBooking,
    updateVisaApplication,
    navigate,
    notify,
  } = useApp();

  const [tab, setTab] = useState<DashTab>('overview');

  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    return db.bookings.filter(
      (b) =>
        b.userId === currentUser.id ||
        b.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
    );
  }, [db.bookings, currentUser]);

  const userVisas = useMemo(() => {
    if (!currentUser) return [];
    return db.visas.filter(
      (v) =>
        v.userId === currentUser.id ||
        v.applicantEmail.toLowerCase() === currentUser.email.toLowerCase()
    );
  }, [db.visas, currentUser]);

  if (!currentUser) {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <User className="w-10 h-10 text-[#0A224E] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#0A224E]">
            Pilgrim &amp; Traveler Portal
          </h1>
          <p className="text-sm text-slate-600">
            Sign in to view your Umrah trip countdown, pay installments, upload passport documents,
            and download issued e-visas.
          </p>
          <button
            type="button"
            onClick={() => login('user@siditravel.com')}
            className="w-full py-3 px-4 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl"
          >
            1-Click Demo Pilgrim Login (user@siditravel.com)
          </button>
        </div>
      </div>
    );
  }

  const primaryBooking = userBookings[0] || null;
  const primaryVisa = userVisas[0] || null;
  const daysLeft = primaryBooking ? getDaysUntilDeparture(primaryBooking.departureDate) : 0;

  const totalCost = userBookings.reduce((sum, b) => sum + b.totalAmountNgn, 0);
  const totalPaid = userBookings.reduce((sum, b) => sum + b.amountPaidNgn, 0);
  const totalBalance = Math.max(0, totalCost - totalPaid);

  const handleVaultUpload = (
    visaId: string,
    docType: VisaDocumentItem['type'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      await updateVisaApplication(visaId, {
        document: {
          type: docType,
          fileName: file.name,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        },
      });
      notify(`${docType} uploaded to Document Vault.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-8 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F5B800]">
              Welcome, {currentUser.name} · {currentUser.email}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Pilgrim &amp; Traveler Workspace
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/umrah-packages')}
            className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] rounded-xl shadow-xs"
          >
            + Book New Package / Flight
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Responsive Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-3 flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar lg:sticky lg:top-28 shadow-xs">
            {[
              { id: 'overview' as const, label: 'Overview & Countdown', icon: LayoutDashboard },
              { id: 'bookings' as const, label: 'My Bookings & E-Tickets', icon: Plane },
              { id: 'wallet' as const, label: 'Installment Wallet', icon: Wallet },
              { id: 'visas' as const, label: 'Visa & Document Vault', icon: FileCheck2 },
              { id: 'escort' as const, label: 'Escort & Travel Briefing', icon: Bell },
            ].map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`lg:w-full flex items-center gap-2.5 px-3.5 py-2.5 min-h-[42px] text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#0A224E] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#F5B800]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6 min-w-0">
            {tab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Departure Countdown</span>
                    <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums mt-1">
                      {primaryBooking ? `${daysLeft} Days` : 'No Active Trip'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {primaryBooking
                        ? `${formatDisplayDate(primaryBooking.departureDate)} · ${primaryBooking.routeOrLocation}`
                        : 'Select a package to start'}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-1.5">
                    <span className="text-xs font-medium text-slate-500 block">Visa Processing Status</span>
                    {primaryVisa ? (
                      <StatusPill status={primaryVisa.stage} />
                    ) : (
                      <p className="text-lg font-bold text-[#0A224E]">Not Submitted</p>
                    )}
                    <p className="text-xs text-slate-600 pt-0.5">
                      {primaryVisa ? `${primaryVisa.country} · ${primaryVisa.category}` : 'Apply via Visa Portal'}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Remaining Installment Balance</span>
                    <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums mt-1">
                      {formatMoney(totalBalance, currency)}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 font-mono font-semibold tabular-nums">
                      Paid: {formatMoney(totalPaid, currency)}
                    </p>
                  </div>
                </div>

                {primaryBooking && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-mono text-slate-500">
                          Active Reference: {primaryBooking.reference}
                        </p>
                        <h2 className="font-display text-xl font-bold text-[#0A224E] mt-0.5">
                          {primaryBooking.itemTitle}
                        </h2>
                      </div>
                      <StatusPill status={primaryBooking.status} />
                    </div>

                    {(() => {
                      const pct = Math.min(
                        100,
                        Math.round(
                          (primaryBooking.amountPaidNgn / primaryBooking.totalAmountNgn) * 100
                        )
                      );
                      const rem = Math.max(
                        0,
                        primaryBooking.totalAmountNgn - primaryBooking.amountPaidNgn
                      );
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 font-medium">Payment Progress ({pct}%)</span>
                            <span className="font-mono font-semibold text-[#0A224E] tabular-nums">
                              {formatMoney(primaryBooking.amountPaidNgn, currency)} /{' '}
                              {formatMoney(primaryBooking.totalAmountNgn, currency)}
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {rem > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  startCheckout({
                                    bookingType: primaryBooking.bookingType,
                                    itemId: primaryBooking.itemId,
                                    itemTitle: primaryBooking.itemTitle,
                                    tierOrCabin: primaryBooking.tierOrCabin,
                                    departureDate: primaryBooking.departureDate,
                                    returnDate: primaryBooking.returnDate,
                                    routeOrLocation: primaryBooking.routeOrLocation,
                                    unitPriceNgn: rem,
                                    passengersCount: 1,
                                    existingBookingId: primaryBooking.id,
                                    existingRemainingNgn: rem,
                                  })
                                }
                                className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] hover:brightness-105 rounded-xl"
                              >
                                Make Next Installment Payment
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setReceiptBooking(primaryBooking)}
                              className="px-4 py-2.5 text-xs font-bold border border-slate-300 text-[#0A224E] hover:border-[#0A224E] rounded-xl"
                            >
                              View Official Receipt &amp; E-Ticket
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}

            {tab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    My Bookings &amp; E-Tickets
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    {userBookings.length} booking(s)
                  </span>
                </div>
                {userBookings.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No bookings found yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {userBookings.map((bkg) => (
                      <div
                        key={bkg.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono font-bold text-[#0A224E]">{bkg.reference}</span>
                            <span>·</span>
                            <span>{bkg.bookingType}</span>
                            <StatusPill status={bkg.status} />
                          </div>
                          <h3 className="text-base font-bold text-[#0A224E]">{bkg.itemTitle}</h3>
                          <p className="text-xs text-slate-600">
                            {bkg.scheduleLabel || bkg.routeOrLocation} · Dep:{' '}
                            <span className="font-mono">{formatDisplayDate(bkg.departureDate)}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="text-left sm:text-right">
                            <p className="font-mono text-sm font-bold text-[#0A224E] tabular-nums">
                              {formatMoney(bkg.amountPaidNgn, currency)} /{' '}
                              {formatMoney(bkg.totalAmountNgn, currency)}
                            </p>
                            <p className="text-[11px] text-slate-500">Paid / Total</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setReceiptBooking(bkg)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#F5B800]" />
                            <span>Receipt</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'wallet' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
                <h2 className="font-display text-xl font-bold text-[#0A224E]">
                  Installment Wallet &amp; Payment History
                </h2>
                {userBookings.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No active installment plans yet. Reserve an Umrah package or flight to manage payments here.
                  </p>
                ) : (
                  userBookings.map((bkg) => {
                    const remaining = Math.max(0, bkg.totalAmountNgn - bkg.amountPaidNgn);
                    const pct = Math.min(100, Math.round((bkg.amountPaidNgn / bkg.totalAmountNgn) * 100));
                    return (
                      <div key={bkg.id} className="p-5 rounded-2xl border border-slate-200 bg-[#FAF9F6] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs text-slate-500">{bkg.reference}</span>
                            <h3 className="text-sm font-bold text-[#0A224E]">{bkg.itemTitle}</h3>
                          </div>
                          {remaining > 0 ? (
                            <button
                              type="button"
                              onClick={() =>
                                startCheckout({
                                  bookingType: bkg.bookingType,
                                  itemId: bkg.itemId,
                                  itemTitle: bkg.itemTitle,
                                  tierOrCabin: bkg.tierOrCabin,
                                  departureDate: bkg.departureDate,
                                  returnDate: bkg.returnDate,
                                  routeOrLocation: bkg.routeOrLocation,
                                  unitPriceNgn: remaining,
                                  passengersCount: 1,
                                  existingBookingId: bkg.id,
                                  existingRemainingNgn: remaining,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#D4AF37] text-[#05122B] hover:bg-[#F5B800] rounded-xl"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Make Next Installment Payment</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Fully Settled</span>
                            </span>
                          )}
                        </div>

                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs">
                          <div>
                            <span className="text-slate-500 block">Total Cost</span>
                            <span className="font-mono font-bold tabular-nums">
                              {formatMoney(bkg.totalAmountNgn, currency)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Paid to Date</span>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              {formatMoney(bkg.amountPaidNgn, currency)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Balance</span>
                            <span className="font-mono font-bold text-[#0A224E] tabular-nums">
                              {formatMoney(remaining, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {tab === 'visas' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0A224E]">
                      Visa &amp; Document Vault
                    </h2>
                    <p className="text-xs text-slate-600">
                      Upload passport &amp; health documents for immediate verification by our Kano desk.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/visa-services')}
                    className="px-4 py-2 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                  >
                    + New Visa Application
                  </button>
                </div>

                {userVisas.length === 0 ? (
                  <p className="text-sm text-slate-500">No active visa applications.</p>
                ) : (
                  userVisas.map((visa) => (
                    <div key={visa.id} className="p-5 rounded-2xl border border-slate-200 bg-[#FAF9F6] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-[#0A224E]">
                            {visa.country} — {visa.category}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono">
                            Passport: {visa.passportNumber} · {visa.processingSpeed}
                          </p>
                        </div>
                        <StatusPill status={visa.stage} />
                      </div>

                      {visa.notes && (
                        <p className="text-xs text-slate-700 bg-white border border-slate-200/80 p-3 rounded-xl">
                          Desk Note: {visa.notes}
                        </p>
                      )}

                      {visa.stage === 'Visa Approved & Issued' && visa.issuedVisaUrl && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-xs font-bold text-emerald-900">
                            Your E-Visa PDF/Document has been issued!
                          </span>
                          <a
                            href={visa.issuedVisaUrl}
                            download={`Sidi_EVisa_${visa.passportNumber}.jpg`}
                            className="px-3.5 py-2 text-xs font-bold bg-emerald-700 text-white rounded-lg text-center"
                          >
                            Download Issued Visa
                          </a>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            'Passport Data Page',
                            'Passport Photograph',
                            'Yellow Fever Card',
                            'NIN Slip',
                          ] as const
                        ).map((docType) => {
                          const doc = visa.documents.find((d) => d.type === docType);
                          return (
                            <label
                              key={docType}
                              className={`flex items-center justify-between gap-2 p-3.5 rounded-xl border border-dashed cursor-pointer text-xs transition-colors ${
                                doc
                                  ? 'border-emerald-300 bg-emerald-50/70'
                                  : 'border-slate-300 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800">{docType}</p>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {doc ? `Uploaded: ${doc.fileName}` : 'Click to upload file'}
                                </p>
                              </div>
                              <Upload className="w-4 h-4 text-[#0A224E] shrink-0" />
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleVaultUpload(visa.id, docType, e)}
                                className="sr-only"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'escort' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <h2 className="font-display text-xl font-bold text-[#0A224E]">
                    Assigned Escort &amp; Hotel Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1.5">
                      <p className="text-xs text-slate-500">Assigned Sidi Travel Escort</p>
                      <p className="font-bold text-[#0A224E]">
                        {primaryBooking?.escortName || db.escorts[0]?.name}
                      </p>
                      <p className="font-mono text-xs text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C89D28]" />
                        <span>{primaryBooking?.escortPhone || db.escorts[0]?.phone}</span>
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1.5">
                      <p className="text-xs text-slate-500">Makkah &amp; Madinah Accommodation</p>
                      <p className="font-semibold text-[#0A224E] flex items-start gap-1.5">
                        <Building2 className="w-4 h-4 text-[#C89D28] shrink-0 mt-0.5" />
                        <span>
                          {primaryBooking?.hotelSummary ||
                            'Anjum Hotel Makkah (4★) & Pullman Zamzam Madinah'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <h3 className="font-display text-lg font-bold text-[#0A224E]">
                    Pre-Departure Orientation Notices
                  </h3>
                  <div className="space-y-3">
                    {db.notices.map((n) => (
                      <div key={n.id} className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[#0A224E]">{n.title}</span>
                          <span className="font-mono text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#C89D28]" />
                            {n.dateLabel} · {n.timeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">{n.message}</p>
                        <p className="text-[11px] text-slate-500">Venue: {n.venue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
