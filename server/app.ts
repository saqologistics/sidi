import express from 'express';
import type {
  AppDatabase,
  BookingRecord,
  ContactInquiry,
  EscortMember,
  FlightOffer,
  GalleryItem,
  OfficialNotice,
  PaymentChannel,
  UmrahPackage,
  VisaApplication,
  VisaStage,
} from '../src/types/travel';
import {
  generateBookingReference,
  validateAdminPilgrimRegistration,
} from '../src/utils/travelLogic';
import { loadDatabase, saveDatabase } from './db';

export function createApiApp() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  let db: AppDatabase = loadDatabase();

  const router = express.Router();

  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      environment: process.env.VERCEL ? 'vercel' : 'node',
      counts: {
        packages: db.packages.length,
        flights: db.flights.length,
        bookings: db.bookings.length,
        visas: db.visas.length,
      },
    });
  });

  // Bootstrap full application state
  router.get('/bootstrap', (_req, res) => {
    res.json(db);
  });

  // Auth endpoints (demo & registration)
  router.post('/auth/login', (req, res) => {
    const { email } = req.body as { email?: string };
    const normalized = (email || '').trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalized);
    if (!user) {
      res.status(404).json({ error: 'Account not found. Please register or use a demo quick login.' });
      return;
    }
    res.json({ user });
  });

  router.post('/auth/register', (req, res) => {
    const { name, email, phone, city } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
    };
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      res.status(400).json({ error: 'Name, email, and phone number are required.' });
      return;
    }
    const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      res.json({ user: existing });
      return;
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'user' as const,
      city: city?.trim() || 'Kano',
    };
    db.users.push(newUser);
    saveDatabase(db);
    res.status(201).json({ user: newUser });
  });

  // Packages CRUD
  router.post('/packages', (req, res) => {
    const pkg = req.body as Omit<UmrahPackage, 'id'>;
    if (!pkg.title?.trim() || !Number.isFinite(Number(pkg.priceNgn)) || Number(pkg.priceNgn) <= 0) {
      res.status(400).json({ error: 'Package title and a valid positive price are required.' });
      return;
    }
    const created: UmrahPackage = {
      ...pkg,
      priceNgn: Math.round(Number(pkg.priceNgn)),
      id: `pkg-${Date.now()}`,
    };
    db.packages.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.put('/packages/:id', (req, res) => {
    const idx = db.packages.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Package not found.' });
      return;
    }
    db.packages[idx] = { ...db.packages[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.packages[idx]);
  });

  router.delete('/packages/:id', (req, res) => {
    db.packages = db.packages.filter((p) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Flights CRUD
  router.post('/flights', (req, res) => {
    const flight = req.body as Omit<FlightOffer, 'id'>;
    if (!flight.airline?.trim() || !flight.originCode?.trim() || !flight.destinationCode?.trim()) {
      res.status(400).json({ error: 'Airline, origin, and destination are required.' });
      return;
    }
    if (flight.originCode.trim().toUpperCase() === flight.destinationCode.trim().toUpperCase()) {
      res.status(400).json({ error: 'Origin and destination airport codes must be different.' });
      return;
    }
    if (!Number.isFinite(Number(flight.priceNgn)) || Number(flight.priceNgn) <= 0) {
      res.status(400).json({ error: 'Flight price must be greater than zero.' });
      return;
    }
    const created: FlightOffer = {
      ...flight,
      priceNgn: Math.round(Number(flight.priceNgn)),
      id: `flt-${Date.now()}`,
    };
    db.flights.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.delete('/flights/:id', (req, res) => {
    db.flights = db.flights.filter((f) => f.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Bookings & Payments
  router.post('/bookings', (req, res) => {
    const payload = req.body as {
      userId: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      bookingType: BookingRecord['bookingType'];
      itemId: string;
      itemTitle: string;
      tierOrCabin: string;
      scheduleLabel?: string;
      scheduleId?: string;
      departureDate: string;
      returnDate?: string;
      routeOrLocation: string;
      passengersCount: number;
      passengers: BookingRecord['passengers'];
      totalAmountNgn: number;
      initialPaymentNgn: number;
      paymentPlan: 'Full' | 'Installment';
      channel: PaymentChannel;
      hotelSummary?: string;
    };

    if (!payload.customerName?.trim() || !payload.customerEmail?.trim() || !payload.totalAmountNgn || payload.totalAmountNgn <= 0) {
      res.status(400).json({ error: 'Customer details and valid booking total are required.' });
      return;
    }

    const safePassengersCount = Math.max(1, Math.floor(Number(payload.passengersCount) || 1));
    const paid = Math.min(payload.totalAmountNgn, Math.max(0, Number(payload.initialPaymentNgn) || 0));
    const status =
      paid >= payload.totalAmountNgn
        ? 'Confirmed'
        : paid > 0
          ? 'Part-Paid'
          : 'Pending Transfer';

    let escortName = 'Ustaz Abdullahi Sidi';
    let escortPhone = '08035926442';
    if (payload.scheduleId) {
      for (const pkg of db.packages) {
        const sched = pkg.schedules.find((s) => s.id === payload.scheduleId);
        if (sched) {
          sched.seatsBooked = Math.min(
            sched.seatsTotal,
            sched.seatsBooked + safePassengersCount
          );
          const esc = db.escorts.find((e) => e.id === sched.escortId);
          if (esc) {
            escortName = esc.name;
            escortPhone = esc.phone;
          }
          break;
        }
      }
    }

    if (payload.bookingType === 'Flight' && payload.itemId) {
      const flt = db.flights.find((f) => f.id === payload.itemId);
      if (flt) {
        flt.seatsAvailable = Math.max(1, flt.seatsAvailable - safePassengersCount);
      }
    }

    const reference = generateBookingReference(Date.now());
    const booking: BookingRecord = {
      id: `bkg-${Date.now()}`,
      reference,
      userId: payload.userId || 'guest',
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim().toLowerCase(),
      customerPhone: payload.customerPhone?.trim() || '',
      bookingType: payload.bookingType,
      itemId: payload.itemId,
      itemTitle: payload.itemTitle,
      tierOrCabin: payload.tierOrCabin,
      scheduleLabel: payload.scheduleLabel,
      departureDate: payload.departureDate,
      returnDate: payload.returnDate,
      routeOrLocation: payload.routeOrLocation,
      passengersCount: safePassengersCount,
      passengers: payload.passengers || [],
      totalAmountNgn: payload.totalAmountNgn,
      amountPaidNgn: paid,
      paymentPlan: payload.paymentPlan,
      status,
      escortName,
      escortPhone,
      hotelSummary: payload.hotelSummary,
      transactions:
        paid > 0
          ? [
              {
                id: `txn-${Date.now()}`,
                reference: `PAY-${reference}`,
                amountNgn: paid,
                channel: payload.channel,
                status: 'Verified',
                paidAt: new Date().toISOString(),
                note: payload.paymentPlan === 'Full' ? 'Full settlement' : 'Installment initial deposit',
              },
            ]
          : [],
      createdAt: new Date().toISOString(),
    };

    db.bookings.unshift(booking);
    saveDatabase(db);
    res.status(201).json(booking);
  });

  // Admin Desk Pilgrim Registration
  router.post('/admin/register-pilgrim', (req, res) => {
    const payload = req.body as {
      fullName: string;
      email: string;
      phone: string;
      city?: string;
      gender: 'Male' | 'Female';
      passportNumber: string;
      packageId: string;
      scheduleId?: string;
      pilgrimsCount?: number;
      paymentPlan: 'Full' | 'Installment';
      initialPaymentNgn: number;
      channel: PaymentChannel;
      createVisaRecord?: boolean;
      notes?: string;
    };

    const pkg = db.packages.find((p) => p.id === payload.packageId) || db.packages[0];
    if (!pkg) {
      res.status(404).json({ error: 'Selected package not found.' });
      return;
    }

    const sched =
      pkg.schedules.find((s) => s.id === payload.scheduleId) || pkg.schedules[0];
    const count = Math.max(1, Math.floor(Number(payload.pilgrimsCount) || 1));

    const check = validateAdminPilgrimRegistration({
      fullName: payload.fullName || '',
      email: payload.email || '',
      phone: payload.phone || '',
      passportNumber: payload.passportNumber || '',
      packagePriceNgn: pkg.priceNgn,
      pilgrimsCount: count,
      paymentPlan: payload.paymentPlan || 'Installment',
      initialPaymentNgn: Number(payload.initialPaymentNgn) || 0,
    });

    if (!check.isValid) {
      res.status(400).json({ error: check.error || 'Invalid pilgrim registration details.' });
      return;
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: payload.fullName.trim(),
        email: normalizedEmail,
        phone: payload.phone.trim(),
        role: 'user',
        city: payload.city?.trim() || 'Kano',
      };
      db.users.push(user);
    }

    let escortName = 'Ustaz Abdullahi Sidi';
    let escortPhone = '08035926442';
    if (sched) {
      sched.seatsBooked = Math.min(sched.seatsTotal, sched.seatsBooked + count);
      const esc = db.escorts.find((e) => e.id === sched.escortId);
      if (esc) {
        escortName = esc.name;
        escortPhone = esc.phone;
      }
    }

    const reference = generateBookingReference(Date.now());
    const booking: BookingRecord = {
      id: `bkg-${Date.now()}`,
      reference,
      userId: user.id,
      customerName: payload.fullName.trim(),
      customerEmail: normalizedEmail,
      customerPhone: payload.phone.trim(),
      bookingType: 'Umrah Package',
      itemId: pkg.id,
      itemTitle: pkg.title,
      tierOrCabin: `${pkg.tier} (${pkg.hotelRating})`,
      scheduleLabel: sched
        ? `${sched.label} (${sched.departureDate} – ${sched.returnDate})`
        : 'Assigned Desk Schedule',
      departureDate: sched?.departureDate || '2027-02-08',
      returnDate: sched?.returnDate || '2027-03-06',
      routeOrLocation: sched ? `${sched.departureRoute} · ${sched.returnRoute}` : 'Kano → Jeddah',
      passengersCount: count,
      passengers: [
        {
          fullName: payload.fullName.trim(),
          passportNumber: payload.passportNumber.trim().toUpperCase(),
          gender: payload.gender || 'Male',
        },
      ],
      totalAmountNgn: check.totalAmountNgn,
      amountPaidNgn: check.amountPaidNgn,
      paymentPlan: payload.paymentPlan || 'Installment',
      status: check.status,
      escortName,
      escortPhone,
      hotelSummary: `${pkg.makkahHotel} & ${pkg.madinahHotel}`,
      transactions:
        check.amountPaidNgn > 0
          ? [
              {
                id: `txn-${Date.now()}`,
                reference: `PAY-${reference}`,
                amountNgn: check.amountPaidNgn,
                channel: payload.channel || 'Offline POS / Cash',
                status: 'Verified',
                paidAt: new Date().toISOString(),
                note: payload.notes?.trim() || 'Admin Desk Pilgrim Registration',
              },
            ]
          : [],
      createdAt: new Date().toISOString(),
    };
    db.bookings.unshift(booking);

    let visa: VisaApplication | null = null;
    if (payload.createVisaRecord !== false) {
      visa = {
        id: `visa-${Date.now()}`,
        userId: user.id,
        applicantName: payload.fullName.trim(),
        applicantEmail: normalizedEmail,
        applicantPhone: payload.phone.trim(),
        country: 'Saudi Arabia',
        category: 'Umrah Visa',
        processingSpeed: 'Standard (5-7 Days)',
        passportNumber: payload.passportNumber.trim().toUpperCase(),
        stage: 'Pending Review',
        notes: payload.notes?.trim() || `Registered via Admin Desk (${reference})`,
        documents: [],
        updatedAt: new Date().toISOString(),
      };
      db.visas.unshift(visa);
    }

    saveDatabase(db);
    res.status(201).json({ user, booking, visa });
  });

  router.post('/bookings/:id/pay', (req, res) => {
    const booking = db.bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    const { amountNgn, channel, note } = req.body as {
      amountNgn: number;
      channel: PaymentChannel;
      note?: string;
    };
    const remaining = Math.max(0, booking.totalAmountNgn - booking.amountPaidNgn);
    const applied = Math.min(remaining, Math.max(0, Number(amountNgn) || 0));
    if (applied <= 0) {
      res.status(400).json({ error: 'Payment amount must be greater than zero.' });
      return;
    }

    booking.amountPaidNgn += applied;
    booking.status = booking.amountPaidNgn >= booking.totalAmountNgn ? 'Confirmed' : 'Part-Paid';
    booking.transactions.push({
      id: `txn-${Date.now()}`,
      reference: `PAY-${booking.reference}-${booking.transactions.length + 1}`,
      amountNgn: applied,
      channel: channel || 'Card',
      status: 'Verified',
      paidAt: new Date().toISOString(),
      note: note || 'Installment top-up payment',
    });

    saveDatabase(db);
    res.json(booking);
  });

  router.patch('/bookings/:id/status', (req, res) => {
    const booking = db.bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    const { status } = req.body as { status: BookingRecord['status'] };
    booking.status = status;
    saveDatabase(db);
    res.json(booking);
  });

  // Gallery CRUD
  router.post('/gallery', (req, res) => {
    const item = req.body as Omit<GalleryItem, 'id'>;
    if (!item.title || !item.url) {
      res.status(400).json({ error: 'Media title and image/video source are required.' });
      return;
    }
    const created: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: item.date || new Date().toISOString().slice(0, 10),
    };
    db.gallery.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.patch('/gallery/:id', (req, res) => {
    const idx = db.gallery.findIndex((g) => g.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Gallery item not found.' });
      return;
    }
    db.gallery[idx] = { ...db.gallery[idx], ...req.body };
    saveDatabase(db);
    res.json(db.gallery[idx]);
  });

  router.delete('/gallery/:id', (req, res) => {
    db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Visa Applications & Document Vault
  router.post('/visas', (req, res) => {
    const payload = req.body as Omit<VisaApplication, 'id' | 'stage' | 'updatedAt'>;
    if (!payload.applicantName || !payload.passportNumber || !payload.country) {
      res.status(400).json({ error: 'Applicant name, country, and passport number are required.' });
      return;
    }
    const created: VisaApplication = {
      ...payload,
      id: `visa-${Date.now()}`,
      stage: 'Pending Review',
      documents: payload.documents || [],
      updatedAt: new Date().toISOString(),
    };
    db.visas.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.patch('/visas/:id', (req, res) => {
    const visa = db.visas.find((v) => v.id === req.params.id);
    if (!visa) {
      res.status(404).json({ error: 'Visa application not found.' });
      return;
    }
    const { stage, notes, issuedVisaUrl, document } = req.body as {
      stage?: VisaStage;
      notes?: string;
      issuedVisaUrl?: string;
      document?: VisaApplication['documents'][number];
    };
    if (stage) visa.stage = stage;
    if (notes !== undefined) visa.notes = notes;
    if (issuedVisaUrl !== undefined) visa.issuedVisaUrl = issuedVisaUrl;
    if (document) {
      const existingIdx = visa.documents.findIndex((d) => d.type === document.type);
      if (existingIdx >= 0) {
        visa.documents[existingIdx] = document;
      } else {
        visa.documents.push(document);
      }
    }
    visa.updatedAt = new Date().toISOString();
    saveDatabase(db);
    res.json(visa);
  });

  // Escorts & Notices
  router.post('/escorts', (req, res) => {
    const escort = req.body as Omit<EscortMember, 'id'>;
    if (!escort.name || !escort.phone) {
      res.status(400).json({ error: 'Escort name and phone are required.' });
      return;
    }
    const created: EscortMember = { ...escort, id: `esc-${Date.now()}` };
    db.escorts.push(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.post('/notices', (req, res) => {
    const notice = req.body as Omit<OfficialNotice, 'id' | 'createdAt'>;
    if (!notice.title || !notice.message) {
      res.status(400).json({ error: 'Notice title and message are required.' });
      return;
    }
    const created: OfficialNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.notices.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  router.delete('/notices/:id', (req, res) => {
    db.notices = db.notices.filter((n) => n.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  // Contact Inquiries
  router.post('/inquiries', (req, res) => {
    const inquiry = req.body as Omit<ContactInquiry, 'id' | 'createdAt'>;
    if (!inquiry.name || !inquiry.email || !inquiry.message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    const created: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.inquiries.unshift(created);
    saveDatabase(db);
    res.status(201).json(created);
  });

  app.use('/api', router);
  return app;
}
