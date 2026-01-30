import express from 'express';
const router = express.Router();
import { getReturns, updateReturnStatus } from '../controllers/returnController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, admin, getReturns);

router.route('/:id')
    .put(protect, admin, updateReturnStatus);

export default router;
