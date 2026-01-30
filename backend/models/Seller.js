import mongoose from 'mongoose';

const sellerSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    brandName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailId: { type: String, required: true },
    gstNumber: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    joinedDate: { type: String } // Keeping as string to match frontend usually formatted, or use Date
}, {
    timestamps: true,
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
