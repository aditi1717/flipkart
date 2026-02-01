import express from 'express';
const router = express.Router();
import {
    addPinCode,
    getPinCodes,
    deletePinCode,
    checkPinCode
} from '../controllers/pinCodeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, addPinCode).get(protect, admin, getPinCodes);
router.route('/check/:code').get(checkPinCode);
router.route('/:id').delete(protect, admin, deletePinCode);

export default router;
