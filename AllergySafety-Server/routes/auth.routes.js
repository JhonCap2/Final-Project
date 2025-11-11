import express from 'express';
import { register, login, getCurrentUser, verifyToken, logout, googleLogin, facebookLogin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.get('/verify', protect, verifyToken);
router.post('/logout', protect, logout);

export default router;
