import React, { useEffect } from 'react';
import { CheckCircle2, Plane, Printer, X } from 'lucide-react';
import { BRAND_CONTACT } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { formatDisplayDate, formatMoney } from '../utils/travelLogic';
import { SidiLogoEmblem, StatusPill } from './BrandVisuals';

export function ReceiptModal() {
  const { receiptBooking, setReceiptBooking, currency } = useApp();

  useEffect(() => {
    if (!receiptBooking) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setReceiptBooking(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [receiptBooking, setReceiptBooking]);

  if (!receiptBooking) return null;

  const balance = Math.max(0, receiptBooking.totalAmountNgn - receiptBooking.amountPaidNgn);
  const pctPaid =
    receiptBooking.totalAmountNgn > 0
      ? Math.min(100, Math.round((receiptBooking.amountPaidNgn / receiptBooking.totalAmountNgn) * 100))
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122B]/75 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setReceiptBooking(null);
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#05122B] to-[#0A224E] text-white no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#F5B800]" />
            <span className="text-sm font-semibold">Official E-Ticket &amp; Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] rounded-lg hover:brightness-105"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setReceiptBooking(null)}
              aria-label="Close receipt"
              className="p-1.5 text-slate-300 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-800">
          {/* Brand Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-dashed border-slate-300">
            <div className="flex items-center gap-3">
              <SidiLogoEmblem className="w-12 h-12 shrink-0" />
              <div>
                <h2 id="receipt-title" className="font-display text-lg font-bold text-[#0A224E]">
                  {BRAND_CONTACT.companyName}
                </h2>
                <p className="text-xs text-slate-500">{BRAND_CONTACT.address}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {BRAND_CONTACT.phones[0]} · {BRAND_CONTACT.email}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                Booking Reference
              </span>
              <span className="font-mono text-lg font-bold text-[#0A224E] tabular-nums block">
                {receiptBooking.reference}
              </span>
              <StatusPill status={receiptBooking.status} />
            </div>
          </div>

          {/* Boarding-Pass Style Route & Itinerary Summary */}
          <div className="rounded-2xl border border-slate-200 bg-[#FAF9F6] overflow-hidden">
            <div className="bg-[#0A224E] text-white px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#F5B800]" />
                {receiptBooking.bookingType}
              </span>
              <span className="font-mono text-[#F5B800]">{pctPaid}% Settled</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Service / Package
                </span>
                <p className="font-bold text-[#0A224E] mt-0.5">{receiptBooking.itemTitle}</p>
                <p className="text-xs text-slate-600 mt-0.5">{receiptBooking.tierOrCabin}</p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Route &amp; Schedule
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">{receiptBooking.routeOrLocation}</p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Dep: {formatDisplayDate(receiptBooking.departureDate)}
                  {receiptBooking.returnDate ? ` · Ret: ${formatDisplayDate(receiptBooking.returnDate)}` : ''}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Primary Traveler
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">{receiptBooking.customerName}</p>
                <p className="text-xs text-slate-600">
                  {receiptBooking.customerEmail} · {receiptBooking.customerPhone}
                </p>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500">
                  Escort / Accommodation
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {receiptBooking.escortName || 'Kano Travel Desk'}
                </p>
                <p className="text-xs text-slate-600">
                  {receiptBooking.hotelSummary || 'Confirmed Itinerary'}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[440px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold">Transaction Ref</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Channel</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Date</th>
                    <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receiptBooking.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-slate-500">
                        No verified payments recorded yet ({receiptBooking.status})
                      </td>
                    </tr>
                  ) : (
                    receiptBooking.transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td className="px-4 py-2.5 font-mono">{txn.reference}</td>
                        <td className="px-4 py-2.5">{txn.channel}</td>
                        <td className="px-4 py-2.5 font-mono">
                          {new Date(txn.paidAt).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums font-semibold">
                          {formatMoney(txn.amountNgn, currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-[#FAF9F6] px-4 py-3.5 border-t border-slate-200 flex flex-wrap justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-500">Total Cost: </span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatMoney(receiptBooking.totalAmountNgn, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Total Paid: </span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  {formatMoney(receiptBooking.amountPaidNgn, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Balance Due: </span>
                <span className="font-mono font-bold text-[#0A224E] tabular-nums">
                  {formatMoney(balance, currency)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Generated electronically by Sidi Travel &amp; Tours Ltd. Present this reference at our Kano Head Office or airport check-in desk.
          </p>
        </div>
      </div>
    </div>
  );
}
