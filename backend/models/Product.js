const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping numerical ID for compatibility with frontend mocks
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String }, // e.g. "50% off"
    rating: { type: Number, default: 0 },
    ratingCount: { type: String }, // e.g. "(1,234)" or Number
    image: { type: String, required: true },
    images: [{ type: String }], // Additional images
    category: { type: String, required: true },
    tags: [{ type: String }],
    description: { type: String },
    features: [{ type: String }],
    ram: { type: String }, // For mobiles/electronics
    storage: { type: String }, // For mobiles/electronics
    isSponsored: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    buyAt: { type: Number }, // Special deal price logic from mock
    expiry: { type: String }, // For health products
    quantity: { type: String }, // For health/grocery
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
