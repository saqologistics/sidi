import React from 'react';
import { MotionConfig } from 'motion/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PackageDetailModal } from './components/PackageDetailModal';
import { ReceiptModal } from './components/ReceiptModal';
import { HomePage } from './pages/HomePage';
import { UmrahPackagesPage } from './pages/UmrahPackagesPage';
import { FlightsPage } from './pages/FlightsPage';
import { HotelsPage } from './pages/HotelsPage';
import { VisaServicesPage } from './pages/VisaServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppShell() {
  const { route, navigate, toast } = useApp();

  const renderPage = () => {
    switch (route) {
      case '/':
        return <HomePage />;
      case '/umrah-packages':
        return <UmrahPackagesPage />;
      case '/flights':
        return <FlightsPage />;
      case '/hotels':
        return <HotelsPage />;
      case '/visa-services':
        return <VisaServicesPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/dashboard':
        return <UserDashboardPage />;
      case '/admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{renderPage()}</main>
      <Footer />

      {/* Mobile Compact Sticky Quick-Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#05122B]/95 backdrop-blur-md text-white border-t border-[#D4AF37]/40 px-4 h-14 flex items-center justify-between gap-3 no-print shadow-[0_-8px_24px_rgba(5,18,43,0.3)]">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-300 leading-none">
            Ramadan 2027 Umrah
          </p>
          <p className="text-xs font-semibold text-white truncate mt-0.5">
            From <strong className="text-[#F5B800] font-mono">₦4.7M</strong> · Installments
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/umrah-packages')}
          className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] rounded-lg whitespace-nowrap shrink-0 shadow-xs"
        >
          Book Now
        </button>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-18 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 px-4 py-3.5 rounded-xl shadow-2xl text-xs font-semibold border flex items-center gap-2.5 no-print backdrop-blur-md ${
            toast.tone === 'error'
              ? 'bg-rose-950/95 text-white border-rose-500/60'
              : toast.tone === 'success'
                ? 'bg-[#05122B]/95 text-white border-[#D4AF37]/70'
                : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {toast.tone === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
          ) : toast.tone === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#F5B800] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <AuthModal />
      <PackageDetailModal />
      <ReceiptModal />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AppShell />
      </AppProvider>
    </MotionConfig>
  );
}
