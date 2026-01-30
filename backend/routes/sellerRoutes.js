import express from 'express';
const router = express.Router();
import { getSellers, updateSellerStatus, deleteSeller } from '../controllers/sellerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, admin, getSellers);

router.route('/:id')
    .put(protect, admin, updateSellerStatus)
    .delete(protect, admin, deleteSeller);

export default router;
