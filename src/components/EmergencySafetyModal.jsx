import React from 'react';
import {
  X,
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Info
} from 'lucide-react';

export const EmergencySafetyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contacts = [
    {
      name: 'Akkaraipattu Base Hospital (Emergency Room)',
      number: '+94 67 227 7222',
      badge: '24/7 Medical Care',
      address: 'Main Street, Akkaraipattu'
    },
    {
      name: 'Akkaraipattu Police Station',
      number: '+94 67 227 7223',
      badge: 'Law Enforcement',
      address: 'Police Station Rd, Akkaraipattu'
    },
    {
      name: 'Sri Lanka Tourism Police National Hotline',
      number: '1912',
      badge: 'Tourist Support',
      address: 'SLTDA Colombo (Toll-Free in SL)'
    },
    {
      name: '1990 Suwa Seriya Emergency Ambulance',
      number: '1990',
      badge: 'Free Paramedic Response',
      address: 'Nationwide Free Emergency Ambulance'
    },
    {
      name: 'Ampara District Disaster Management Unit',
      number: '+94 63 222 2011',
      badge: 'Weather & Natural Hazard Alerts',
      address: 'District Secretariat, Ampara'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white max-w-2xl w-full rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-modal-title"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 id="safety-modal-title" className="font-serif text-xl font-bold text-stone-900">
                Akkaraipattu Safety & Emergency Guide
              </h3>
              <p className="text-xs text-stone-500">
                Official contacts, local cultural etiquette, and essential travel advisories.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
              <span>Verified Emergency Contacts (Ampara / Akkaraipattu)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contacts.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-medium block">{c.badge}</span>
                  <a
                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1 font-mono font-bold text-sm text-amber-900 hover:underline pt-0.5"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{c.number}</span>
                  </a>
                  <span className="text-[10px] text-stone-400 block">{c.address}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Cultural Etiquette & Environmental Safety</span>
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-1">
                <strong className="text-amber-950 font-bold block">1. Sacred Sites Dress Code & Respect</strong>
                <p className="text-stone-600 leading-relaxed">
                  Both Muslim (Grand Jummah Mosque) and Hindu (Sri Sithira Velayudha Swami Kovil) sanctuaries require modest attire covering shoulders and knees. Remove footwear before stepping onto courtyard carpets or temple flagstones.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <strong className="text-stone-900 font-bold block">2. Ocean Undertow Currents along Akkaraipattu Shoreline</strong>
                <p className="text-stone-600 leading-relaxed">
                  The open Eastern sea contains powerful seasonal rip currents and steep sand shelves. Swimming is strongly discouraged without certified local life-guards. Enjoy sunset beach walks and harbor visits from dry sand.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <strong className="text-stone-900 font-bold block">3. Twilight Wildlife Precautions (Sagamam & Pannalgama Lakes)</strong>
                <p className="text-stone-600 leading-relaxed">
                  Inland reservoir wetland trails are known for twilight wildlife crossings (including wild elephants). Plan excursions between 06:30 AM and 05:30 PM and vacate natural sanctuaries well before dusk.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                <strong className="text-stone-900 font-bold block">4. Hydration & Family Safety</strong>
                <p className="text-stone-600 leading-relaxed">
                  Tropical humidity can reach high levels by midday. Always carry bottled water, apply sunscreen, and ensure children stay close around busy market stalls or uneven archaeological brick ruins.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <Info className="w-4 h-4 text-stone-600 shrink-0" />
              <span>Official Academic Project Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              VisEntrixia is an academic development project designed for ITE2953 (University of Moratuwa) to showcase local tourism information planning for the Akkaraipattu region. All information is for informational and educational purposes only; visitors must exercise their own personal judgment and adhere to official Sri Lanka Tourism Development Authority (SLTDA) guidelines when visiting sites.
            </p>
          </div>
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 active:bg-amber-950 rounded-lg transition-colors"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
