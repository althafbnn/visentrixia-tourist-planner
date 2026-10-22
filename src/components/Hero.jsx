import React from 'react';
import { MapPin } from 'lucide-react';

export const Hero = ({ onExploreClick, onOpenMapClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:py-16 bg-gradient-to-b from-[#F5F2EB] to-[#FAF9F6] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-widest">
              <span className="text-amber-800 font-semibold">Ampara District</span>
              <span aria-hidden="true">·</span>
              <span>Eastern Province</span>
              <span aria-hidden="true">·</span>
              <span>25km Radius Scope</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
              Discover the sacred heritage, lagoons & flavors of Akkaraipattu.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              A curated local information system and day-visit itinerary builder. Explore historic mosques, ancient oceanfront kovils, freshwater wetlands, and night street delicacies—designed for independent travelers, families, and culture enthusiasts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-800 hover:bg-amber-900 active:bg-amber-950 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Browse Attractions
              </button>

              <button
                onClick={onOpenMapClick}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>View on Map</span>
              </button>
            </div>

            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                  10
                </span>
                <span className="block text-xs text-stone-500 font-medium">Curated Local Gems</span>
              </div>
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                  &lt; 25 km
                </span>
                <span className="block text-xs text-stone-500 font-medium">Town Proximity</span>
              </div>
              <div>
                <span className="block font-mono text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                  100% Free
                </span>
                <span className="block text-xs text-stone-500 font-medium">Open Access Planning</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/90 aspect-[4/3] bg-stone-100">
              <img
                src="/assets/images/hero_akkaraipattu_1792478448218.jpg"
                alt="Akkaraipattu golden coastline and palm groves"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  Eastern Coastal Serenity
                </span>
                <h3 className="text-lg font-serif font-bold text-white leading-snug">
                  Akkaraipattu Coast & Cultural Confluence
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2 mt-1">
                  Centuries of peaceful coexistence, trade crossroads, and unspoiled littoral landscapes in Ampara.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
