# Sidi Travel & Tours Ltd.

Online Travel Agency and Hajj & Umrah booking platform for **Sidi Travel & Tours Ltd.** (Zoo Road, Kano State, Nigeria).

## Features

- **4-Tab Travel Search Engine**: Search Flights, Ramadan 2027 & Regular Umrah/Hajj packages, Makkah & Madinah hotels, and Visa Assistance services.
- **Ramadan 2027 Batch Booking & Installments**: Book Economy, Luxury, and Premium VIP tiers across 5 Kano departure schedules with **Pay Small Small** NGN/USD installment locking.
- **Interactive Checkout & E-Tickets**: Simulated Card (OTP), Virtual Bank Transfer, and USSD channels with printable official receipts (`SIDI-2027-XXXX`).
- **Pilgrim Portal (`/dashboard`)**: Departure countdown, installment wallet, Visa & Document Vault uploads, escort details, and official notices.
- **Admin Operations Console (`/admin`)**: Executive analytics, walk-in pilgrim registration, package & flight fare CMS, gallery media manager, offline POS/cash ledger, visa processing queue, and notice board management.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Express 4 (`server/app.ts`) running via `server.ts` locally and `api/index.ts` as a Vercel Serverless Function

## Getting Started Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Express + Vite dev server on `http://localhost:3000` |
| `npm run build` | Build production frontend bundle to `dist/` |
| `npm run start` | Run Express server in production mode serving `dist/` |
| `npm run lint` | Run TypeScript typecheck (`tsc --noEmit`) |
| `npm test` | Run unit tests (`tsx --test src/utils/travelLogic.test.ts`) |

### Demo Accounts

- **Pilgrim Portal**: `user@siditravel.com` (or use 1-Click Pilgrim Demo in Login / Dashboard)
- **Admin Console**: `admin@siditravel.com` (or use 1-Click Admin Demo in Login / Admin)

## Deploying to Vercel

This repository is preconfigured for Vercel via `vercel.json`, `api/index.ts`, and `server/`:

1. Push this repository to GitHub.
2. Import the repository in **Vercel** (`Framework Preset: Vite` — automatically picked up from `vercel.json`).
3. Click **Deploy**.
   - Static frontend assets build to `dist/` (`npm run build`).
   - All `/api/*` endpoints route to the Express serverless handler in `api/index.ts`, seeded from `.data/sidi-db.json` with ephemeral `/tmp/sidi-db.json` persistence on warm serverless instances.
   - All SPA routes (`/umrah-packages`, `/flights`, `/hotels`, `/dashboard`, `/admin`, etc.) rewrite cleanly to `/index.html`.
