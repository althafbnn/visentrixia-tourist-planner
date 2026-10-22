import React, { useState } from 'react';
import { useItinerary } from '../context/ItineraryContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  X,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
  Coins,
  Bookmark,
  Printer,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const ItineraryDrawer = () => {
  const {
    items,
    count,
    totalDistance,
    estimatedTravelTime,
    totalBudget,
    drawerOpen,
    setDrawerOpen,
    removeItem,
    moveItem,
    clearItinerary,
    saveActiveItinerary
  } = useItinerary();

  const { user } = useAuth();
  const [saveTitle, setSaveTitle] = useState('');
  const [saveNotes, setSaveNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  if (!drawerOpen) return null;

  const hours = Math.floor(estimatedTravelTime / 60);
  const minutes = estimatedTravelTime % 60;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    const title = saveTitle.trim() || `Akkaraipattu Day Tour (${new Date().toLocaleDateString()})`;
    const result = await saveActiveItinerary(title, saveNotes);

    setIsSaving(false);
    if (result.success) {
      setFeedbackMessage({ type: 'success', text: result.message });
      setSaveTitle('');
      setSaveNotes('');
    } else {
      setFeedbackMessage({ type: 'error', text: result.message });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>One-Day Itinerary Plan - VisEntrixia</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1c1917; }
            h2 { font-size: 20px; margin-bottom: 4px; }
            p { font-size: 12px; color: #78716c; margin-bottom: 16px; }
            .stats { display: flex; gap: 20px; background: #f5f5f4; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; font-weight: bold; }
            .item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e7e5e4; }
            .index { width: 24px; height: 24px; background: #78350f; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; }
            .place-img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; background: #f5f5f4; flex-shrink: 0; }
            .details { flex-grow: 1; }
            .details h4 { font-size: 14px; margin: 0 0 4px 0; }
            .details span { font-size: 11px; color: #78716c; }
          </style>
        </head>
        <body>
          <h2>One-Day Itinerary Plan (${count} Stops)</h2>
          <p>Personalized day route starting from Akkaraipattu town center.</p>
          
          <div class="stats">
            <div>Est. Distance: ${totalDistance} km</div>
            <div>Est. Duration: ${hours > 0 ? `${hours}h ` : ''}${minutes}m</div>
            <div>Est. Budget: ${totalBudget === 0 ? 'Free' : `LKR ${totalBudget}`}</div>
          </div>

          <h3>Trip Sequence</h3>
          <div>
            ${items.map((item, index) => `
              <div class="item">
                <div class="index">${index + 1}</div>
                <img class="place-img" src="${item.images && item.images[0] ? item.images[0] : ''}" alt="${item.name}" />
                <div class="details">
                  <h4>${item.name}</h4>
                  <span>${item.category} · ${item.distance} km · ${item.entranceFee === 0 ? 'Free' : `LKR ${item.entranceFee}`}</span>
                </div>
              </div>
            `).join('')}
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/40 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="drawer-title" className="font-serif text-xl font-bold text-stone-900">
                One-Day Itinerary Plan
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-100 text-amber-900 rounded-md tabular-nums">
                {count} {count === 1 ? 'Stop' : 'Stops'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Personalized day route starting from Akkaraipattu town center.
            </p>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200/60 transition-colors"
            aria-label="Close itinerary drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-stone-100/90 border-b border-stone-200 grid grid-cols-3 gap-2 text-xs text-stone-600 shrink-0">
          <div>
            <span className="block text-stone-400 font-medium">Est. Distance</span>
            <span className="font-semibold text-stone-900 flex items-center gap-1 font-mono tabular-nums mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              {totalDistance} km
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-medium">Est. Duration</span>
            <span className="font-semibold text-stone-900 flex items-center gap-1 font-mono tabular-nums mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>
          <div>
            <span className="block text-stone-400 font-medium">Est. Budget</span>
            <span className="font-semibold text-stone-900 flex items-center gap-1 font-mono tabular-nums mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              {totalBudget === 0 ? 'Free' : `LKR ${totalBudget}`}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">Your day plan is empty</h4>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Explore attractions in Akkaraipattu and click "Add to Plan" on any place to assemble your customized itinerary. No account required to build!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Trip Sequence (Top to Bottom)</span>
                <button
                  onClick={clearItinerary}
                  className="text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs flex items-center justify-between gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <img
                    src={item.images?.[0] || '/src/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{item.name}</h5>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.distance} km</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.entranceFee === 0 ? 'Free' : `LKR ${item.entranceFee}`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 rounded transition-colors"
                      title="Move earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 rounded transition-colors"
                      title="Move later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      title="Remove from plan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {feedbackMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            <form onSubmit={handleSave} className="space-y-2">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Itinerary name (e.g., Saturday Coastal & Lake Tour)"
                className="w-full px-3 py-1.5 text-xs text-stone-800 bg-white border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 active:bg-amber-950 rounded-lg shadow-xs transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{user ? (isSaving ? 'Saving...' : 'Save to Account') : 'Save Itinerary (Log in)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {!user && (
                <p className="text-[11px] text-stone-500 text-center">
                  Saving requires a free tourist account. You can plan and reorder freely without logging in.
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};