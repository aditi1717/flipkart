import SellerRequest from '../models/SellerRequest.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create a new seller request
// @route   POST /api/seller-requests
// @access  Public (User)
export const createSellerRequest = async (req, res) => {
    try {
        const { brandName, sellerRegNumber, contactNumber, email, gst } = req.body;

        const request = new SellerRequest({
            id: uuidv4(),
            brandName,
            sellerRegNumber,
            contactNumber,
            email,
            gst,
            status: 'pending'
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all seller requests
// @route   GET /api/seller-requests
// @access  Private/Admin
export const getSellerRequests = async (req, res) => {
    try {
        const requests = await SellerRequest.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update seller request status
// @route   PUT /api/seller-requests/:id
// @access  Private/Admin
export const updateSellerRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await SellerRequest.findOne({ id: req.params.id });

        if (request) {
            request.status = status;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Seller request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete seller request
// @route   DELETE /api/seller-requests/:id
// @access  Private/Admin
export const deleteSellerRequest = async (req, res) => {
    try {
        const request = await SellerRequest.findOne({ id: req.params.id });

        if (request) {
            await request.deleteOne();
            res.json({ message: 'Seller request removed' });
        } else {
            res.status(404).json({ message: 'Seller request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
