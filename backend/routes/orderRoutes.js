import express from 'express';
const router = express.Router();
import { 
    addOrderItems, 
    getOrders, 
    updateOrderToDelivered,
    updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(addOrderItems) // Public/User for creating
    .get(protect, admin, getOrders); // Admin for listing

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
