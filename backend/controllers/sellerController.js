import Seller from '../models/Seller.js';

// @desc    Get all sellers
// @route   GET /api/sellers
// @access  Private/Admin
export const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({});
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update seller status
// @route   PUT /api/sellers/:id
// @access  Private/Admin
export const updateSellerStatus = async (req, res) => {
    try {
        const seller = await Seller.findOne({ id: req.params.id });
        if (seller) {
            seller.status = req.body.status || seller.status;
            const updatedSeller = await seller.save();
            res.json(updatedSeller);
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete seller
// @route   DELETE /api/sellers/:id
// @access  Private/Admin
export const deleteSeller = async (req, res) => {
    try {
        const seller = await Seller.findOne({ id: req.params.id });
        if (seller) {
            await seller.deleteOne();
            res.json({ message: 'Seller removed' });
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
