import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
  deleteUserAccount
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);
router.get('/stats', getUserStats);
router.delete('/account', deleteUserAccount);

export default router;
