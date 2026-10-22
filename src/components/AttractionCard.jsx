import React from 'react';
import { useItinerary } from '../context/ItineraryContext.jsx';
import { MapPin, Plus, Check, Clock, Info } from 'lucide-react';

export const AttractionCard = ({ place, onSelectPlace, onViewOnMap }) => {
  const { addItem, removeItem, isItemInItinerary } = useItinerary();
  const inItinerary = isItemInItinerary(place.id);

  const handleItineraryToggle = (e) => {
    e.stopPropagation();
    if (inItinerary) {
      removeItem(place.id);
    } else {
      addItem(place);
    }
  };

  const handleMapClick = (e) => {
    e.stopPropagation();
    onViewOnMap(place);
  };

  return (
    <article
      onClick={() => onSelectPlace(place)}
      className="group bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={place.images[0] || '/assets/images/hero_akkaraipattu_1792478448218.jpg'}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        <button
          onClick={handleItineraryToggle}
          title={inItinerary ? 'Remove from Day Plan' : 'Add to Day Plan'}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
            inItinerary
              ? 'bg-amber-800 text-white hover:bg-amber-900 ring-2 ring-white/80'
              : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 hover:scale-105'
          }`}
        >
          {inItinerary ? (
            <>
              <Check className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">Added</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Add to Plan</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-amber-800 font-semibold">{place.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 font-mono text-stone-600">
              <MapPin className="w-3 h-3 text-stone-400 inline" />
              {place.distance} km
            </span>
            <span aria-hidden="true">·</span>
            <span>{place.entranceFee === 0 ? 'Free Entry' : `LKR ${place.entranceFee}`}</span>
          </div>

          <h2 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug line-clamp-1">
            {place.name}
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1 text-stone-500 truncate max-w-[170px]" title={place.openingHours}>
            <Clock className="w-3.5 h-3.5 shrink-0 text-stone-400" />
            <span className="truncate">{place.openingHours}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleMapClick}
              className="p-1.5 hover:bg-stone-100 text-stone-600 hover:text-stone-900 rounded-md transition-colors"
              title="Locate on Leaflet map"
            >
              <MapPin className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectPlace(place)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 px-2 py-1 rounded hover:bg-amber-50 transition-colors"
            >
              <span>Details</span>
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
