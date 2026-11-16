import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Film, MapPin, Play, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { GalleryCategory, GalleryItem } from '../types/travel';
import { IslamicGeometricBackdrop, SafeImage } from '../components/BrandVisuals';

const TABS: ('All Media' | GalleryCategory)[] = [
  'All Media',
  'Makkah & Madinah',
  'Pilgrim Departures',
  'Hotels & Ziyarat',
  'Videos & Reels',
];

function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function GalleryPage() {
  const { db } = useApp();
  const [activeTab, setActiveTab] = useState<'All Media' | GalleryCategory>('All Media');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  const items = useMemo(() => {
    if (activeTab === 'All Media') return db.gallery;
    return db.gallery.filter((g) => g.category === activeTab);
  }, [db.gallery, activeTab]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <div className="relative bg-[#05122B] text-white py-11 border-b border-[#D4AF37]/30 overflow-hidden">
        <IslamicGeometricBackdrop className="opacity-35" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5B800]">
              Sidi Travel &amp; Tours Media Archive
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1.5">
              Photo &amp; Video Gallery
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Explore verified photography from Makkah &amp; Madinah, Saudi Airlines operations,
              Haramain luxury suites, and curated journey reels.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/15 overflow-x-auto max-w-full shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] shadow-xs'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <p className="text-sm font-bold text-[#0A224E]">
              No media items in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="text-left group bg-white rounded-2xl border border-slate-200/90 overflow-hidden sidi-card-hover flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden w-full">
                  {item.mediaType === 'video' ? (
                    item.url.startsWith('data:video') || item.url.endsWith('.mp4') || item.url.endsWith('.webm') ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-90"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#05122B] to-[#102F6A] flex flex-col items-center justify-center p-6 text-white text-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5B800] text-[#05122B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-lg">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F5B800]">
                          Video Reel
                        </span>
                        <span className="text-sm font-medium mt-1 line-clamp-2">{item.title}</span>
                      </div>
                    )
                  ) : (
                    <SafeImage
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackTitle={item.title}
                    />
                  )}
                </div>

                <div className="p-5 space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#9A7412]">{item.category}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <h2 className="text-base font-bold text-[#0A224E]">{item.title}</h2>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.caption}</p>
                  <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C89D28]" />
                    <span>{item.location}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox & Video Player */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122B]/85 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0A224E] text-white">
              <div className="flex items-center gap-2 min-w-0">
                {selectedItem.mediaType === 'video' && <Film className="w-4 h-4 text-[#F5B800] shrink-0" />}
                <h3 id="lightbox-title" className="text-sm font-bold truncate">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close media viewer"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 flex items-center justify-center max-h-[65vh] overflow-hidden">
              {selectedItem.mediaType === 'photo' ? (
                <SafeImage
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="max-h-[65vh] w-auto object-contain"
                  fallbackTitle={selectedItem.title}
                />
              ) : getYoutubeEmbedUrl(selectedItem.url) ? (
                <iframe
                  src={getYoutubeEmbedUrl(selectedItem.url)!}
                  title={selectedItem.title}
                  className="w-full aspect-video"
                  allowFullScreen
                />
              ) : selectedItem.url.startsWith('data:video') ||
                selectedItem.url.endsWith('.mp4') ||
                selectedItem.url.endsWith('.webm') ? (
                <video src={selectedItem.url} controls autoPlay className="w-full max-h-[65vh]" />
              ) : (
                <div className="p-10 text-center text-white space-y-4">
                  <Film className="w-12 h-12 text-[#F5B800] mx-auto" />
                  <p className="text-base font-semibold">{selectedItem.title}</p>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Social Reel hosted on Sidi Travel &amp; Tours official channel.
                  </p>
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#D4AF37] text-[#05122B] rounded-xl"
                  >
                    <span>Open Reel Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">{selectedItem.caption}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedItem.location} · {selectedItem.date}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-slate-200 text-xs font-semibold text-[#0A224E]">
                {selectedItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
