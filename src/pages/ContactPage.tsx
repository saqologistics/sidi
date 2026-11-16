import React, { useState } from 'react';
import { CheckCircle2, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BRAND_CONTACT } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { IslamicGeometricBackdrop } from '../components/BrandVisuals';

export function ContactPage() {
  const { submitInquiry } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Ramadan 2027 Umrah Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submitInquiry({ name, email, phone, subject, message });
    if (ok) {
      setSent(true);
      setMessage('');
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
            Visit Our Kano Head Office or Reach Us Online
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
            Contact Sidi Travel &amp; Tours Ltd.
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Office Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
              <h2 className="font-display text-xl font-bold text-[#0A224E]">Kano Head Office</h2>
              <p className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#C89D28] shrink-0 mt-1" />
                <span>{BRAND_CONTACT.address}</span>
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Official Phone Lines
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
                  {BRAND_CONTACT.phones.map((ph) => (
                    <a
                      key={ph}
                      href={`tel:${ph}`}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-[#0A224E] hover:border-[#D4AF37] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C89D28]" />
                      <span>{ph}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
                <a
                  href={`mailto:${BRAND_CONTACT.email}`}
                  className="flex items-center gap-2 text-[#0A224E] font-medium hover:underline"
                >
                  <Mail className="w-4 h-4 text-[#C89D28]" />
                  <span>{BRAND_CONTACT.email}</span>
                </a>
                <p className="text-xs text-slate-600">
                  Instagram: <span className="font-semibold text-[#0A224E]">{BRAND_CONTACT.instagram}</span> · TikTok:{' '}
                  <span className="font-semibold text-[#0A224E]">{BRAND_CONTACT.tiktok}</span>
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`https://wa.me/${BRAND_CONTACT.whatsappPrimary}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 08035926442</span>
                </a>
                <a
                  href={`https://wa.me/${BRAND_CONTACT.whatsappSecondary}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#F5B800]" />
                  <span>WhatsApp 07063239860</span>
                </a>
              </div>
            </div>

            {/* Kano Location Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#0A224E]">
                  Zoo Road, Opposite Ado Bayero Mall, Kano
                </span>
                <a
                  href="https://maps.google.com/?q=Ado+Bayero+Mall+Zoo+Road+Kano+Nigeria"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0F2C67] hover:underline whitespace-nowrap"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative h-56 bg-[#05122B] text-white p-6 flex flex-col justify-between overflow-hidden">
                <IslamicGeometricBackdrop className="opacity-45" />
                <div className="space-y-1 z-10">
                  <span className="text-[11px] font-mono text-[#F5B800]">11.9647° N, 8.5326° E</span>
                  <h3 className="font-display text-xl font-bold">Shopping Complex Plaza</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Opposite Ado Bayero Mall (Shoprite), Zoo Road, Kano State, Nigeria
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200 z-10 bg-white/10 border border-white/15 px-3 py-2 rounded-xl backdrop-blur-xs self-start">
                  <MapPin className="w-4 h-4 text-[#F5B800]" />
                  <span>Open Monday – Saturday · 9:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                  Message Sent Successfully
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for contacting Sidi Travel &amp; Tours Ltd. A travel consultant at our
                  Zoo Road Kano office will reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-5 py-2.5 text-xs font-bold bg-[#0A224E] text-white rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-[#0A224E] pb-3 border-b border-slate-100">
                  Send an Inquiry or Group Quote Request
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-subj" className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      id="c-subj"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6]"
                    >
                      <option value="Ramadan 2027 Umrah Inquiry">Ramadan 2027 Umrah Inquiry</option>
                      <option value="Group / Family Booking">Group / Family Booking</option>
                      <option value="Flight Ticketing Quote">Flight Ticketing Quote</option>
                      <option value="Visa Processing Support">Visa Processing Support</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="c-msg" className="block text-xs font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="c-msg"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share preferred travel dates, number of pilgrims/travelers, or tier preference..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-[#FAF9F6] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold bg-[#0A224E] hover:bg-[#102F6A] text-white rounded-xl transition-colors shadow-xs"
                >
                  Send Inquiry to Kano Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
