import { Place } from '../models/Place.js';
import { writeAudit } from '../models/AuditLog.js';

const VALID_CATEGORIES = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Culinary'];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function getAllPlaces(req, res) {
  try {
    const { search, category, sort, page = '1', limit = '10' } = req.query;

    const filter = {};

    if (category && typeof category === 'string' && category !== 'All') {
      filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, 'i');
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ name: rx }, { description: rx }, { travelTips: rx }, { safetyInfo: rx }];
    }

    let sortSpec = { distance: 1 };
    if (sort === 'name') sortSpec = { name: 1 };
    else if (sort === 'fee_low') sortSpec = { entranceFee: 1 };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const total = await Place.countDocuments(filter);
    const places = await Place.find(filter)
      .collation({ locale: 'en' })
      .sort(sortSpec)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: places.length,
      places
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attractions.' });
  }
}

export async function getPlaceById(req, res) {
  try {
    const place = await Place.findOne({ id: req.params.id });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Attraction not found.' });
    }

    return res.json({ success: true, place });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attraction details.' });
  }
}

export async function createPlace(req, res) {
  try {
    const {
      name,
      category,
      description,
      location,
      distance,
      openingHours,
      entranceFee,
      travelTips,
      safetyInfo,
      childFriendly,
      facilities,
      images
    } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Name must be at least 3 characters.' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}.`
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Description must be at least 10 characters.' });
    }

    const distNum = Number(distance);
    if (isNaN(distNum) || distNum < 0 || distNum > 25) {
      return res.status(400).json({
        success: false,
        message: 'Distance must be between 0 and 25 km (within Akkaraipattu regional scope).'
      });
    }

    const lat = location?.lat !== undefined ? Number(location.lat) : 7.2185;
    const lng = location?.lng !== undefined ? Number(location.lng) : 81.8498;

    const newPlace = await Place.create({
      id: `place-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim(),
      location: { lat, lng },
      distance: Number(distNum.toFixed(1)),
      openingHours: openingHours?.trim() || '08:00 AM - 06:00 PM',
      entranceFee: Math.max(0, Number(entranceFee) || 0),
      travelTips: travelTips?.trim() || 'Carry modest attire and sufficient drinking water.',
      safetyInfo: safetyInfo?.trim() || 'Exercise personal care and respect local cultural customs.',
      childFriendly: Boolean(childFriendly),
      facilities: Array.isArray(facilities) && facilities.length > 0 ? facilities : ['Parking', 'Restrooms'],
      images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/hero_akkaraipattu_1792478448218.jpg']
    });

    await writeAudit({
      adminId: req.user?.id || 'admin',
      adminEmail: req.user?.email || 'admin@visentrixia.lk',
      action: 'CREATE_PLACE',
      details: `Created new attraction "${newPlace.name}" (${newPlace.category}) at ${newPlace.distance}km.`,
      targetId: newPlace.id
    });

    return res.status(201).json({
      success: true,
      message: `Attraction "${newPlace.name}" created successfully.`,
      place: newPlace
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create attraction.' });
  }
}

export async function updatePlace(req, res) {
  try {
    const { id } = req.params;
    const place = await Place.findOne({ id });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Attraction not found.' });
    }

    const {
      name, category, description, location, distance, openingHours, entranceFee,
      travelTips, safetyInfo, childFriendly, facilities, images
    } = req.body;

    if (name) place.name = name.trim();
    if (category && VALID_CATEGORIES.includes(category)) place.category = category;
    if (description) place.description = description.trim();
    if (distance !== undefined) {
      const d = Number(distance);
      if (!isNaN(d) && d >= 0 && d <= 25) {
        place.distance = Number(d.toFixed(1));
      }
    }
    if (location && location.lat !== undefined && location.lng !== undefined) {
      place.location = { lat: Number(location.lat), lng: Number(location.lng) };
    }
    if (openingHours) place.openingHours = openingHours.trim();
    if (entranceFee !== undefined) place.entranceFee = Math.max(0, Number(entranceFee) || 0);
    if (travelTips) place.travelTips = travelTips.trim();
    if (safetyInfo) place.safetyInfo = safetyInfo.trim();
    if (childFriendly !== undefined) place.childFriendly = Boolean(childFriendly);
    if (Array.isArray(facilities)) place.facilities = facilities;
    if (Array.isArray(images) && images.length > 0) place.images = images;

    await place.save();

    await writeAudit({
      adminId: req.user?.id || 'admin',
      adminEmail: req.user?.email || 'admin@visentrixia.lk',
      action: 'UPDATE_PLACE',
      details: `Updated details for attraction "${place.name}".`,
      targetId: id
    });

    return res.json({
      success: true,
      message: `Attraction "${place.name}" updated successfully.`,
      place
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update attraction.' });
  }
}

export async function deletePlace(req, res) {
  try {
    const { id } = req.params;
    const place = await Place.findOneAndDelete({ id });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Attraction not found.' });
    }

    await writeAudit({
      adminId: req.user?.id || 'admin',
      adminEmail: req.user?.email || 'admin@visentrixia.lk',
      action: 'DELETE_PLACE',
      details: `Deleted attraction "${place.name}" (ID: ${id}).`,
      targetId: id
    });

    return res.json({
      success: true,
      message: `Attraction "${place.name}" deleted successfully.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete attraction.' });
  }
}

export async function getPlaceStats(req, res) {
  try {
    const places = await Place.find();
    const categoryCounts = {};
    VALID_CATEGORIES.forEach((c) => (categoryCounts[c] = 0));

    let totalDistance = 0;
    places.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      totalDistance += p.distance;
    });

    return res.json({
      success: true,
      totalPlaces: places.length,
      categoryCounts,
      averageDistance: places.length ? (totalDistance / places.length).toFixed(1) : '0',
      totalFreeAttractions: places.filter((p) => p.entranceFee === 0).length,
      totalChildFriendly: places.filter((p) => p.childFriendly).length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch statistics.' });
  }
}
