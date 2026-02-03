import PinCode from '../models/PinCode.js';

// @desc    Add a new serviceable PIN code
// @route   POST /api/pincodes
// @access  Private/Admin
const addPinCode = async (req, res) => {
    const { code, deliveryTime, unit } = req.body;

    // Validate inputs
    if (!code || !deliveryTime || !unit) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const pinCodeExists = await PinCode.findOne({ code });

    if (pinCodeExists) {
        return res.status(400).json({ message: 'PIN Code already exists' });
    }

    const pinCode = await PinCode.create({
        code,
        deliveryTime,
        unit
    });

    if (pinCode) {
        res.status(201).json(pinCode);
    } else {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Get all PIN codes
// @route   GET /api/pincodes
// @access  Private/Admin
const getPinCodes = async (req, res) => {
    const pinCodes = await PinCode.find({}).sort({ createdAt: -1 });
    res.json(pinCodes);
};

// @desc    Delete a PIN code
// @route   DELETE /api/pincodes/:id
// @access  Private/Admin
const deletePinCode = async (req, res) => {
    const pinCode = await PinCode.findById(req.params.id);

    if (pinCode) {
        await pinCode.deleteOne();
        res.json({ message: 'PIN Code removed' });
    } else {
        res.status(404).json({ message: 'PIN Code not found' });
    }
};

// @desc    Check PIN code availability
// @route   GET /api/pincodes/check/:code
// @access  Public
const checkPinCode = async (req, res) => {
    const { code } = req.params;
    try {
        const pinCode = await PinCode.findOne({ code: code.trim() });

        if (pinCode && pinCode.isActive) {
            res.json({
                isServiceable: true,
                deliveryTime: pinCode.deliveryTime,
                unit: pinCode.unit,
                message: `Delivered in ${pinCode.deliveryTime} ${pinCode.unit}`
            });
        } else {
            res.json({
                isServiceable: false,
                message: 'Not deliverable to this location'
            });
        }
    } catch (error) {
        console.error(`Error checking pincode:`, error);
        res.status(500).json({ message: 'Error checking pincode' });
    }
};

export {
    addPinCode,
    getPinCodes,
    deletePinCode,
    checkPinCode
};
