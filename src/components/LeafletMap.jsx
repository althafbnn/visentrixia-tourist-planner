import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useItinerary } from '../context/ItineraryContext.jsx';
import { Navigation } from 'lucide-react';

const AKKARAIPATTU_CENTER = [7.2185, 81.8498];

export const LeafletMap = ({
  places,
  selectedPlace,
  onSelectPlace,
  className = 'h-[540px]'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const { items, addItem, removeItem, isItemInItinerary } = useItinerary();

  // Utility helper to safely get Lat/Lng coordinates from any location format
  const getCoordinates = (item) => {
    if (!item) return null;
    if (item.location) {
      if (typeof item.location.lat === 'number' && typeof item.location.lng === 'number') {
        return [item.location.lat, item.location.lng];
      }
      if (Array.isArray(item.location) && item.location.length >= 2) {
        return [item.location[0], item.location[1]];
      }
    }
    if (typeof item.lat === 'number' && typeof item.lng === 'number') {
      return [item.lat, item.lng];
    }
    return null;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: AKKARAIPATTU_CENTER,
        zoom: 12,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      const townIcon = L.divIcon({
        className: 'custom-town-pin',
        html: `
          <div style="background-color: #1c1917; color: #fbbf24; border: 2px solid #ffffff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-weight: bold; font-size: 13px;">
            A
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const townMarker = L.marker(AKKARAIPATTU_CENTER, { icon: townIcon }).addTo(map);
      townMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="color: #1c1917; font-size: 14px;">Akkaraipattu Town Center</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #78716c;">Zero-kilometer reference origin point for all 25km radius attraction distances.</p>
        </div>
      `);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const categoryColors = {
      Religious: '#b45309',
      Nature: '#047857',
      Heritage: '#b91c1c',
      Cultural: '#6d28d9',
      Culinary: '#c2410c'
    };

    places.forEach((place, index) => {
      const coords = getCoordinates(place);
      if (!coords) return;

      const pinColor = categoryColors[place.category] || '#78716c';
      const inPlan = isItemInItinerary(place.id);

      const placeIcon = L.divIcon({
        className: 'custom-place-pin',
        html: `
          <div style="background-color: ${inPlan ? '#1c1917' : pinColor}; color: #ffffff; border: 2px solid #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.25); font-weight: bold; font-size: 11px; font-family: monospace;">
            ${index + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(coords, { icon: placeIcon }).addTo(map);

      const popupDiv = document.createElement('div');
      popupDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      popupDiv.style.width = '220px';
      popupDiv.style.padding = '2px';
      popupDiv.innerHTML = `
        <div style="margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${pinColor}; letter-spacing: 0.5px;">${place.category} · ${place.distance} km</span>
          <h4 style="margin: 2px 0 4px; font-size: 13px; font-weight: 700; color: #1c1917; line-height: 1.2;">${place.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #57534e; line-height: 1.3;">${place.openingHours || 'Open Daily'} · ${place.entranceFee === 0 ? 'Free' : 'LKR ' + place.entranceFee}</p>
        </div>
      `;

      const btnGroup = document.createElement('div');
      btnGroup.style.display = 'flex';
      btnGroup.style.gap = '6px';
      btnGroup.style.marginTop = '8px';

      const detailsBtn = document.createElement('button');
      detailsBtn.innerText = 'View Details';
      detailsBtn.style.flex = '1';
      detailsBtn.style.padding = '4px 8px';
      detailsBtn.style.fontSize = '11px';
      detailsBtn.style.fontWeight = '600';
      detailsBtn.style.color = '#1c1917';
      detailsBtn.style.backgroundColor = '#f5f5f4';
      detailsBtn.style.border = '1px solid #d6d3d1';
      detailsBtn.style.borderRadius = '6px';
      detailsBtn.style.cursor = 'pointer';
      detailsBtn.onclick = () => onSelectPlace(place);

      const addBtn = document.createElement('button');
      addBtn.innerText = inPlan ? 'Remove' : '+ Plan';
      addBtn.style.padding = '4px 8px';
      addBtn.style.fontSize = '11px';
      addBtn.style.fontWeight = '600';
      addBtn.style.color = '#ffffff';
      addBtn.style.backgroundColor = inPlan ? '#44403c' : '#92400e';
      addBtn.style.border = 'none';
      addBtn.style.borderRadius = '6px';
      addBtn.style.cursor = 'pointer';
      addBtn.onclick = () => {
        if (inPlan) {
          removeItem(place.id);
        } else {
          addItem(place);
        }
        marker.closePopup();
      };

      btnGroup.appendChild(detailsBtn);
      btnGroup.appendChild(addBtn);
      popupDiv.appendChild(btnGroup);

      marker.bindPopup(popupDiv);
      markersRef.current[place.id] = marker;
    });
  }, [places, items, addItem, removeItem, onSelectPlace, isItemInItinerary]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    const coords = getCoordinates(selectedPlace);
    if (!coords) return;

    map.flyTo(coords, 14, {
      duration: 1.2
    });

    const marker = markersRef.current[selectedPlace.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedPlace]);

  // Route Connecting Polyline Renderer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous route lines
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (items && items.length > 0) {
      const routePoints = [AKKARAIPATTU_CENTER];

      items.forEach((item) => {
        const coords = getCoordinates(item);
        if (coords) {
          routePoints.push(coords);
        }
      });

      if (routePoints.length > 1) {
        const polyline = L.polyline(routePoints, {
          color: '#d97706',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        polylineRef.current = polyline;

        // Auto zoom map to fit all route stops
        const bounds = L.latLngBounds(routePoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [items]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
      <div ref={mapContainerRef} className={`w-full ${className} z-10`} />

      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200/90 shadow-md text-xs space-y-2 pointer-events-auto max-w-[280px]">
        <div className="flex items-center justify-between font-bold text-stone-900 border-b border-stone-100 pb-1.5">
          <span>Map Legend</span>
          <span className="font-mono text-[10px] text-stone-500 font-normal">25 km Scope</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-stone-600 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900 shrink-0" />
            <span className="truncate">Town Center</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-700 shrink-0" />
            <span className="truncate">Religious</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0" />
            <span className="truncate">Nature</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-700 shrink-0" />
            <span className="truncate">Heritage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-700 shrink-0" />
            <span className="truncate">Cultural</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-700 shrink-0" />
            <span className="truncate">Culinary</span>
          </div>
        </div>

        {items.length > 0 && (
          <div className="pt-1.5 border-t border-stone-100 text-[11px] text-amber-800 font-medium">
            Dashed orange line shows your planned route sequence ({items.length} stops).
          </div>
        )}
      </div>

      <button
        onClick={() => {
          mapInstanceRef.current?.flyTo(AKKARAIPATTU_CENTER, 12);
        }}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-700 text-xs font-semibold rounded-lg shadow-sm border border-stone-200 transition-colors flex items-center gap-1.5"
      >
        <Navigation className="w-3.5 h-3.5 text-amber-700" />
        <span>Recenter Town</span>
      </button>
    </div>
  );
};