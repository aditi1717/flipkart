import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    sendLoginOtp,
    verifyLoginOtp,
    logoutUser,
    getUserProfile,
    getUsers,
    deleteUser,
    updateUser,
    updateUserProfile,
    toggleUserStatus
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendLoginOtp);
router.post('/verify-otp', verifyLoginOtp);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin Routes
router.route('/users')
    .get(protect, admin, getUsers);

router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

router.patch('/users/:id/toggle-status', protect, admin, toggleUserStatus);

export default router;
