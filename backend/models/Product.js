import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping manual ID for sync with frontend data logic (Date.now())
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String }, // Primary image
    images: [{ type: String }], // Gallery images
    category: { type: String, required: true }, // Main category name (Legacy/Display)
    categoryId: { type: Number }, // Main category ID (Legacy)
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }, // New Hierarchical Reference
    categoryPath: [{ type: String }], // Array of category IDs (breadcrumbs) - Changed to String to support both Number and ObjectId
    categoryPath: [{ type: Number }], // Array of category IDs (breadcrumbs)
    
    // Description & Meta
    shortDescription: { type: String },
    longDescription: { type: String },
    tags: [{ type: String }],
    
    // Specifications & Details
    highlights: [{
        key: { type: String },
        value: { type: String }
    }],
    specifications: [{
        key: { type: String },
        value: { type: String }
    }],
    features: [{ type: String }],
    manufacturerInfo: { type: String },
    deliveryDays: { type: Number, default: 5 },

    // Inventory & Variants
    stock: { type: Number, default: 0 },
    variantLabel: { type: String }, // 'Size', 'Color' etc.
    variantHeadings: [{
        id: { type: Number },
        name: { type: String },
        hasImage: { type: Boolean, default: false },
        options: [{
            name: { type: String },
            image: { type: String }
        }]
    }],
    skus: [{
        combination: { type: Map, of: String }, // e.g. { Color: "Red", Size: "M" }
        stock: { type: Number, default: 0 }
    }],
    
    // Legacy fields if needed
    colors: [{ type: String }], 
    sizes: [{ type: String }]

}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
