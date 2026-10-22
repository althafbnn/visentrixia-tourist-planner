import { Itinerary } from '../models/Itinerary.js';

export async function getSavedItineraries(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userItineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: userItineraries.length,
      itineraries: userItineraries
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch saved itineraries.' });
  }
}

export async function saveItinerary(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in or create an account to save itineraries.'
      });
    }

    const { title, placeIds, totalDistance, totalTravelTime, estimatedBudget, notes } = req.body;

    if (!Array.isArray(placeIds) || placeIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot save an empty itinerary. Add at least one attraction.' });
    }

    const newItinerary = await Itinerary.create({
      id: `itin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      title: title?.trim() || `Akkaraipattu Day Tour (${new Date().toLocaleDateString()})`,
      placeIds,
      totalDistance: Number(totalDistance) || 0,
      totalTravelTime: Number(totalTravelTime) || 0,
      estimatedBudget: Number(estimatedBudget) || 0,
      notes: notes?.trim() || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Itinerary saved to your account successfully!',
      itinerary: newItinerary
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save itinerary.' });
  }
}

export async function deleteItinerary(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const itinerary = await Itinerary.findOne({ id });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    if (itinerary.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not own this saved itinerary.' });
    }

    await Itinerary.deleteOne({ id });

    return res.json({
      success: true,
      message: 'Saved itinerary deleted.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete itinerary.' });
  }
}
