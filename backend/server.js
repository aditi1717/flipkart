import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// ... existing imports ...

// ... middleware ...

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reelRoutes from './routes/reelRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import homeSectionRoutes from './routes/homeSectionRoutes.js';
import contentPageRoutes from './routes/contentPageRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());



// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/home-sections', homeSectionRoutes);
app.use('/api/pages', contentPageRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
