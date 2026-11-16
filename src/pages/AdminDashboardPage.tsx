import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  CheckCircle2,
  FileCheck2,
  Image as ImageIcon,
  Mail,
  Package,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { BRAND_IMAGES, RAMADAN_2027_SCHEDULES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import type {
  BookingRecord,
  BookingStatus,
  GalleryCategory,
  PackageCategory,
  PackageTier,
  PaymentChannel,
  VisaStage,
} from '../types/travel';
import {
  deriveAirlineCode,
  formatDisplayDate,
  formatMoney,
  getSeatsRemaining,
  validateAdminPilgrimRegistration,
} from '../utils/travelLogic';
import { IslamicGeometricBackdrop, SafeImage, StatusPill } from '../components/BrandVisuals';

type AdminTab = 'analytics' | 'pilgrims' | 'packages' | 'gallery' | 'bookings' | 'visas' | 'escorts';

export function AdminDashboardPage() {
  const {
    db,
    currency,
    currentUser,
    login,
    createPackage,
    deletePackage,
    createFlight,
    deleteFlight,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    payInstallment,
    updateBookingStatus,
    updateVisaApplication,
    addEscort,
    addNotice,
    deleteNotice,
    registerPilgrimByAdmin,
    setReceiptBooking,
    notify,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('analytics');

  // Admin Pilgrim Registration state
  const [pilName, setPilName] = useState('');
  const [pilEmail, setPilEmail] = useState('');
  const [pilPhone, setPilPhone] = useState('');
  const [pilCity, setPilCity] = useState('Kano');
  const [pilGender, setPilGender] = useState<'Male' | 'Female'>('Male');
  const [pilPassport, setPilPassport] = useState('');
  const [pilPackageId, setPilPackageId] = useState(db.packages[0]?.id || 'umrah-ramadan-economy');
  const [pilScheduleId, setPilScheduleId] = useState(db.packages[0]?.schedules[0]?.id || '');
  const [pilCount, setPilCount] = useState(1);
  const [pilPlan, setPilPlan] = useState<'Full' | 'Installment'>('Installment');
  const [pilDeposit, setPilDeposit] = useState(1500000);
  const [pilChannel, setPilChannel] = useState<PaymentChannel>('Offline POS / Cash');
  const [pilCreateVisa, setPilCreateVisa] = useState(true);
  const [pilNotes, setPilNotes] = useState('');
  const [pilBusy, setPilBusy] = useState(false);
  const [lastRegisteredBooking, setLastRegisteredBooking] = useState<BookingRecord | null>(null);
  const [pilSearch, setPilSearch] = useState('');

  // Package CMS state
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgSeason, setPkgSeason] = useState('Ramadan 2027');
  const [pkgCategory, setPkgCategory] = useState<PackageCategory>('Ramadan Umrah');
  const [pkgTier, setPkgTier] = useState<PackageTier>('Luxury');
  const [pkgPrice, setPkgPrice] = useState(5500000);
  const [pkgMakkah, setPkgMakkah] = useState('Swissôtel Makkah');
  const [pkgMadinah, setPkgMadinah] = useState('Pullman Zamzam Madinah');
  const [pkgCover, setPkgCover] = useState(BRAND_IMAGES.makkahHaram);
  const [pkgDesc, setPkgDesc] = useState(
    'Direct Saudi Airlines flights from Kano, hotel accommodation, Umrah visa, and guided Ziyarat.'
  );

  // Flight Fare Control state
  const [fltAirline, setFltAirline] = useState('Saudi Airlines');
  const [fltNum, setFltNum] = useState('SV 410');
  const [fltOrigin, setFltOrigin] = useState('KAN');
  const [fltDest, setFltDest] = useState('JED');
  const [fltPrice, setFltPrice] = useState(1490000);

  // Gallery Manager state
  const [galTitle, setGalTitle] = useState('');
  const [galCat, setGalCat] = useState<GalleryCategory>('Makkah & Madinah');
  const [galType, setGalType] = useState<'photo' | 'video'>('photo');
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galLocation, setGalLocation] = useState('Makkah Al-Mukarramah');
  const [galFeatured, setGalFeatured] = useState(true);

  // Offline Deposit state
  const [offlineAmountByBooking, setOfflineAmountByBooking] = useState<Record<string, number>>({});

  // Escorts & Notice state
  const [escName, setEscName] = useState('');
  const [escRole, setEscRole] = useState('Pilgrimage Escort');
  const [escPhone, setEscPhone] = useState('');
  const [notTitle, setNotTitle] = useState('');
  const [notDate, setNotDate] = useState('Monday, 16th November 2026');
  const [notTime, setNotTime] = useState('6:00 PM Prompt');
  const [notVenue, setNotVenue] = useState(
    'Sidi Travel & Tours Ltd. Office, Shopping Complex Plaza, Zoo Road, Kano'
  );
  const [notMsg, setNotMsg] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <ShieldCheck className="w-10 h-10 text-[#0A224E] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#0A224E]">
            Admin &amp; Operations Console
          </h1>
          <p className="text-sm text-slate-600">
            Authorized Sidi Travel &amp; Tours operations access required to manage packages,
            gallery uploads, bookings, and visa processing.
          </p>
          <button
            type="button"
            onClick={() => login('admin@siditravel.com')}
            className="w-full py-3 px-4 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl"
          >
            1-Click Demo Admin Login (admin@siditravel.com)
          </button>
        </div>
      </div>
    );
  }

  const totalRevenueNgn = db.bookings.reduce((sum, b) => sum + b.amountPaidNgn, 0);
  const pendingBalancesNgn = db.bookings.reduce(
    (sum, b) => sum + Math.max(0, b.totalAmountNgn - b.amountPaidNgn),
    0
  );
  const activeVisasCount = db.visas.filter((v) => v.stage !== 'Visa Approved & Issued').length;

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setGalType(isVideo ? 'video' : 'photo');
    if (isVideo) setGalCat('Videos & Reels');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setGalUrl(reader.result);
        if (!galTitle) setGalTitle(file.name.replace(/\.[^.]+$/, ''));
        notify(`Loaded ${file.name} ready to publish.`, 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(pkgPrice);
    if (!pkgTitle.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      notify('Enter a valid package title and positive Naira price.', 'error');
      return;
    }
    const created = await createPackage({
      title: pkgTitle.trim(),
      season: pkgSeason.trim() || 'Ramadan 2027',
      category: pkgCategory,
      tier: pkgTier,
      subtitle: `${pkgTier} Pilgrimage Tier`,
      priceNgn: numericPrice,
      hotelRating:
        pkgTier === 'Premium'
          ? '5★ Haram Courtyard'
          : pkgTier === 'Luxury'
            ? '4★ Walking Distance'
            : '3★ Quality Hotel',
      makkahHotel: pkgMakkah.trim() || 'Partner Makkah Hotel',
      madinahHotel: pkgMadinah.trim() || 'Partner Madinah Hotel',
      distanceToHaram: pkgTier === 'Premium' ? '50m' : '300m',
      description: pkgDesc.trim(),
      inclusions: [
        'Return Flight Ticket (Saudi Airlines)',
        'Umrah Visa & Insurance',
        'Makkah & Madinah Hotel Stay',
        'Ground Transportation & Guided Ziyarat',
      ],
      featured: true,
      coverImage: pkgCover,
      schedules: RAMADAN_2027_SCHEDULES.slice(0, 2).map((s, idx) => ({
        ...s,
        id: `sched-${Date.now()}-${idx}`,
        seatsBooked: 0,
      })),
    });
    if (created) {
      setPkgTitle('');
    }
  };

  const handlePublishFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(fltPrice);
    if (!fltAirline.trim() || !fltOrigin.trim() || !fltDest.trim()) {
      notify('Airline, origin, and destination are required.', 'error');
      return;
    }
    if (fltOrigin.trim().toUpperCase() === fltDest.trim().toUpperCase()) {
      notify('Origin and destination airport codes must differ.', 'error');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      notify('Enter a valid positive flight fare.', 'error');
      return;
    }
    const cityMap: Record<string, string> = {
      KAN: 'Kano',
      LOS: 'Lagos',
      ABV: 'Abuja',
      JED: 'Jeddah',
      MED: 'Madinah',
      DXB: 'Dubai',
      LHR: 'London',
    };
    const origin = fltOrigin.trim().toUpperCase();
    const dest = fltDest.trim().toUpperCase();
    await createFlight({
      airline: fltAirline.trim(),
      airlineCode: deriveAirlineCode(fltAirline),
      flightNumber: fltNum.trim() || `${deriveAirlineCode(fltAirline)} 410`,
      originCode: origin,
      originCity: cityMap[origin] || origin,
      destinationCode: dest,
      destinationCity: cityMap[dest] || dest,
      departureTime: '15:00',
      arrivalTime: '22:45',
      duration: '5h 45m',
      stops: 0,
      cabinClass: 'Economy',
      baggage: '2 × 23kg',
      priceNgn: numericPrice,
      seatsAvailable: 18,
    });
  };

  const handlePublishGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGalleryItem({
      title: galTitle,
      category: galCat,
      mediaType: galType,
      url: galUrl,
      caption: galCaption || galTitle,
      location: galLocation,
      date: new Date().toISOString().slice(0, 10),
      featuredOnHome: galFeatured,
    });
    setGalTitle('');
    setGalUrl('');
    setGalCaption('');
  };

  const handlePublishEscort = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEscort({
      name: escName,
      role: escRole,
      phone: escPhone,
      languages: 'Hausa, English, Arabic',
      assignedBatches: ['Package 1'],
    });
    setEscName('');
    setEscPhone('');
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    await addNotice({
      title: notTitle,
      audience: 'All Escorts',
      dateLabel: notDate,
      timeLabel: notTime,
      venue: notVenue,
      message: notMsg,
    });
    setNotTitle('');
    setNotMsg('');
  };

  const selectedRegPackage =
    db.packages.find((p) => p.id === pilPackageId) || db.packages[0];
  const regSchedules = selectedRegPackage?.schedules || [];
  const activeRegSchedule =
    regSchedules.find((s) => s.id === pilScheduleId) || regSchedules[0];

  const regValidation = validateAdminPilgrimRegistration({
    fullName: pilName,
    email: pilEmail,
    phone: pilPhone,
    passportNumber: pilPassport,
    packagePriceNgn: selectedRegPackage?.priceNgn || 0,
    pilgrimsCount: pilCount,
    paymentPlan: pilPlan,
    initialPaymentNgn: pilDeposit,
  });

  const handleRegisterPilgrim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegPackage) return;
    if (!regValidation.isValid) {
      notify(regValidation.error || 'Please verify pilgrim form inputs.', 'error');
      return;
    }
    setPilBusy(true);
    const res = await registerPilgrimByAdmin({
      fullName: pilName,
      email: pilEmail,
      phone: pilPhone,
      city: pilCity,
      gender: pilGender,
      passportNumber: pilPassport,
      packageId: selectedRegPackage.id,
      scheduleId: activeRegSchedule?.id,
      pilgrimsCount: pilCount,
      paymentPlan: pilPlan,
      initialPaymentNgn: pilPlan === 'Full' ? regValidation.totalAmountNgn : pilDeposit,
      channel: pilChannel,
      createVisaRecord: pilCreateVisa,
      notes: pilNotes,
    });
    setPilBusy(false);
    if (res) {
      setLastRegisteredBooking(res.booking);
      setPilName('');
      setPilEmail('');
      setPilPhone('');
      setPilPassport('');
      setPilDeposit(1500000);
      setPilNotes('');
    }
  };

  const filteredPilgrimManifest = useMemo(() => {
    const q = pilSearch.trim().toLowerCase();
    const umrahBookings = db.bookings.filter((b) => b.bookingType === 'Umrah Package');
    if (!q) return umrahBookings;
    return umrahBookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        b.passengers.some((p) => p.passportNumber.toLowerCase().includes(q))
    );
  }, [db.bookings, pilSearch]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-8 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F5B800]">
              Sidi Travel &amp; Tours Ltd. · Operations Control
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Admin &amp; Operations Dashboard
            </h1>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-slate-200">
            Signed in: {currentUser.email}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Responsive Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-3 flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar lg:sticky lg:top-28 shadow-xs">
            {[
              { id: 'analytics' as const, label: 'Executive Analytics', icon: BarChart3 },
              { id: 'pilgrims' as const, label: 'Pilgrim Registration', icon: UserPlus },
              { id: 'packages' as const, label: 'Package & Fare CMS', icon: Package },
              { id: 'gallery' as const, label: 'Gallery Media Manager', icon: ImageIcon },
              { id: 'bookings' as const, label: 'Bookings & Ledger', icon: Receipt },
              { id: 'visas' as const, label: 'Visa Processing Queue', icon: FileCheck2 },
              { id: 'escorts' as const, label: 'Escorts & Notice Board', icon: Bell },
            ].map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`lg:w-full flex items-center gap-2.5 px-3.5 py-2.5 min-h-[42px] text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'bg-[#0A224E] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#F5B800]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Admin Viewport */}
          <div className="lg:col-span-9 space-y-6 min-w-0">
            {tab === 'analytics' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Collected Revenue</span>
                    <p className="font-mono text-xl font-bold text-[#0A224E] tabular-nums mt-1">
                      {formatMoney(totalRevenueNgn, currency)}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Total Bookings</span>
                    <p className="font-mono text-xl font-bold text-[#0A224E] tabular-nums mt-1">
                      {db.bookings.length}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Pending Installments</span>
                    <p className="font-mono text-xl font-bold text-amber-700 tabular-nums mt-1">
                      {formatMoney(pendingBalancesNgn, currency)}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <span className="text-xs font-medium text-slate-500">Active Visa Queue</span>
                    <p className="font-mono text-xl font-bold text-[#0A224E] tabular-nums mt-1">
                      {activeVisasCount}
                    </p>
                  </div>
                </div>

                {/* Seat Occupancy Across Package 1-5 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Ramadan 2027 Seat Occupancy (Packages 1–5)
                  </h2>
                  <div className="space-y-3.5">
                    {RAMADAN_2027_SCHEDULES.map((baseSched) => {
                      const matchingSchedules = db.packages
                        .filter((p) => p.season === 'Ramadan 2027')
                        .flatMap((p) => p.schedules)
                        .filter((s) => s.label === baseSched.label);
                      const seatsTotal =
                        matchingSchedules.reduce((sum, s) => sum + s.seatsTotal, 0) ||
                        baseSched.seatsTotal;
                      const seatsBooked =
                        matchingSchedules.reduce((sum, s) => sum + s.seatsBooked, 0) ||
                        baseSched.seatsBooked;
                      const seatsLeft = Math.max(0, seatsTotal - seatsBooked);
                      const pct = Math.min(100, Math.round((seatsBooked / seatsTotal) * 100));
                      return (
                        <div key={baseSched.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-[#0A224E]">
                              {baseSched.label} · {baseSched.departureRoute} ({baseSched.departureDate})
                            </span>
                            <span className="font-mono tabular-nums text-slate-600">
                              {seatsBooked}/{seatsTotal} seats ({seatsLeft} left)
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0A224E] to-[#D4AF37] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Inquiries Inbox */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-[#0A224E] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C89D28]" />
                      <span>Customer Inquiries ({db.inquiries.length})</span>
                    </h2>
                  </div>
                  {db.inquiries.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No new customer inquiries submitted via the Contact page yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {db.inquiries.map((inq) => (
                        <div key={inq.id} className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-bold text-[#0A224E]">{inq.subject}</span>
                            <span className="font-mono text-slate-500">
                              {new Date(inq.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          <p className="text-slate-600">
                            From: <strong>{inq.name}</strong> ({inq.email} · {inq.phone})
                          </p>
                          <p className="text-slate-700 pt-1">{inq.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'pilgrims' && (
              <div className="space-y-6">
                {lastRegisteredBooking && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#0A224E]">
                          Pilgrim Registered · {lastRegisteredBooking.reference}
                        </p>
                        <p className="text-xs text-slate-700 mt-0.5">
                          {lastRegisteredBooking.customerName} booked on {lastRegisteredBooking.itemTitle} (
                          {lastRegisteredBooking.status} · Paid{' '}
                          <span className="font-mono font-semibold">
                            {formatMoney(lastRegisteredBooking.amountPaidNgn, currency)}
                          </span>
                          )
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptBooking(lastRegisteredBooking)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#0A224E] text-white rounded-xl whitespace-nowrap shrink-0"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#F5B800]" />
                      <span>Print Receipt &amp; E-Ticket</span>
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleRegisterPilgrim}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0A224E] flex items-start sm:items-center gap-2">
                        <UserPlus className="w-4 h-4 text-[#C89D28] shrink-0 mt-1 sm:mt-0" />
                        <span>Walk-In &amp; Group Pilgrim Registration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Register a pilgrim directly from Kano Head Office, assign departure batch seats,
                        record initial deposit, and sync portal + visa intake records.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label htmlFor="pil-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilgrim Full Name (Passport)
                      </label>
                      <input
                        id="pil-name"
                        type="text"
                        required
                        value={pilName}
                        onChange={(e) => setPilName(e.target.value)}
                        placeholder="e.g. Alhaji Yusuf Abdullahi"
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="pil-email"
                        type="email"
                        required
                        value={pilEmail}
                        onChange={(e) => setPilEmail(e.target.value)}
                        placeholder="pilgrim@example.com"
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="pil-phone"
                        type="tel"
                        required
                        value={pilPhone}
                        onChange={(e) => setPilPhone(e.target.value)}
                        placeholder="08035926442"
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-passport" className="block text-xs font-semibold text-slate-700 mb-1">
                        International Passport No.
                      </label>
                      <input
                        id="pil-passport"
                        type="text"
                        required
                        value={pilPassport}
                        onChange={(e) => setPilPassport(e.target.value.toUpperCase())}
                        placeholder="B50294812"
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="pil-gender"
                        value={pilGender}
                        onChange={(e) => setPilGender(e.target.value as 'Male' | 'Female')}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pil-city" className="block text-xs font-semibold text-slate-700 mb-1">
                        State / City
                      </label>
                      <input
                        id="pil-city"
                        type="text"
                        value={pilCity}
                        onChange={(e) => setPilCity(e.target.value)}
                        placeholder="Kano"
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 border-t border-slate-100">
                    <div>
                      <label htmlFor="pil-pkg" className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Package
                      </label>
                      <select
                        id="pil-pkg"
                        value={selectedRegPackage?.id || ''}
                        onChange={(e) => {
                          const nextPkg = db.packages.find((p) => p.id === e.target.value);
                          setPilPackageId(e.target.value);
                          setPilScheduleId(nextPkg?.schedules[0]?.id || '');
                        }}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        {db.packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({formatMoney(p.priceNgn, currency)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pil-sched" className="block text-xs font-semibold text-slate-700 mb-1">
                        Departure Schedule Batch
                      </label>
                      <select
                        id="pil-sched"
                        value={activeRegSchedule?.id || ''}
                        onChange={(e) => setPilScheduleId(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        {regSchedules.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}: {formatDisplayDate(s.departureDate)} ({getSeatsRemaining(s)} left)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pil-count" className="block text-xs font-semibold text-slate-700 mb-1">
                        Number of Pilgrims
                      </label>
                      <input
                        id="pil-count"
                        type="number"
                        min={1}
                        max={20}
                        value={pilCount}
                        onChange={(e) => setPilCount(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-plan" className="block text-xs font-semibold text-slate-700 mb-1">
                        Payment Plan
                      </label>
                      <select
                        id="pil-plan"
                        value={pilPlan}
                        onChange={(e) => setPilPlan(e.target.value as 'Full' | 'Installment')}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Installment">Installment / Deposit</option>
                        <option value="Full">Full Settlement (100%)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pil-deposit" className="block text-xs font-semibold text-slate-700 mb-1">
                        Amount Paid at Desk (NGN ₦)
                      </label>
                      <input
                        id="pil-deposit"
                        type="number"
                        min={0}
                        max={regValidation.totalAmountNgn}
                        disabled={pilPlan === 'Full'}
                        value={pilPlan === 'Full' ? regValidation.totalAmountNgn : pilDeposit}
                        onChange={(e) => setPilDeposit(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl font-mono disabled:bg-slate-100 bg-[#FAF9F6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="pil-channel" className="block text-xs font-semibold text-slate-700 mb-1">
                        Payment Channel
                      </label>
                      <select
                        id="pil-channel"
                        value={pilChannel}
                        onChange={(e) => setPilChannel(e.target.value as PaymentChannel)}
                        className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Offline POS / Cash">Offline POS / Cash (Kano Office)</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Card">Card Payment</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
                    <input
                      type="text"
                      value={pilNotes}
                      onChange={(e) => setPilNotes(e.target.value)}
                      placeholder="Optional desk note (e.g., family room pairing, wheelchair support)"
                      aria-label="Desk registration note"
                      className="w-full px-3 py-2.5 text-sm sm:text-xs border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                    <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pilCreateVisa}
                        onChange={(e) => setPilCreateVisa(e.target.checked)}
                        className="accent-[#0A224E]"
                      />
                      <span>Also open Saudi Umrah Visa intake record</span>
                    </label>
                  </div>

                  <div className="bg-[#FAF9F6] rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-600">
                        Total Value:{' '}
                        <span className="font-mono font-bold text-[#0A224E]">
                          {formatMoney(regValidation.totalAmountNgn, currency)}
                        </span>{' '}
                        · Status:{' '}
                        <span className="font-bold text-emerald-700">{regValidation.status}</span>
                      </p>
                      <p className="text-slate-500 font-mono">
                        Balance after payment:{' '}
                        {formatMoney(
                          Math.max(0, regValidation.totalAmountNgn - regValidation.amountPaidNgn),
                          currency
                        )}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={pilBusy}
                      className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors whitespace-nowrap"
                    >
                      {pilBusy ? 'Registering Pilgrim...' : 'Register Pilgrim & Issue Booking'}
                    </button>
                  </div>
                </form>

                {/* Registered Pilgrims Manifest */}
                <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                  <div className="p-4 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-[#0A224E]">
                      Registered Pilgrims Manifest ({filteredPilgrimManifest.length})
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        value={pilSearch}
                        onChange={(e) => setPilSearch(e.target.value)}
                        placeholder="Search name, ref, passport..."
                        aria-label="Search registered pilgrims"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                  </div>

                  {filteredPilgrimManifest.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No pilgrim bookings matched your search query.
                    </div>
                  ) : (
                    <>
                      <div className="md:hidden divide-y divide-slate-100">
                        {filteredPilgrimManifest.map((b) => (
                          <div key={b.id} className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-[#0A224E]">{b.customerName}</p>
                                <p className="text-xs font-mono text-slate-500">
                                  {b.reference} · {b.passengers[0]?.passportNumber || 'No Passport'}
                                </p>
                              </div>
                              <StatusPill status={b.status} />
                            </div>
                            <p className="text-xs text-slate-600">
                              {b.itemTitle} · {b.scheduleLabel || b.routeOrLocation}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-mono font-semibold text-[#0A224E]">
                                Paid {formatMoney(b.amountPaidNgn, currency)} / {formatMoney(b.totalAmountNgn, currency)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setReceiptBooking(b)}
                                className="px-3 py-1.5 text-xs font-bold bg-[#0A224E] text-white rounded-lg"
                              >
                                Receipt
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-[#FAF9F6] text-slate-600 border-b border-slate-200">
                            <tr>
                              <th className="text-left px-5 py-3 font-bold">Pilgrim &amp; Passport</th>
                              <th className="text-left px-4 py-3 font-bold">Booking Ref</th>
                              <th className="text-left px-4 py-3 font-bold">Package &amp; Batch</th>
                              <th className="text-right px-4 py-3 font-bold">Paid / Total</th>
                              <th className="text-left px-4 py-3 font-bold">Status</th>
                              <th className="text-right px-5 py-3 font-bold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredPilgrimManifest.map((b) => (
                              <tr key={b.id} className="hover:bg-[#FAF9F6]">
                                <td className="px-5 py-3">
                                  <p className="font-bold text-[#0A224E]">{b.customerName}</p>
                                  <p className="text-slate-500 font-mono">
                                    {b.passengers[0]?.passportNumber || 'N/A'} · {b.customerPhone}
                                  </p>
                                </td>
                                <td className="px-4 py-3 font-mono font-semibold text-[#0A224E]">
                                  {b.reference}
                                </td>
                                <td className="px-4 py-3 text-slate-700">
                                  <p className="font-semibold">{b.itemTitle}</p>
                                  <p className="text-[11px] text-slate-500">{b.scheduleLabel || b.routeOrLocation}</p>
                                </td>
                                <td className="px-4 py-3 text-right font-mono tabular-nums">
                                  <span className="font-bold text-emerald-700">
                                    {formatMoney(b.amountPaidNgn, currency)}
                                  </span>
                                  <span className="text-slate-400"> / </span>
                                  <span>{formatMoney(b.totalAmountNgn, currency)}</span>
                                </td>
                                <td className="px-4 py-3">
                                  <StatusPill status={b.status} />
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setReceiptBooking(b)}
                                    className="px-3 py-1.5 text-xs font-bold bg-[#0A224E] text-white rounded-lg"
                                  >
                                    Receipt
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tab === 'packages' && (
              <div className="space-y-6">
                <form
                  onSubmit={handlePublishPackage}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                >
                  <h2 className="font-display text-lg font-bold text-[#0A224E] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#C89D28]" />
                    <span>Publish New Umrah / Hajj / Holiday Package</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="adm-pkg-title" className="block text-xs font-semibold text-slate-700 mb-1">
                        Package Title
                      </label>
                      <input
                        id="adm-pkg-title"
                        type="text"
                        required
                        value={pkgTitle}
                        onChange={(e) => setPkgTitle(e.target.value)}
                        placeholder="e.g. Shawwal Special Umrah 2027"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        id="adm-pkg-cat"
                        value={pkgCategory}
                        onChange={(e) => setPkgCategory(e.target.value as PackageCategory)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Ramadan Umrah">Ramadan Umrah</option>
                        <option value="Regular Umrah">Regular Umrah</option>
                        <option value="Hajj">Hajj</option>
                        <option value="Holiday Package">Holiday Package</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-tier" className="block text-xs font-semibold text-slate-700 mb-1">
                        Tier
                      </label>
                      <select
                        id="adm-pkg-tier"
                        value={pkgTier}
                        onChange={(e) => setPkgTier(e.target.value as PackageTier)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-price" className="block text-xs font-semibold text-slate-700 mb-1">
                        Price (NGN ₦)
                      </label>
                      <input
                        id="adm-pkg-price"
                        type="number"
                        required
                        value={pkgPrice}
                        onChange={(e) => setPkgPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                      />
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-mak" className="block text-xs font-semibold text-slate-700 mb-1">
                        Makkah Hotel
                      </label>
                      <input
                        id="adm-pkg-mak"
                        type="text"
                        value={pkgMakkah}
                        onChange={(e) => setPkgMakkah(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-mad" className="block text-xs font-semibold text-slate-700 mb-1">
                        Madinah Hotel
                      </label>
                      <input
                        id="adm-pkg-mad"
                        type="text"
                        value={pkgMadinah}
                        onChange={(e) => setPkgMadinah(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="adm-pkg-season" className="block text-xs font-semibold text-slate-700 mb-1">
                        Season Label
                      </label>
                      <input
                        id="adm-pkg-season"
                        type="text"
                        value={pkgSeason}
                        onChange={(e) => setPkgSeason(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                    <div>
                      <label htmlFor="adm-pkg-cover" className="block text-xs font-semibold text-slate-700 mb-1">
                        Cover Poster / Image URL
                      </label>
                      <input
                        id="adm-pkg-cover"
                        type="text"
                        value={pkgCover}
                        onChange={(e) => setPkgCover(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={pkgDesc}
                    onChange={(e) => setPkgDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    aria-label="Package description"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                  >
                    Publish Package to Live Site
                  </button>
                </form>

                {/* Active Packages List */}
                <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#0A224E]">
                      Published Packages ({db.packages.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {db.packages.map((p) => (
                      <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[#0A224E]">{p.title}</p>
                          <p className="text-xs text-slate-500">
                            {p.category} · {p.tier} ·{' '}
                            <span className="font-mono font-bold text-[#0A224E]">
                              {formatMoney(p.priceNgn, currency)}
                            </span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deletePackage(p.id)}
                          aria-label={`Delete ${p.title}`}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flight Fare Control */}
                <form
                  onSubmit={handlePublishFlight}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                >
                  <h3 className="font-display text-lg font-bold text-[#0A224E]">
                    Promotional Flight Route &amp; Fare Control
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    <input
                      type="text"
                      value={fltAirline}
                      onChange={(e) => setFltAirline(e.target.value)}
                      placeholder="Airline"
                      aria-label="Airline name"
                      className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6] sm:col-span-2"
                    />
                    <input
                      type="text"
                      value={fltNum}
                      onChange={(e) => setFltNum(e.target.value)}
                      placeholder="Flight No"
                      aria-label="Flight number"
                      className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                    />
                    <input
                      type="text"
                      value={fltOrigin}
                      onChange={(e) => setFltOrigin(e.target.value.toUpperCase())}
                      placeholder="KAN"
                      aria-label="Origin code"
                      className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                    />
                    <input
                      type="text"
                      value={fltDest}
                      onChange={(e) => setFltDest(e.target.value.toUpperCase())}
                      placeholder="JED"
                      aria-label="Destination code"
                      className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                    />
                    <input
                      type="number"
                      value={fltPrice}
                      onChange={(e) => setFltPrice(Number(e.target.value))}
                      placeholder="Price NGN"
                      aria-label="Flight fare in Naira"
                      className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                    />
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-xs text-slate-500">
                      Active routes: {db.flights.length}
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                    >
                      Add Flight Fare
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {db.flights.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs"
                      >
                        <span>
                          {f.airline} ({f.originCode}→{f.destinationCode}) ·{' '}
                          <span className="font-mono font-bold">
                            {formatMoney(f.priceNgn, currency)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteFlight(f.id)}
                          aria-label={`Remove ${f.flightNumber}`}
                          className="text-rose-600 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            )}

            {tab === 'gallery' && (
              <div className="space-y-6">
                <form
                  onSubmit={handlePublishGallery}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                >
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Gallery Media Manager (Photo &amp; Video Uploader)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="gal-title" className="block text-xs font-semibold text-slate-700 mb-1">
                        Media Title
                      </label>
                      <input
                        id="gal-title"
                        type="text"
                        required
                        value={galTitle}
                        onChange={(e) => setGalTitle(e.target.value)}
                        placeholder="e.g. Kano Batch 1 Departure at MAKIA"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                    <div>
                      <label htmlFor="gal-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                        Gallery Category
                      </label>
                      <select
                        id="gal-cat"
                        value={galCat}
                        onChange={(e) => setGalCat(e.target.value as GalleryCategory)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="Makkah & Madinah">Makkah &amp; Madinah</option>
                        <option value="Pilgrim Departures">Pilgrim Departures</option>
                        <option value="Hotels & Ziyarat">Hotels &amp; Ziyarat</option>
                        <option value="Videos & Reels">Videos &amp; Reels</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="gal-type" className="block text-xs font-semibold text-slate-700 mb-1">
                        Media Format
                      </label>
                      <select
                        id="gal-type"
                        value={galType}
                        onChange={(e) => setGalType(e.target.value as 'photo' | 'video')}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      >
                        <option value="photo">Photo / Flyer</option>
                        <option value="video">Video / YouTube / TikTok / Instagram Reel</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="gal-loc" className="block text-xs font-semibold text-slate-700 mb-1">
                        Location
                      </label>
                      <input
                        id="gal-loc"
                        type="text"
                        value={galLocation}
                        onChange={(e) => setGalLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label htmlFor="gal-url" className="block text-xs font-semibold text-slate-700 mb-1">
                        Image / Video URL (or upload file beside)
                      </label>
                      <input
                        id="gal-url"
                        type="text"
                        required
                        value={galUrl}
                        onChange={(e) => setGalUrl(e.target.value)}
                        placeholder="https://youtube.com/... or /assets/..."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                      />
                    </div>
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold border border-dashed border-[#0A224E] rounded-xl bg-[#FAF9F6] hover:bg-slate-100 cursor-pointer text-[#0A224E]">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo or MP4/WebM Video File</span>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        onChange={handleGalleryFileUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={galCaption}
                    onChange={(e) => setGalCaption(e.target.value)}
                    placeholder="Caption describing this photo or reel..."
                    aria-label="Media caption"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={galFeatured}
                        onChange={(e) => setGalFeatured(e.target.checked)}
                        className="accent-[#0A224E]"
                      />
                      <span>Feature in Home Page Gallery Preview</span>
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                    >
                      Publish to Public Gallery
                    </button>
                  </div>
                </form>

                {/* Gallery Items Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {db.gallery.map((g) => (
                    <div key={g.id} className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col shadow-xs">
                      <div className="h-36 bg-slate-100">
                        {g.mediaType === 'photo' ? (
                          <SafeImage src={g.url} alt={g.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#0A224E] text-white flex items-center justify-center text-xs font-semibold p-4 text-center">
                            Video Reel: {g.title}
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0A224E] line-clamp-1">{g.title}</p>
                          <p className="text-[11px] text-slate-500">{g.category}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() =>
                              updateGalleryItem(g.id, { featuredOnHome: !g.featuredOnHome })
                            }
                            className={`text-[11px] font-bold ${
                              g.featuredOnHome ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                          >
                            {g.featuredOnHome ? '✓ Featured' : 'Feature on Home'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteGalleryItem(g.id)}
                            aria-label={`Delete ${g.title}`}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Bookings &amp; Simulated Payment Ledger
                  </h2>
                </div>
                {db.bookings.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No bookings recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {db.bookings.map((b) => {
                      const rem = Math.max(0, b.totalAmountNgn - b.amountPaidNgn);
                      return (
                        <div key={b.id} className="p-5 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-mono text-slate-500">
                                  {b.reference} · {b.customerName} ({b.customerPhone})
                                </p>
                                <StatusPill status={b.status} />
                              </div>
                              <h3 className="text-sm font-bold text-[#0A224E] mt-1">{b.itemTitle}</h3>
                              <p className="text-xs text-slate-600">
                                Paid:{' '}
                                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                                  {formatMoney(b.amountPaidNgn, currency)}
                                </span>{' '}
                                / Total:{' '}
                                <span className="font-mono font-semibold tabular-nums">
                                  {formatMoney(b.totalAmountNgn, currency)}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                aria-label={`Status for ${b.reference}`}
                                value={b.status}
                                onChange={(e) =>
                                  updateBookingStatus(b.id, e.target.value as BookingStatus)
                                }
                                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-[#FAF9F6]"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Part-Paid">Part-Paid</option>
                                <option value="Pending Transfer">Pending Transfer</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {rem > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-slate-200/80">
                              <input
                                type="number"
                                min={1000}
                                max={rem}
                                placeholder={`Offline deposit (max ${rem})`}
                                value={offlineAmountByBooking[b.id] || ''}
                                onChange={(e) =>
                                  setOfflineAmountByBooking((prev) => ({
                                    ...prev,
                                    [b.id]: Math.max(0, Number(e.target.value)),
                                  }))
                                }
                                className="px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-white w-full sm:w-48"
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  const amount =
                                    offlineAmountByBooking[b.id] || Math.min(500000, rem);
                                  if (amount <= 0) {
                                    notify('Enter an amount greater than zero.', 'error');
                                    return;
                                  }
                                  const res = await payInstallment(
                                    b.id,
                                    amount,
                                    'Offline POS / Cash',
                                    'Recorded at Kano Head Office'
                                  );
                                  if (res) {
                                    setOfflineAmountByBooking((prev) => {
                                      const next = { ...prev };
                                      delete next[b.id];
                                      return next;
                                    });
                                  }
                                }}
                                className="px-4 py-2 text-xs font-bold bg-[#0A224E] text-white rounded-xl w-full sm:w-auto"
                              >
                                Record Offline POS / Cash Payment
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'visas' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Visa Processing Queue
                  </h2>
                </div>
                {db.visas.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No visa applications in the queue.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {db.visas.map((v) => (
                      <div key={v.id} className="p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-mono text-slate-500">
                                Passport {v.passportNumber} · {v.applicantPhone}
                              </p>
                              <StatusPill status={v.stage} />
                            </div>
                            <h3 className="text-sm font-bold text-[#0A224E] mt-1">
                              {v.applicantName} — {v.country} ({v.category})
                            </h3>
                            <p className="text-xs text-slate-600">
                              Uploaded Documents: {v.documents.length} file(s)
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              aria-label={`Visa stage for ${v.applicantName}`}
                              value={v.stage}
                              onChange={(e) =>
                                updateVisaApplication(v.id, {
                                  stage: e.target.value as VisaStage,
                                  issuedVisaUrl:
                                    e.target.value === 'Visa Approved & Issued'
                                      ? v.issuedVisaUrl || BRAND_IMAGES.makkahHaram
                                      : v.issuedVisaUrl,
                                })
                              }
                              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-[#FAF9F6]"
                            >
                              <option value="Pending Review">Pending Review</option>
                              <option value="Processing at Embassy">Processing at Embassy</option>
                              <option value="Visa Approved & Issued">Visa Approved &amp; Issued</option>
                              <option value="Re-upload Requested">Re-upload Requested</option>
                            </select>
                          </div>
                        </div>

                        {v.documents.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {v.documents.map((doc) => (
                              <span
                                key={doc.type}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF9F6] text-slate-700 border border-slate-200"
                              >
                                {doc.type}: {doc.fileName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'escorts' && (
              <div className="space-y-6">
                <form
                  onSubmit={handlePublishEscort}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                >
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Add Pilgrimage Escort
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={escName}
                      onChange={(e) => setEscName(e.target.value)}
                      placeholder="Escort Full Name"
                      aria-label="Escort Full Name"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    />
                    <input
                      type="text"
                      value={escRole}
                      onChange={(e) => setEscRole(e.target.value)}
                      placeholder="Role / Title"
                      aria-label="Escort Role"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    />
                    <input
                      type="tel"
                      required
                      value={escPhone}
                      onChange={(e) => setEscPhone(e.target.value)}
                      placeholder="Phone Number"
                      aria-label="Escort Phone"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono bg-[#FAF9F6]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                  >
                    Add Escort to Roster
                  </button>
                </form>

                <form
                  onSubmit={handlePublishNotice}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs"
                >
                  <h2 className="font-display text-lg font-bold text-[#0A224E]">
                    Publish Official Notice
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={notTitle}
                      onChange={(e) => setNotTitle(e.target.value)}
                      placeholder="Notice Title"
                      aria-label="Notice Title"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    />
                    <input
                      type="text"
                      value={notDate}
                      onChange={(e) => setNotDate(e.target.value)}
                      placeholder="Date"
                      aria-label="Notice Date"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    />
                    <input
                      type="text"
                      value={notTime}
                      onChange={(e) => setNotTime(e.target.value)}
                      placeholder="Time"
                      aria-label="Notice Time"
                      className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    />
                  </div>
                  <input
                    type="text"
                    value={notVenue}
                    onChange={(e) => setNotVenue(e.target.value)}
                    placeholder="Venue"
                    aria-label="Notice Venue"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                  />
                  <textarea
                    rows={2}
                    required
                    value={notMsg}
                    onChange={(e) => setNotMsg(e.target.value)}
                    placeholder="Official notice message..."
                    aria-label="Official notice message"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-[#FAF9F6]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                  >
                    Publish Notice
                  </button>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    {db.notices.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-slate-200 text-xs"
                      >
                        <span>
                          <strong className="text-[#0A224E]">{n.title}</strong> · {n.dateLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteNotice(n.id)}
                          aria-label={`Delete notice ${n.title}`}
                          className="text-rose-600 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
