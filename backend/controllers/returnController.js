import Return from '../models/Return.js';

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private/Admin
export const getReturns = async (req, res) => {
    try {
        const returns = await Return.find({});
        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update return status
// @route   PUT /api/returns/:id
// @access  Private/Admin
export const updateReturnStatus = async (req, res) => {
    try {
        const returnRequest = await Return.findOne({ id: req.params.id });

        if (returnRequest) {
            returnRequest.status = req.body.status || returnRequest.status;
            if (req.body.note) {
                returnRequest.timeline.push({
                    status: req.body.status,
                    note: req.body.note
                });
            }
            const updatedReturn = await returnRequest.save();
            res.json(updatedReturn);
        } else {
            res.status(404).json({ message: 'Return request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
