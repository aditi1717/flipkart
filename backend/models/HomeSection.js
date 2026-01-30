import mongoose from 'mongoose';

const homeSectionSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 'trending', 'featured' etc or UUID
    title: { type: String, required: true },
    products: [{ 
        // Storing minimal embedded product info for performance, OR could reference Product IDs
        // For now, mirroring frontend structure which seems to embed full product objects or subset
        id: { type: Number }, // Frontend uses numeric IDs for products
        name: { type: String },
        image: { type: String },
        price: { type: Number },
        category: { type: String }
    }]
}, {
    timestamps: true,
});

const HomeSection = mongoose.model('HomeSection', homeSectionSchema);
export default HomeSection;
