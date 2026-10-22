import React, { useState, useEffect, Component } from 'react';
import { api } from './services/api.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ItineraryProvider, useItinerary } from './context/ItineraryContext.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { FilterSortBar } from './components/FilterSortBar.jsx';
import { AttractionCard } from './components/AttractionCard.jsx';
import { AttractionDetailModal } from './components/AttractionDetailModal.jsx';
import { LeafletMap } from './components/LeafletMap.jsx';
import { ItineraryDrawer } from './components/ItineraryDrawer.jsx';
import { SavedItinerariesModal } from './components/SavedItinerariesModal.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { UserDashboard } from './components/UserDashboard.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { EmergencySafetyModal } from './components/EmergencySafetyModal.jsx';
import { Footer } from './components/Footer.jsx';
import { MapPin, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Layers, Trash2, ArrowUp, ArrowDown, Clock, Coins, Bookmark, Printer, CheckCircle2 } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">Something went wrong</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We encountered an unexpected display issue. Please refresh the page to reload the Akkaraipattu tourism planner.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors"
            >
              Reload VisEntrixia
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ItineraryPlannerPage({ places, onSelectPlace, setSelectedPlaceForMap, setActiveTab }) {
  const {
    items,
    count,
    totalDistance,
    estimatedTravelTime,
    totalBudget,
    addItem,
    removeItem,
    moveItem,
    clearItinerary,
    saveActiveItinerary
  } = useItinerary();

  const { user, openAuthModal } = useAuth();
  const [saveTitle, setSaveTitle] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  const hours = Math.floor(estimatedTravelTime / 60);
  const minutes = estimatedTravelTime % 60;

  const handleSave = async (e) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    setIsSaving(true);
    const title = saveTitle.trim() || `My Akkaraipattu Day Tour (${new Date().toLocaleDateString()})`;
    const result = await saveActiveItinerary(title, saveNotes);

    setIsSaving(false);
    if (result.success) {
      setFeedbackMessage({ type: 'success', text: result.message });
      setSaveTitle('');
      setSaveNotes('');
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1000);
    } else {
      setFeedbackMessage({ type: 'error', text: result.message });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const itemsHtml = items.map((item, index) => {
      const imgSrc = (item.images && item.images[0]) ? item.images[0] : '/assets/images/hero_akkaraipattu_1792478448218.jpg';
      const feeText = item.entranceFee === 0 ? 'Free' : 'LKR ' + item.entranceFee;
      const tipHtml = item.travelTips ? `<div class="tip">💡 <b>Travel Tip:</b> ${item.travelTips}</div>` : '';
      
      return `
        <div class="item">
          <div class="index">${index + 1}</div>
          <img class="place-img" src="${imgSrc}" alt="${item.name}" />
          <div class="details">
            <h4>${item.name}</h4>
            <p>${item.description || ''}</p>
            <div class="meta">${item.category} · Distance: ${item.distance} km · Entrance: ${feeText}</div>
            ${tipHtml}
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>My Akkaraipattu Day Tour - VisEntrixia Itinerary</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; color: #1c1917; }
            .header { border-bottom: 2px solid #e7e5e4; padding-bottom: 12px; margin-bottom: 16px; }
            .header h2 { font-size: 22px; margin: 0; color: #78350f; }
            .header p { font-size: 12px; color: #78716c; margin: 4px 0 0 0; }
            .stats { display: flex; gap: 24px; background: #f5f5f4; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; font-weight: bold; border: 1px solid #e7e5e4; }
            .item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px solid #e7e5e4; page-break-inside: avoid; }
            .index { width: 26px; height: 26px; background: #78350f; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; margin-top: 2px; }
            .place-img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; background: #f5f5f4; flex-shrink: 0; }
            .details { flex-grow: 1; }
            .details h4 { font-size: 14px; margin: 0 0 4px 0; color: #1c1917; }
            .details p { font-size: 11px; color: #57534e; margin: 0 0 6px 0; line-height: 1.4; }
            .details .meta { font-size: 11px; color: #78350f; font-weight: 600; }
            .tip { background: #fffbeb; border: 1px solid #fef3c7; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #92400e; margin-top: 6px; }
            @page { size: portrait; margin: 15mm; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>My Akkaraipattu Day Tour (${count} Stops)</h2>
            <p>Generated via VisEntrixia · Akkaraipattu Day-Visit Planner</p>
          </div>
          
          <div class="stats">
            <div>Est. Distance: ${totalDistance} km</div>
            <div>Est. Duration: ${hours > 0 ? `${hours}h ` : ''}${minutes}m</div>
            <div>Total Budget: ${totalBudget === 0 ? 'Free' : `LKR ${totalBudget}`}</div>
          </div>

          <h3 style="font-size: 15px; margin-bottom: 10px;">Day Visit Sequence & Guidance</h3>
          <div>
            ${itemsHtml}
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredPlacesForPicker = places.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Generated One-Day Itinerary</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mt-1">My Akkaraipattu Day Tour</h2>
          <p className="text-xs text-stone-500 mt-0.5">Scheduled for Today · Starting from Town Center Origin</p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-stone-100/90 border border-stone-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-700 shadow-xs">
          <div>
            <span className="block text-stone-400 font-medium">Total Stops</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block font-mono tabular-nums">{count} Places</span>
          </div>
          <div>
            <span className="block text-stone-400 font-medium">Est. Distance</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block font-mono tabular-nums flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              {totalDistance} km
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-medium">Est. Duration</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block font-mono tabular-nums flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-medium">Total Budget</span>
            <span className="font-bold text-stone-900 text-sm mt-0.5 block font-mono tabular-nums flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              {totalBudget === 0 ? 'Free' : `LKR ${totalBudget}`}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-serif text-base font-bold text-stone-900">Pick Day Places</h3>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-100 text-amber-900 rounded-md">
              {count} Selected
            </span>
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search spots to add..."
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:border-amber-700 outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPlacesForPicker.map((place) => {
              const inPlan = items.some(i => i.id === place.id);
              return (
                <div key={place.id} className="p-2.5 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3">
                  <img
                    src={place.images?.[0] || '/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                    alt={place.name}
                    className="w-10 h-10 rounded-lg object-cover bg-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{place.name}</h5>
                    <p className="text-[10px] text-stone-500">{place.category} · {place.distance} km</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedPlaceForMap(place);
                        onSelectPlace(place);
                      }}
                      className="px-2 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-md hover:bg-stone-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => inPlan ? removeItem(place.id) : addItem(place)}
                      className={
                        'px-2.5 py-1 text-[11px] font-semibold text-white rounded-md transition-colors ' +
                        (inPlan ? 'bg-stone-800 hover:bg-stone-900' : 'bg-amber-800 hover:bg-amber-900')
                      }
                    >
                      {inPlan ? 'Remove' : '+ Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-2">
            <LeafletMap
              places={places}
              className="h-[520px]"
              onSelectPlace={(p) => onSelectPlace(p)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Day Visit Timeline & Guidance</h3>
            <p className="text-xs text-stone-500 mt-0.5">Ordered sequence of spots with travel insights and recommendations.</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearItinerary}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Plan</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
            <h4 className="font-serif text-base font-bold text-stone-800">Your itinerary plan is currently empty</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Use the place picker on the left or browse attractions to assemble your customized day tour route.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 md:p-5 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <h4 className="font-serif text-sm md:text-base font-bold text-stone-900">{item.name}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded ml-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <img
                    src={item.images?.[0] || '/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                    alt={item.name}
                    className="w-24 h-20 rounded-lg object-cover bg-stone-200 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1 text-xs">
                    <p className="text-stone-600 leading-relaxed">{item.description}</p>
                    <div className="p-2.5 bg-amber-50/80 border border-amber-200/60 rounded-lg text-amber-900 space-y-1">
                      <span className="font-semibold block">💡 Travel Tip & Advice:</span>
                      <p className="text-[11px] text-amber-900/80">{item.travelTips || 'Best time to visit is during early morning or late afternoon.'}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-stone-500">
                      <span>📍 Distance: {item.distance} km</span>
                      <span>💰 Entrance: {item.entranceFee === 0 ? 'Free' : `LKR ${item.entranceFee}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="pt-6 border-t border-stone-100 bg-stone-50/50 p-5 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900">Save or Sync Itinerary to Account</h4>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Give your itinerary a title (e.g., Saturday Heritage & Coastal Tour)"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
              />
              <textarea
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="Add personal notes or schedule remarks (optional)"
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-amber-700 outline-none h-20 resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{user ? (isSaving ? 'Saving...' : 'Save Itinerary') : 'Save to Account (Sign In Required)'}</span>
                </button>
              </div>
            </form>

            {feedbackMessage && (
              <div className={
                'p-3 rounded-lg text-xs flex items-center gap-2 ' +
                (feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200')
              }>
                {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{feedbackMessage.text}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MainContent() {
  const { user, openAuthModal } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [activeTab, setActiveTab] = useState('browse');
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
  const [selectedPlaceForMap, setSelectedPlaceForMap] = useState(null);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);

  const loadPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPlaces();
      setPlaces(res.places || []);
    } catch (err) {
      setError('Unable to load attractions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const filteredPlaces = places.filter((place) => {
    const matchesCategory =
      selectedCategory === 'All' || place.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      place.name.toLowerCase().includes(q) ||
      place.description.toLowerCase().includes(q) ||
      place.travelTips.toLowerCase().includes(q) ||
      place.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  filteredPlaces.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'fee_low') {
      return a.entranceFee - b.entranceFee;
    }
    return a.distance - b.distance;
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage) || 1;
  const paginatedPlaces = filteredPlaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewOnMap = (place) => {
    setSelectedPlaceForMap(place);
    setActiveTab('map');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-800">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
      />

      <main className="flex-1">
        {activeTab !== 'admin' && activeTab !== 'planner' && activeTab !== 'dashboard' && (
          <Hero
            onExploreClick={() => {
              setActiveTab('browse');
              const el = document.getElementById('browse-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenMapClick={() => {
              setActiveTab('map');
              const el = document.getElementById('map-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
          {activeTab === 'admin' ? (
            user?.role === 'admin' ? (
              <AdminDashboard places={places} onRefreshPlaces={loadPlaces} />
            ) : (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Administrator Access Required</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The Content Management Dashboard is reserved for authenticated system administrators. Please log in with administrator credentials.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => openAuthModal('admin')}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors"
                  >
                    Administrator Log In
                  </button>
                </div>
              </div>
            )
          ) : activeTab === 'dashboard' ? (
            <UserDashboard
              allPlaces={places}
              setActiveTab={setActiveTab}
            />
          ) : activeTab === 'planner' ? (
            <ItineraryPlannerPage
              places={places}
              onSelectPlace={(p) => setSelectedPlaceForModal(p)}
              setSelectedPlaceForMap={setSelectedPlaceForMap}
              setActiveTab={setActiveTab}
            />
          ) : (
            <>
              {activeTab === 'map' ? (
                <div id="map-section" className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                        Interactive Regional Map
                      </h2>
                      <p className="text-xs text-stone-500 mt-1">
                        Leaflet OpenStreetMap display centered on Akkaraipattu with 25km radius attraction markers and route directions.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('browse')}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Switch to Grid View</span>
                    </button>
                  </div>

                  <LeafletMap
                    places={places}
                    selectedPlace={selectedPlaceForMap}
                    onSelectPlace={(place) => setSelectedPlaceForModal(place)}
                    className="h-[600px]"
                  />
                </div>
              ) : (
                <div id="browse-section" className="space-y-6">
                  <FilterSortBar
                    searchQuery={searchQuery}
                    setSearchQuery={(q) => {
                      setSearchQuery(q);
                      setCurrentPage(1);
                    }}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(c) => {
                      setSelectedCategory(c);
                      setCurrentPage(1);
                    }}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    totalResults={filteredPlaces.length}
                  />

                  {loading ? (
                    <div className="py-24 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-amber-700 animate-spin mx-auto" />
                      <p className="text-xs font-medium text-stone-500">Loading Akkaraipattu attractions...</p>
                    </div>
                  ) : error ? (
                    <div className="py-16 text-center space-y-3 bg-rose-50 border border-rose-200 rounded-2xl p-6">
                      <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                      <p className="text-sm font-semibold text-rose-800">{error}</p>
                      <button
                        onClick={loadPlaces}
                        className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : paginatedPlaces.length === 0 ? (
                    <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-8">
                      <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                      <h3 className="font-serif text-lg font-bold text-stone-800">No matching attractions found</h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Try clearing your search query or switching to another category filter to see places within the 25km radius.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="px-4 py-2 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 rounded-lg transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedPlaces.map((place) => (
                        <AttractionCard
                          key={place.id}
                          place={place}
                          onSelectPlace={(p) => setSelectedPlaceForModal(p)}
                          onViewOnMap={handleViewOnMap}
                        />
                      ))}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs">
                      <span className="text-stone-500">
                        Page <span className="font-semibold text-stone-800 tabular-nums">{currentPage}</span> of{' '}
                        <span className="font-semibold text-stone-800 tabular-nums">{totalPages}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                          <button
                            key={pg}
                            onClick={() => setCurrentPage(pg)}
                            className={
                              'w-7 h-7 rounded-lg text-xs font-semibold transition-colors ' +
                              (currentPage === pg ? 'bg-amber-800 text-white' : 'text-stone-700 hover:bg-stone-100')
                            }
                          >
                            {pg}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        Geographical Overview (25km Scope)
                      </h3>
                      <button
                        onClick={() => setActiveTab('map')}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-950"
                      >
                        Full Map View →
                      </button>
                    </div>
                    <LeafletMap
                      places={places}
                      selectedPlace={selectedPlaceForMap}
                      onSelectPlace={(place) => setSelectedPlaceForModal(place)}
                      className="h-[380px]"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AttractionDetailModal
        place={selectedPlaceForModal}
        onClose={() => setSelectedPlaceForModal(null)}
        onViewOnMap={handleViewOnMap}
      />

      <ItineraryDrawer />

      <SavedItinerariesModal
        allPlaces={places}
        onSelectPlace={(p) => setSelectedPlaceForModal(p)}
      />

      <AuthModal />

      <EmergencySafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />

      <Footer
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onAdminClick={() => {
          if (user?.role === 'admin') {
            setActiveTab('admin');
          } else {
            openAuthModal('admin');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ItineraryProvider>
          <MainContent />
        </ItineraryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}