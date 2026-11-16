import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileCheck2, ShieldCheck, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisaApplication, VisaDocumentItem } from '../types/travel';
import { IslamicGeometricBackdrop } from '../components/BrandVisuals';

const VISA_GUIDES: {
  country: string;
  category: VisaApplication['category'];
  timeline: string;
  feeNgn: string;
  notes: string;
}[] = [
  {
    country: 'Saudi Arabia',
    category: 'Umrah Visa',
    timeline: '48–72 Hours (Express) / 5 Days',
    feeNgn: '₦420,000 (Included in Umrah Packages)',
    notes: 'Requires valid Nigerian International Passport (6+ months), Yellow Fever Card, and Saudi Bio App biometrics.',
  },
  {
    country: 'Saudi Arabia',
    category: 'Saudi Tourist Visa',
    timeline: '3–5 Business Days',
    feeNgn: '₦480,000',
    notes: 'Multiple-entry 1-year e-visa allowing Umrah performance outside Hajj season.',
  },
  {
    country: 'UAE (Dubai)',
    category: 'UAE Dubai Visa',
    timeline: '3–5 Business Days',
    feeNgn: '₦395,000 (30 Days Single Entry)',
    notes: 'Includes hotel/flight confirmation support and return ticket itinerary.',
  },
  {
    country: 'United Kingdom',
    category: 'UK Visa',
    timeline: '15 Working Days',
    feeNgn: 'Advisory & Filing Support from ₦250,000',
    notes: 'Full UKVI application review, bank statement audit, and TLScontact appointment scheduling.',
  },
  {
    country: 'Schengen (Europe)',
    category: 'Schengen Visa',
    timeline: '15–21 Working Days',
    feeNgn: 'Advisory & Filing Support from ₦250,000',
    notes: 'Travel insurance, verified hotel reservations, and embassy interview preparation.',
  },
];

const CHECKLIST_ITEMS = [
  'International Passport (Minimum 6 months validity from travel date)',
  'Recent White-Background Passport Photograph (2×2 inches)',
  'Valid Yellow Fever Vaccination Certificate (International Health Card)',
  'National Identification Number (NIN) Slip or Card',
];

function findGuideIndex(category: string, country: string): number {
  const byCategory = VISA_GUIDES.findIndex((g) => g.category === category);
  if (byCategory >= 0) return byCategory;
  const byCountry = VISA_GUIDES.findIndex((g) => g.country === country);
  return byCountry >= 0 ? byCountry : 0;
}

export function VisaServicesPage() {
  const { currentUser, searchState, submitVisaApplication, navigate, notify } = useApp();

  const [selectedGuideIdx, setSelectedGuideIdx] = useState(() =>
    findGuideIndex(searchState.visaCategory, searchState.visaCountry)
  );
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '');
  const [passportNumber, setPassportNumber] = useState('');
  const [processingSpeed, setProcessingSpeed] = useState<VisaApplication['processingSpeed']>(
    searchState.visaSpeed || 'Standard (5-7 Days)'
  );
  const [uploadedDocs, setUploadedDocs] = useState<VisaDocumentItem[]>([]);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setApplicantName((prev) => prev || currentUser.name);
      setApplicantEmail((prev) => prev || currentUser.email);
      setApplicantPhone((prev) => prev || currentUser.phone);
    }
  }, [currentUser]);

  const activeGuide = VISA_GUIDES[selectedGuideIdx];
  const checkedCount = CHECKLIST_ITEMS.filter((item) => checkedDocs[item]).length;

  const handleFileUpload = (
    docType: VisaDocumentItem['type'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      setUploadedDocs((prev) => [
        ...prev.filter((d) => d.type !== docType),
        {
          type: docType,
          fileName: file.name,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      notify(`Attached ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passportNumber.trim().length < 5) {
      notify('Enter a valid International Passport number (at least 5 characters).', 'error');
      return;
    }
    setBusy(true);
    const created = await submitVisaApplication({
      userId: currentUser?.id || 'user-demo-1',
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      country: activeGuide.country,
      category: activeGuide.category,
      processingSpeed,
      passportNumber: passportNumber.trim().toUpperCase(),
      documents: uploadedDocs,
    });
    setBusy(false);
    if (created) {
      setSubmittedRef(created.id);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
            400+ Umrah Visas Successfully Issued · Sept – Nov 2026
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
            Visa Assistance &amp; Application Portal
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Select your destination visa category, verify your document checklist, and submit your
            online application directly to our Kano processing desk.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Country Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {VISA_GUIDES.map((guide, idx) => {
            const active = idx === selectedGuideIdx;
            return (
              <button
                key={guide.category}
                type="button"
                onClick={() => setSelectedGuideIdx(idx)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  active
                    ? 'bg-gradient-to-br from-[#0A224E] to-[#05122B] text-white border-[#D4AF37] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#D4AF37]/60'
                }`}
              >
                <p className={`text-[11px] font-semibold ${active ? 'text-[#F5B800]' : 'text-slate-500'}`}>
                  {guide.country}
                </p>
                <h2 className="text-sm font-bold mt-1">{guide.category}</h2>
                <p className={`text-xs mt-2 ${active ? 'text-slate-200' : 'text-slate-600'}`}>
                  {guide.timeline}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selected Guide & Interactive Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#C89D28]" />
                <h2 className="font-display text-xl font-bold text-[#0A224E]">
                  {activeGuide.category} Requirements
                </h2>
              </div>
              <div className="text-xs space-y-2 bg-[#FAF9F6] p-4 rounded-xl border border-slate-200/80">
                <p>
                  <span className="font-bold text-[#0A224E]">Processing Window:</span>{' '}
                  {activeGuide.timeline}
                </p>
                <p>
                  <span className="font-bold text-[#0A224E]">Indicative Fee:</span>{' '}
                  <span className="font-mono font-semibold text-[#0A224E]">{activeGuide.feeNgn}</span>
                </p>
                <p className="text-slate-600 pt-1 leading-relaxed">{activeGuide.notes}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-bold text-[#0A224E]">Pre-Submission Checklist</h3>
                  <span className="font-mono font-semibold text-emerald-700">
                    {checkedCount}/{CHECKLIST_ITEMS.length} ready
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full transition-all"
                    style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.map((item) => (
                    <label
                      key={item}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors text-xs ${
                        checkedDocs[item]
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedDocs[item])}
                        onChange={(e) =>
                          setCheckedDocs((prev) => ({ ...prev, [item]: e.target.checked }))
                        }
                        className="mt-0.5 accent-[#0A224E]"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Online Visa Application Wizard */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {submittedRef ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                  Visa Application Received
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your {activeGuide.category} application ({submittedRef}) is now in our Kano Visa
                  Desk queue. Track live embassy progress in your Pilgrim Portal.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                  >
                    Track in Pilgrim Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="px-5 py-2.5 text-xs font-bold border border-slate-300 text-slate-700 rounded-xl"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                      Start Online Visa Application
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applying for {activeGuide.country} — {activeGuide.category}
                    </p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#C89D28]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="v-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicant Full Name (as on Passport)
                    </label>
                    <input
                      id="v-name"
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Alhaji Ibrahim Musa"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-pass" className="block text-xs font-semibold text-slate-700 mb-1">
                      International Passport Number
                    </label>
                    <input
                      id="v-pass"
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                      placeholder="B50294812"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="v-email"
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      id="v-phone"
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="08035926442"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="v-speed" className="block text-xs font-semibold text-slate-700 mb-1">
                    Processing Speed
                  </label>
                  <select
                    id="v-speed"
                    value={processingSpeed}
                    onChange={(e) =>
                      setProcessingSpeed(e.target.value as VisaApplication['processingSpeed'])
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6]"
                  >
                    <option value="Standard (5-7 Days)">Standard (5–7 Days)</option>
                    <option value="Express (48-72 Hours)">Express (48–72 Hours)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Upload Supporting Documents (Optional here — can also upload later in Portal)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        'Passport Data Page',
                        'Passport Photograph',
                        'Yellow Fever Card',
                        'NIN Slip',
                      ] as const
                    ).map((docType) => {
                      const existing = uploadedDocs.find((d) => d.type === docType);
                      return (
                        <label
                          key={docType}
                          className={`flex items-center justify-between gap-2 p-3 rounded-xl border border-dashed cursor-pointer text-xs transition-colors ${
                            existing
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                              : 'border-slate-300 bg-[#FAF9F6] hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="truncate font-semibold">
                            {existing ? `✓ ${existing.fileName}` : docType}
                          </span>
                          <Upload className="w-4 h-4 text-[#0A224E] shrink-0" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(docType, e)}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3.5 text-sm font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-xs"
                >
                  {busy ? 'Submitting Application...' : `Submit ${activeGuide.category} Application`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
