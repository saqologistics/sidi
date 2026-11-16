import React, { useEffect, useState } from 'react';
import {
  Building,
  CheckCircle2,
  Copy,
  CreditCard,
  Hash,
  Lock,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { BookingRecord, PaymentChannel } from '../types/travel';
import {
  clampDepositMin,
  computeInstallmentBreakdown,
  formatDisplayDate,
  formatMoney,
} from '../utils/travelLogic';
import { IslamicGeometricBackdrop, StatusPill } from '../components/BrandVisuals';

export function CheckoutPage() {
  const {
    db,
    currency,
    currentUser,
    checkoutDraft,
    navigate,
    submitBooking,
    payInstallment,
    setReceiptBooking,
    notify,
  } = useApp();

  const existingBooking = checkoutDraft?.existingBookingId
    ? db.bookings.find((b) => b.id === checkoutDraft.existingBookingId) || null
    : null;

  const isTopUp = Boolean(existingBooking);

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [passportNumber, setPassportNumber] = useState('B50294812');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  const totalOrderNgn = existingBooking
    ? Math.max(0, existingBooking.totalAmountNgn - existingBooking.amountPaidNgn)
    : (checkoutDraft?.unitPriceNgn || 0) * (checkoutDraft?.passengersCount || 1);

  const [paymentPlan, setPaymentPlan] = useState<'Full' | 'Installment'>(() =>
    checkoutDraft?.existingRemainingNgn === 1 ? 'Installment' : 'Full'
  );
  const [customDepositNgn, setCustomDepositNgn] = useState<number>(() =>
    Math.min(1500000, totalOrderNgn || 1500000)
  );
  const [channel, setChannel] = useState<PaymentChannel>('Card');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  const [secondsLeft, setSecondsLeft] = useState(1800);
  const [ussdBank, setUssdBank] = useState<'GTBank (*737#)' | 'Access (*901#)' | 'Zenith (*966#)'>(
    'GTBank (*737#)'
  );

  const [processing, setProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (currentUser) {
      setCustomerName((prev) => prev || currentUser.name);
      setCustomerEmail((prev) => prev || currentUser.email);
      setCustomerPhone((prev) => prev || currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    setCustomDepositNgn(
      totalOrderNgn > 0 ? Math.min(1500000, totalOrderNgn) : 1500000
    );
    setPaymentPlan(checkoutDraft?.existingRemainingNgn ? 'Installment' : 'Full');
  }, [checkoutDraft?.itemId, checkoutDraft?.existingBookingId, totalOrderNgn, checkoutDraft?.existingRemainingNgn]);

  useEffect(() => {
    if (completedBooking) {
      window.scrollTo(0, 0);
    }
  }, [completedBooking]);

  useEffect(() => {
    if (channel !== 'Bank Transfer') return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [channel]);

  useEffect(() => {
    if (!otpOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOtpOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [otpOpen]);

  if (!checkoutDraft && !completedBooking) {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <Receipt className="w-10 h-10 text-[#C89D28] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#0A224E]">
            No Active Booking Selected
          </h1>
          <p className="text-sm text-slate-600">
            Select an Umrah package, flight, or hotel first to launch the Sidi Travel Checkout &amp;
            Payment Simulator.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => navigate('/umrah-packages')}
              className="px-4 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
            >
              Browse Umrah Packages
            </button>
            <button
              type="button"
              onClick={() => navigate('/flights')}
              className="px-4 py-2.5 text-xs font-bold border border-slate-300 text-slate-700 rounded-xl"
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minDepositFloor = isTopUp
    ? clampDepositMin(totalOrderNgn, 100000)
    : clampDepositMin(totalOrderNgn, 500000);

  const breakdown = computeInstallmentBreakdown(
    totalOrderNgn,
    isTopUp ? 'Installment' : paymentPlan,
    isTopUp ? customDepositNgn : paymentPlan === 'Full' ? totalOrderNgn : customDepositNgn,
    minDepositFloor
  );

  const amountToPayNow = isTopUp
    ? Math.min(totalOrderNgn, Math.max(minDepositFloor, customDepositNgn))
    : breakdown.depositNgn;

  const fillTestCard = () => {
    setCardNumber('4084 0840 8408 4081');
    setCardExpiry('08/29');
    setCardCvv('408');
    setCardPin('1234');
    notify('Pre-filled Paystack/Flutterwave test card.', 'info');
  };

  const finalizePayment = async () => {
    if (channel === 'Card' && otpCode.trim().length < 4) {
      notify('Enter the 6-digit sandbox OTP (123456) to authorize payment.', 'error');
      return;
    }
    setProcessing(true);
    let result: BookingRecord | null = null;
    if (isTopUp && existingBooking) {
      result = await payInstallment(
        existingBooking.id,
        amountToPayNow,
        channel,
        `Simulated ${channel} installment top-up`
      );
    } else {
      result = await submitBooking({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        passengers: [
          {
            fullName: customerName.trim(),
            passportNumber: passportNumber.trim().toUpperCase(),
            gender,
          },
        ],
        paymentPlan,
        initialPaymentNgn: amountToPayNow,
        channel,
      });
    }
    setProcessing(false);
    setOtpOpen(false);
    if (result) {
      setCompletedBooking(result);
    }
  };

  const handlePayTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTopUp && (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim())) {
      notify('Please fill in primary traveler details.', 'error');
      return;
    }
    if (!isTopUp && passportNumber.trim().length < 5) {
      notify('Enter a valid International Passport number (at least 5 characters).', 'error');
      return;
    }
    if (!breakdown.isValid) {
      notify(breakdown.error || 'Check deposit amount.', 'error');
      return;
    }
    if (channel === 'Card') {
      if (
        !cardNumber.trim() ||
        !cardExpiry.trim() ||
        !cardCvv.trim() ||
        !cardPin.trim()
      ) {
        notify('Enter complete card details (number, expiry, CVV, PIN) or click "Use Test Card".', 'error');
        return;
      }
      setOtpOpen(true);
      return;
    }
    await finalizePayment();
  };

  if (completedBooking) {
    const balanceDue = Math.max(
      0,
      completedBooking.totalAmountNgn - completedBooking.amountPaidNgn
    );
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-14 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-md space-y-6">
          <div className="text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simulated Payment Verified
            </p>
            <h1 className="font-display text-3xl font-bold text-[#0A224E]">
              Booking {completedBooking.status}
            </h1>
            <div className="flex justify-center">
              <StatusPill status={completedBooking.status} />
            </div>
            <p className="text-sm text-slate-600">
              Your booking reference is{' '}
              <span className="font-mono font-bold text-[#0A224E]">{completedBooking.reference}</span>
              . It has been synced to both your Pilgrim Portal and Sidi Admin Ledger.
            </p>
          </div>

          <div className="bg-[#FAF9F6] rounded-2xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Package / Flight</span>
              <p className="font-bold text-[#0A224E] mt-0.5">{completedBooking.itemTitle}</p>
            </div>
            <div>
              <span className="text-slate-500">Schedule / Route</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {completedBooking.scheduleLabel || completedBooking.routeOrLocation}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Amount Paid</span>
              <p className="font-mono text-base font-bold text-emerald-700 tabular-nums mt-0.5">
                {formatMoney(completedBooking.amountPaidNgn, currency)}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Remaining Balance</span>
              <p className="font-mono text-base font-bold text-[#0A224E] tabular-nums mt-0.5">
                {formatMoney(balanceDue, currency)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReceiptBooking(completedBooking)}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] hover:brightness-105 rounded-xl transition-all shadow-xs"
            >
              <Receipt className="w-4 h-4" />
              <span>View / Print Official Receipt &amp; E-Ticket</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-3 text-xs font-bold bg-[#0A224E] text-white hover:bg-[#102F6A] rounded-xl transition-colors"
            >
              Open Pilgrim Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const payPct = totalOrderNgn > 0 ? Math.min(100, Math.round((amountToPayNow / totalOrderNgn) * 100)) : 100;

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-9 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
              Interactive Payment Gateway Simulator
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              {isTopUp ? `Installment Top-Up · ${existingBooking?.reference}` : 'Complete Your Booking'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#F5B800]">
              1. Details
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
              2. Plan
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#05122B] font-bold">
              3. Pay
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Traveler Details + Payment Plan + Gateway Channels */}
          <form onSubmit={handlePayTrigger} className="lg:col-span-7 space-y-6">
            {!isTopUp && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                <h2 className="font-display text-lg font-bold text-[#0A224E]">
                  1. Primary Traveler / Pilgrim Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="chk-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name (as on Passport)
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Alhaji Ibrahim Musa"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="chk-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="user@siditravel.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="chk-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="08035926442"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="chk-pass" className="block text-xs font-semibold text-slate-700 mb-1">
                        Passport No.
                      </label>
                      <input
                        id="chk-pass"
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="chk-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="chk-gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Plan Toggle */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#0A224E]">
                {isTopUp ? '1. Choose Top-Up Amount' : '2. Select Payment Plan'}
              </h2>

              {!isTopUp && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('Full')}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      paymentPlan === 'Full'
                        ? 'border-[#0A224E] bg-[#0A224E]/[0.04] ring-2 ring-[#0A224E]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#0A224E]">Full Payment (100%)</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Settle {formatMoney(totalOrderNgn, currency)} now for instant ticket &amp; seat confirmation.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan('Installment')}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      paymentPlan === 'Installment'
                        ? 'border-[#D4AF37] bg-[#FBF6E6] ring-2 ring-[#D4AF37]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#0A224E]">
                      Installment Plan (&ldquo;Pay Small Small&rdquo;)
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Lock your seat with an initial deposit from ₦500,000 and pay the balance before departure.
                    </p>
                  </button>
                </div>
              )}

              {(paymentPlan === 'Installment' || isTopUp) && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="deposit-input" className="text-xs font-bold text-[#0A224E]">
                      {isTopUp ? 'Installment Payment Amount (NGN)' : 'Initial Deposit Amount (NGN)'}
                    </label>
                    <div className="flex gap-1.5">
                      {[1000000, 1500000, 2500000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCustomDepositNgn(Math.min(totalOrderNgn, preset))}
                          className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-white border border-slate-300 rounded-lg hover:border-[#0A224E]"
                        >
                          ₦{(preset / 1000000).toFixed(1)}M
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    id="deposit-input"
                    type="number"
                    min={minDepositFloor}
                    max={totalOrderNgn}
                    step={50000}
                    value={customDepositNgn}
                    onChange={(e) => setCustomDepositNgn(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-base font-mono font-bold border border-slate-300 rounded-xl bg-white text-[#0A224E]"
                  />
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full transition-all"
                      style={{ width: `${payPct}%` }}
                    />
                  </div>
                  {!breakdown.isValid && !isTopUp ? (
                    <p className="text-xs text-rose-700 font-semibold">{breakdown.error}</p>
                  ) : (
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Remaining balance due before departure ({100 - payPct}%):</span>
                      <span className="font-mono font-bold text-[#0A224E] tabular-nums">
                        {formatMoney(Math.max(0, totalOrderNgn - amountToPayNow), currency)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Simulated Payment Gateway Channels */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-[#0A224E]">
                  {isTopUp ? '2. Payment Channel' : '3. Payment Gateway Simulator'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit Sandbox</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: 'Card' as const, label: 'Card Payment', icon: CreditCard },
                    { id: 'Bank Transfer' as const, label: 'Bank Transfer', icon: Building },
                    { id: 'USSD' as const, label: 'USSD Code', icon: Hash },
                  ] as const
                ).map((ch) => {
                  const Icon = ch.icon;
                  const active = channel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl border transition-colors ${
                        active
                          ? 'bg-[#0A224E] text-white border-[#0A224E]'
                          : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>

              {channel === 'Card' && (
                <div className="space-y-3.5 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#FBF6E6] p-3.5 rounded-xl border border-[#D4AF37]/40">
                    <span className="text-xs text-slate-700">
                      Test Card: <span className="font-mono font-bold">4084 0840 8408 4081</span> · CVV <span className="font-mono font-bold">408</span> · PIN <span className="font-mono font-bold">1234</span>
                    </span>
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="px-3 py-1.5 text-xs font-bold bg-[#D4AF37] text-[#05122B] hover:bg-[#F5B800] rounded-lg whitespace-nowrap self-start sm:self-auto"
                    >
                      Use Test Card
                    </button>
                  </div>
                  <div>
                    <label htmlFor="card-num" className="block text-xs font-semibold text-slate-700 mb-1">
                      Card Number
                    </label>
                    <input
                      id="card-num"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4084 0840 8408 4081"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="card-exp" className="block text-xs font-semibold text-slate-700 mb-1">
                        Expiry
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvv" className="block text-xs font-semibold text-slate-700 mb-1">
                        CVV
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="408"
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-pin" className="block text-xs font-semibold text-slate-700 mb-1">
                        Card PIN
                      </label>
                      <input
                        id="card-pin"
                        type="password"
                        value={cardPin}
                        onChange={(e) => setCardPin(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {channel === 'Bank Transfer' && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0A224E]">
                      Simulated Virtual Account
                    </span>
                    <span className="font-mono text-amber-700 font-semibold tabular-nums">
                      Expires in {mm}:{ss}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <p className="text-xs text-slate-500">Bank: Titan Trust / Paystack Checkout</p>
                    <p className="text-xs text-slate-500">
                      Account Name: <span className="font-bold text-slate-800">Sidi Travel &amp; Tours Ltd.</span>
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-xl font-bold text-[#0A224E] tracking-wider">
                        9048271650
                      </span>
                      <button
                        type="button"
                        onClick={() => notify('Virtual account 9048271650 copied.', 'info')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-[#0A224E] hover:bg-slate-200"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {channel === 'USSD' && (
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-3">
                  <label htmlFor="ussd-bank" className="block text-xs font-bold text-[#0A224E]">
                    Select Nigerian Bank USSD
                  </label>
                  <select
                    id="ussd-bank"
                    value={ussdBank}
                    onChange={(e) => setUssdBank(e.target.value as typeof ussdBank)}
                    className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="GTBank (*737#)">GTBank (*737#)</option>
                    <option value="Access (*901#)">Access Bank (*901#)</option>
                    <option value="Zenith (*966#)">Zenith Bank (*966#)</option>
                  </select>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-1">Dial this simulated code on your phone:</p>
                    <p className="font-mono text-lg font-bold text-[#0A224E]">
                      {ussdBank.includes('737')
                        ? `*737*2*${amountToPayNow}#`
                        : ussdBank.includes('901')
                          ? `*901*000*${amountToPayNow}#`
                          : `*966*000*${amountToPayNow}#`}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 px-6 text-sm font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-sm"
              >
                {processing
                  ? 'Confirming Transaction...'
                  : channel === 'Bank Transfer'
                    ? `I Have Sent the Money — Confirm ${formatMoney(amountToPayNow, currency)}`
                    : channel === 'USSD'
                      ? `Simulate USSD Confirmation (${formatMoney(amountToPayNow, currency)})`
                      : `Pay ${formatMoney(amountToPayNow, currency)} via Card`}
              </button>
            </div>
          </form>

          {/* Right: Booking Summary Sidebar */}
          <aside className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 lg:sticky lg:top-28 shadow-xs">
            <h2 className="font-display text-xl font-bold text-[#0A224E] pb-3 border-b border-slate-100">
              Booking Summary
            </h2>

            <div className="space-y-2 text-sm">
              <p className="font-bold text-[#0A224E]">
                {existingBooking ? existingBooking.itemTitle : checkoutDraft?.itemTitle}
              </p>
              <p className="text-xs text-slate-600">
                {existingBooking ? existingBooking.tierOrCabin : checkoutDraft?.tierOrCabin}
              </p>
              <p className="text-xs text-slate-600">
                Route / Schedule:{' '}
                <span className="font-semibold text-slate-800">
                  {existingBooking
                    ? existingBooking.scheduleLabel || existingBooking.routeOrLocation
                    : checkoutDraft?.scheduleLabel || checkoutDraft?.routeOrLocation}
                </span>
              </p>
              <p className="text-xs text-slate-600 font-mono">
                Departure:{' '}
                {formatDisplayDate(
                  existingBooking?.departureDate || checkoutDraft?.departureDate || '2027-02-08'
                )}
              </p>
              {!isTopUp && checkoutDraft && (
                <p className="text-xs text-slate-600">
                  Travelers: <span className="font-mono font-bold">{checkoutDraft.passengersCount}</span>
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{isTopUp ? 'Remaining Balance' : 'Total Booking Value'}</span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatMoney(totalOrderNgn, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes &amp; Airport Surcharges</span>
                <span className="font-mono font-semibold text-emerald-700">Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0A224E] pt-3 border-t border-slate-100">
                <span>Due Now</span>
                <span className="font-mono text-xl tabular-nums">
                  {formatMoney(amountToPayNow, currency)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#C89D28] shrink-0 mt-0.5" />
              <span>
                Bookings are immediately issued a SIDI-2027 reference and synced to your Pilgrim
                Portal &amp; our Kano Head Office ledger.
              </span>
            </div>
          </aside>
        </div>
      </div>

      {/* Simulated Card OTP Modal */}
      {otpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122B]/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="otp-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOtpOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 id="otp-title" className="font-display text-lg font-bold text-[#0A224E]">
              Simulated Bank OTP Verification
            </h3>
            <p className="text-xs text-slate-600">
              Enter the sandbox OTP <span className="font-mono font-bold">123456</span> to authorize{' '}
              <span className="font-mono font-bold">{formatMoney(amountToPayNow, currency)}</span>.
            </p>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-center font-mono text-lg font-bold tracking-widest border border-slate-300 rounded-xl"
            />
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setOtpOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold border border-slate-300 rounded-xl text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={finalizePayment}
                className="flex-1 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
              >
                {processing ? 'Authorizing...' : 'Authorize Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
