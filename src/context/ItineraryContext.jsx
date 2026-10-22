import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const STORAGE_KEY = 'visentrixia_session_itinerary';

const ItineraryContext = createContext(undefined);

export const ItineraryProvider = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState([]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const refreshSavedItineraries = async () => {
    if (!user) {
      setSavedItineraries([]);
      return;
    }
    try {
      const res = await api.getSavedItineraries();
      setSavedItineraries(res.itineraries || []);
    } catch (err) {
      setSavedItineraries([]);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSavedItineraries();
    } else {
      setSavedItineraries([]);
    }
  }, [user]);

  const count = items.length;

  const totalDistance = items.reduce((sum, item, idx) => {
    if (idx === 0) return item.distance;
    const prev = items[idx - 1];
    const dLat = (item.location.lat - prev.location.lat) * (Math.PI / 180);
    const dLng = (item.location.lng - prev.location.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(prev.location.lat * (Math.PI / 180)) *
        Math.cos(item.location.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const legDistance = 6371 * c;
    return sum + legDistance;
  }, 0);

  const estimatedTravelTime = Math.round((totalDistance / 30) * 60 + count * 45);
  const totalBudget = items.reduce((sum, item) => sum + item.entranceFee, 0);

  const isItemInItinerary = (placeId) => {
    return items.some((item) => item.id === placeId);
  };

  const addItem = (place) => {
    if (isItemInItinerary(place.id)) {
      return { added: false, reason: 'Already in your itinerary' };
    }
    setItems((prev) => [...prev, place]);
    return { added: true };
  };

  const removeItem = (placeId) => {
    setItems((prev) => prev.filter((p) => p.id !== placeId));
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    setItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const clearItinerary = () => {
    setItems([]);
  };

  const loadSavedItinerary = (saved, allPlaces) => {
    const loadedPlaces = [];
    saved.placeIds.forEach((pid) => {
      const p = allPlaces.find((x) => x.id === pid);
      if (p) loadedPlaces.push(p);
    });
    setItems(loadedPlaces);
    setDrawerOpen(true);
    setSavedModalOpen(false);
  };

  const saveActiveItinerary = async (title, notes) => {
    if (!user) {
      openAuthModal('login', 'Create an account or log in to permanently save your one-day Akkaraipattu itinerary.');
      return {
        success: false,
        message: 'Please log in to save your itinerary.'
      };
    }

    if (items.length === 0) {
      return { success: false, message: 'Your itinerary is empty. Please add places before saving.' };
    }

    try {
      const res = await api.saveItinerary({
        title,
        placeIds: items.map((i) => i.id),
        totalDistance: Number(totalDistance.toFixed(1)),
        totalTravelTime: estimatedTravelTime,
        estimatedBudget: totalBudget,
        notes
      });
      await refreshSavedItineraries();
      return { success: true, message: res.message || 'Itinerary saved successfully!' };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to save itinerary.' };
    }
  };

  const deleteSavedItinerary = async (id) => {
    try {
      await api.deleteItinerary(id);
      await refreshSavedItineraries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ItineraryContext.Provider
      value={{
        items,
        count,
        totalDistance: Number(totalDistance.toFixed(1)),
        estimatedTravelTime,
        totalBudget,
        drawerOpen,
        setDrawerOpen,
        addItem,
        removeItem,
        moveItem,
        clearItinerary,
        loadSavedItinerary,
        isItemInItinerary,
        saveActiveItinerary,
        savedItineraries,
        refreshSavedItineraries,
        deleteSavedItinerary,
        savedModalOpen,
        setSavedModalOpen
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
