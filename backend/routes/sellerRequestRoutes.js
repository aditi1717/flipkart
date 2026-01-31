import express from 'express';
const router = express.Router();
import {
    createSellerRequest,
    getSellerRequests,
    updateSellerRequestStatus,
    deleteSellerRequest
} from '../controllers/sellerRequestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, admin, getSellerRequests)
    .post(createSellerRequest);

router.route('/:id')
    .put(protect, admin, updateSellerRequestStatus)
    .delete(protect, admin, deleteSellerRequest);

export default router;
