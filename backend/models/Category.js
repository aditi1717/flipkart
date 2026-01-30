import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String },
    bannerImage: { type: String },
    bannerAlt: { type: String },
    bannerImage: { type: String },
    bannerAlt: { type: String },
    // subCategories removed - now using separate SubCategory model
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
