import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useItinerary } from '../context/ItineraryContext.jsx';
import { Bookmark, MapPin, Clock, Trash2, ArrowRight, Compass, Star, Navigation } from 'lucide-react';

export const UserDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { savedItineraries, deleteSavedItinerary, setItems } = useItinerary();

  const totalBookmarked = savedItineraries.reduce((acc, curr) => acc + (curr.items?.length || 0), 0);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase text-amber-400 tracking-wider">Tourist Portal</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1 flex items-center gap-2">
            Welcome, {user?.name || 'Tourist'} 👋
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Manage your saved day visit itineraries and explore curated destinations around Akkaraipattu.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('planner')}
          className="px-5 py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-stone-900" />
          <span>+ Plan New Trip</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 text-center space-y-2 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-mono text-3xl font-bold text-stone-900 block tabular-nums">
            {savedItineraries.length}
          </span>
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
            Saved Itineraries
          </span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 text-center space-y-2 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="font-mono text-3xl font-bold text-stone-900 block tabular-nums">
            {totalBookmarked}
          </span>
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
            Places Bookmarked
          </span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 text-center space-y-2 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5" />
          </div>
          <span className="font-mono text-3xl font-bold text-stone-900 block tabular-nums">
            0
          </span>
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
            Reviews Written
          </span>
        </div>
      </div>

      {/* Saved Itineraries Section */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Your Saved Day Tours</h3>
            <p className="text-xs text-stone-500 mt-0.5">Explore your customized itineraries with stop details and images.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
            {savedItineraries.length} Saved Plans
          </span>
        </div>

        {savedItineraries.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
            <h4 className="font-serif text-base font-bold text-stone-800">No saved itineraries found</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Assemble your favorite spots in "My Itinerary" and click save to store them here.
            </p>
            <button
              onClick={() => setActiveTab('planner')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Start Planning Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {savedItineraries.map((plan) => {
              const planItems = plan.items || [];

              return (
                <div 
                  key={plan._id || plan.id} 
                  className="bg-stone-50/80 border border-stone-200 hover:border-amber-700/60 rounded-2xl overflow-hidden shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Banner Image with fallback to Akkaraipattu scenic view */}
                    <div className="h-32 bg-stone-800 relative overflow-hidden">
                      <img
                        src={planItems[0]?.images?.[0] || '/src/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                        alt={plan.title}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex items-end p-4">
                        <span className="text-[10px] font-mono font-bold bg-amber-800 text-white px-2 py-0.5 rounded">
                          {planItems.length} Stops Tour
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base font-bold text-stone-900 line-clamp-1">{plan.title}</h4>
                          <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                            Created on {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={async () => {
                            if (confirm('Delete this saved itinerary plan?')) {
                              await deleteSavedItinerary(plan._id || plan.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {plan.notes && (
                        <p className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200/60 italic line-clamp-2">
                          "{plan.notes}"
                        </p>
                      )}

                      {/* Detailed Places Timeline Cards inside the Plan */}
                      {planItems.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Included Attractions:</span>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {planItems.map((spot, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs">
                                <img
                                  src={spot.images?.[0] || '/src/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                                  alt={spot.name}
                                  className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold text-stone-900 truncate">{i + 1}. {spot.name}</h5>
                                  <p className="text-[10px] text-stone-500 truncate">{spot.category} · {spot.distance} km</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-center text-xs text-amber-900 font-medium">
                          💡 No stops currently added. Click load plan to edit in planner.
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs font-mono font-semibold text-stone-700 pt-3 border-t border-stone-200/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-800" />
                          {planItems.length} Places
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-800" />
                          {plan.totalDistance || 0} km
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        if (setItems && planItems.length > 0) {
                          setItems(planItems);
                        }
                        setActiveTab('planner');
                      }}
                      className="w-full py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Load Plan in Interactive Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};