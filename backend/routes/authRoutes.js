import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    sendLoginOtp,
    verifyLoginOtp,
    logoutUser,
    getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendLoginOtp);
router.post('/verify-otp', verifyLoginOtp);
router.get('/me', protect, getUserProfile);

export default router;
