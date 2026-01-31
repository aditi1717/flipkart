import mongoose from 'mongoose';

const sellerRequestSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    brandName: { type: String, required: true },
    sellerRegNumber: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    gst: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    }
}, {
    timestamps: true,
});

const SellerRequest = mongoose.model('SellerRequest', sellerRequestSchema);
export default SellerRequest;
