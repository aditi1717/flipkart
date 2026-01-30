import express from 'express';
const router = express.Router();
import { addOrderItems } from '../controllers/orderController.js';

router.route('/').post(addOrderItems);

export default router;
