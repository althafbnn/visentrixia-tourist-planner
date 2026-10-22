import React, { useEffect } from 'react';
import { useItinerary } from '../context/ItineraryContext.jsx';
import {
  X,
  MapPin,
  Clock,
  Ticket,
  AlertTriangle,
  Lightbulb,
  Check,
  Plus,
  Navigation,
  CheckCircle2,
  Users
} from 'lucide-react';

export const AttractionDetailModal = ({
  place,
  onClose,
  onViewOnMap
}) => {
  const { addItem, removeItem, isItemInItinerary } = useItinerary();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!place) return null;

  const inItinerary = isItemInItinerary(place.id);
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=7.2185%2C81.8498%3B${place.location.lat}%2C${place.location.lng}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-stone-200 my-8 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="relative aspect-[16/9] w-full bg-stone-100 shrink-0">
          <img
            src={place.images[0] || '/src/assets/images/hero_akkaraipattu_1792478448218.jpg'}
            alt={place.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <span>{place.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-200">{place.distance} km from Akkaraipattu town</span>
            </div>
            <h2 id="modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mt-1">
              {place.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600">
            <div>
              <span className="block text-stone-400 font-medium">Opening Hours</span>
              <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="truncate">{place.openingHours}</span>
              </span>
            </div>

            <div>
              <span className="block text-stone-400 font-medium">Entrance Fee</span>
              <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <Ticket className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{place.entranceFee === 0 ? 'Free Entry' : `LKR ${place.entranceFee}`}</span>
              </span>
            </div>

            <div>
              <span className="block text-stone-400 font-medium">Distance</span>
              <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{place.distance} km</span>
              </span>
            </div>

            <div>
              <span className="block text-stone-400 font-medium">Family / Child</span>
              <span className="font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{place.childFriendly ? 'Child Friendly' : 'Adult / Care Needed'}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Overview</h4>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {place.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              <span>Local Travel Advice & Etiquette</span>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              {place.travelTips}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Safety & Environmental Guidance</span>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              {place.safetyInfo}
            </p>
          </div>

          {place.facilities && place.facilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Available Facilities</h4>
              <div className="flex flex-wrap gap-2">
                {place.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 px-3 py-1 rounded-md border border-stone-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewOnMap(place);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Center on Map</span>
            </button>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
              title="Opens OpenStreetMap navigation route in new tab"
            >
              <Navigation className="w-4 h-4 text-stone-500" />
              <span>Get Route Directions</span>
            </a>
          </div>

          <button
            onClick={() => {
              if (inItinerary) {
                removeItem(place.id);
              } else {
                addItem(place);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
              inItinerary
                ? 'bg-stone-800 text-white hover:bg-stone-900'
                : 'bg-amber-800 text-white hover:bg-amber-900'
            }`}
          >
            {inItinerary ? (
              <>
                <Check className="w-4 h-4 text-amber-300" />
                <span>Remove from Day Plan</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Day Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
