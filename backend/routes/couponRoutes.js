import express from 'express';
const router = express.Router();
import { getCoupons, createCoupon, updateCouponStatus, deleteCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, admin, getCoupons) // Or public if needed for checkout? Admin for now manager
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCouponStatus)
    .delete(protect, admin, deleteCoupon);

export default router;
