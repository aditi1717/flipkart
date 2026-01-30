import express from 'express';
const router = express.Router();
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import upload from '../config/cloudinary.js';

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'variant_images', maxCount: 20 }]), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'variant_images', maxCount: 20 }]), updateProduct)
    .delete(protect, admin, deleteProduct);

export default router;
