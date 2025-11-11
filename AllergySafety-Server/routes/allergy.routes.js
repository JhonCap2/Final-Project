import express from 'express';
import {
  getAllergies,
  getAllergy,
  createAllergy,
  updateAllergy,
  deleteAllergy,
  logReaction
} from '../controllers/allergy.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllergies);
router.post('/', createAllergy);
router.get('/:id', getAllergy);
router.put('/:id', updateAllergy);
router.delete('/:id', deleteAllergy);
router.post('/:id/reaction', logReaction);

export default router;
