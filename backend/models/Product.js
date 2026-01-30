import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping manual ID for sync with frontend data
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    // More fields can be added
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
