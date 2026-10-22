import { Router } from 'express';
import {
  getSavedItineraries,
  saveItinerary,
  deleteItinerary
} from '../controllers/itineraryController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getSavedItineraries);
router.post('/', authenticate, saveItinerary);
router.delete('/:id', authenticate, deleteItinerary);

export default router;
