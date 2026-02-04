import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema({
    section: { type: String, required: true }, // 'All', 'Electronics', 'HomeHero', etc.
    type: { type: String, default: 'slides', enum: ['slides', 'hero', 'card', 'product_feature'] }, 
    active: { type: Boolean, default: true },
    
    // For 'slides' type
    slides: [{
        imageUrl: { type: String },
        link: { type: String },
        linkedProduct: { type: mongoose.Schema.Types.Mixed }, // Store minimal product info or ID
        linkedOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }, // Link to offer
        targetType: { type: String, enum: ['product', 'offer', 'url'], default: 'product' }
    }],

    // For 'hero' type
    content: {
        brand: String,
        brandTag: String,
        title: String,
        subtitle: String,
        description: String,
        imageUrl: String,
        badgeText: String,
        offerText: String,
        offerBank: String,
        backgroundColor: String, // Optional gradient/color class
        link: { type: String },
        linkedProduct: { type: mongoose.Schema.Types.Mixed },
        linkedOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
        targetType: { type: String, enum: ['product', 'offer', 'url'], default: 'product' }
    }
}, {
    timestamps: true,
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
