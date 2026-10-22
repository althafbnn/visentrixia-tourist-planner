import { Router } from 'express';
import {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getPlaceStats
} from '../controllers/placeController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllPlaces);
router.get('/stats', getPlaceStats);
router.get('/:id', getPlaceById);

router.post('/', authenticate, requireAdmin, createPlace);
router.put('/:id', authenticate, requireAdmin, updatePlace);
router.delete('/:id', authenticate, requireAdmin, deletePlace);

export default router;
