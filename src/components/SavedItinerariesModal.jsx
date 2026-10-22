import React from 'react';
import { useItinerary } from '../context/ItineraryContext.jsx';
import { X, Calendar, Trash2, ArrowRight, BookmarkCheck } from 'lucide-react';

export const SavedItinerariesModal = ({
  allPlaces,
  onSelectPlace
}) => {
  const {
    savedItineraries,
    savedModalOpen,
    setSavedModalOpen,
    loadSavedItinerary,
    deleteSavedItinerary
  } = useItinerary();

  if (!savedModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-stone-200 my-8 flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-modal-title"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="saved-modal-title" className="font-serif text-xl font-bold text-stone-900">
                Your Saved Itineraries
              </h3>
              <p className="text-xs text-stone-500">
                Stored permanently on your account for your Akkaraipattu trips.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSavedModalOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
            aria-label="Close saved itineraries"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {savedItineraries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-base font-bold text-stone-800">No saved itineraries yet</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Assemble places using the Day Plan builder and click "Save to Account" to store your itinerary here for future visits.
              </p>
            </div>
          ) : (
            savedItineraries.map((itin) => {
              const matchedPlaces = itin.placeIds
                .map((pid) => allPlaces.find((p) => p.id === pid))
                .filter(Boolean);

              const dateStr = new Date(itin.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={itin.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs hover:border-stone-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-900 leading-snug">
                        {itin.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>Saved on {dateStr}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-stone-700">
                          {matchedPlaces.length} {matchedPlaces.length === 1 ? 'place' : 'places'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSavedItinerary(itin.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-stone-50 rounded-lg text-xs font-mono text-stone-700">
                    <div>
                      <span className="block text-[10px] text-stone-400 font-sans uppercase font-medium">Distance</span>
                      <span>{itin.totalDistance} km</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-sans uppercase font-medium">Est. Time</span>
                      <span>{itin.totalTravelTime} min</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-sans uppercase font-medium">Entrance Fee</span>
                      <span>LKR {itin.estimatedBudget}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                      Included Places:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedPlaces.map((p, idx) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSavedModalOpen(false);
                            onSelectPlace(p);
                          }}
                          className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                        >
                          <span className="font-mono text-stone-400 mr-1">{idx + 1}.</span>
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => loadSavedItinerary(itin, allPlaces)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 py-1 px-3 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <span>Load into Active Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
