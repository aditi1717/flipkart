const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    bannerImage: { type: String },
    bannerAlt: { type: String },
    secondaryBannerImage: { type: String },
    banners: [{
        id: Number,
        image: String,
        alt: String
    }]
});

const categorySchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String }, // Material Icon name
    bannerImage: { type: String },
    bannerAlt: { type: String },
    secondaryBannerImage: { type: String },
    subCategories: [subCategorySchema],
    deals: [{ // Specific for 'Electronics' category in mock
        name: String,
        offer: String,
        image: String,
    }],
    scrollDeals: [{ // Specific for 'Electronics' category in mock
        name: String,
        offer: String,
        image: String
    }],
    salesBanners: [{
         id: Number, 
         image: String, 
         alt: String 
    }]
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
