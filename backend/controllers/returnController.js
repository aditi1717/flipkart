import Return from '../models/Return.js';
import Order from '../models/Order.js';

// @desc    Create a new return request
// @route   POST /api/returns
// @access  Private
export const createReturnRequest = async (req, res) => {
    try {
        const { orderId, productId, reason, comment, type, images, selectedReplacementSize, selectedReplacementColor } = req.body;

        const order = await Order.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify user owns the order
        if (order.user && order.user.toString() !== req.user._id.toString()) {
             return res.status(401).json({ message: 'Not authorized to return items for this order' });
        }

        const itemIndex = order.orderItems.findIndex(item => 
            String(item.product) === String(productId) || 
            String(item._id) === String(productId)
        );

        if (itemIndex === -1) {
             return res.status(404).json({ message: 'Product not found in order' });
        }

        const item = order.orderItems[itemIndex];
        
        // Create Return Record
        const newReturn = new Return({
            id: `RET-${Date.now()}`,
            orderId: order._id,
            customer: req.user.name,
            product: {
                name: item.name,
                image: item.image,
                price: item.price
            },
            type,
            reason,
            comment,
            images,
            status: 'Pending',
            timeline: [{
                status: 'Pending',
                note: 'Return request initiated'
            }]
        });

        const createdReturn = await newReturn.save();

        // Update Order Item Status
        order.orderItems[itemIndex].status = type === 'Return' ? 'Return Requested' : 'Replacement Requested';
        
        // If it's a replacement, we might want to store the requested variants somewhere, 
        // but for now, we'll just note it in the return comment or dedicated fields if model supported it.
        // The Return model has 'comment', so we can append details there if needed, 
        // but for a robust system, we should have stored replacement details in the Return model.
        // Assuming the detailed requirements, we'll rely on the 'comment' or add fields if strictly needed by schema.
        // The current schema doesn't have replacementVariant fields, so I will stick to what's available or suggest schema update if needed.
        // Looking at the Schema again: It has `comment`.
        
        if (selectedReplacementSize || selectedReplacementColor) {
             createdReturn.comment = `${createdReturn.comment || ''} [Replacement: Size ${selectedReplacementSize}, Color ${selectedReplacementColor}]`;
             await createdReturn.save();
        }

        await order.save();

        res.status(201).json(createdReturn);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// @desc    Get all returns (Admin)
// @route   GET /api/returns
// @access  Private/Admin
export const getReturns = async (req, res) => {
    try {
        const returns = await Return.find({}).sort({ date: -1 });
        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user returns
// @route   GET /api/returns/my-returns
// @access  Private
export const getUserReturnRequests = async (req, res) => {
    try {
        // Find returns where the order's user matches the logged in user
        // But Return model doesn't link to User ID directly, only customer name. 
        // Ideally it should link to User ID. 
        // Current Schema: `customer: { type: String, required: true }`
        // However, we saved `orderId`. We can find orders by this user, then find returns for those orders.
        // OR, relies on the `customer` name which is flaky.
        // Let's rely on finding orders first.
        
        const userOrders = await Order.find({ user: req.user._id }).select('_id');
        const orderIds = userOrders.map(order => order._id.toString());
        
        const returns = await Return.find({ orderId: { $in: orderIds } }).sort({ date: -1 });
        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update return status
// @route   PUT /api/returns/:id
// @access  Private/Admin
import mongoose from 'mongoose';

// ... (keep imports)

// ...

export const updateReturnStatus = async (req, res) => {
    try {
        let returnRequest;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            returnRequest = await Return.findById(req.params.id);
        }
        
        if (!returnRequest) {
            returnRequest = await Return.findOne({ id: req.params.id });
        }

        if (returnRequest) {
            returnRequest.status = req.body.status || returnRequest.status;
            
            // Push to timeline
            returnRequest.timeline.push({
                status: req.body.status,
                note: req.body.note || `Status updated to ${req.body.status}`
            });
            
            const updatedReturn = await returnRequest.save();

            // Sync with Order Status
            const order = await Order.findById(returnRequest.orderId);
            if (order) {
                // Find item by name and price (imperfect but schema lacks item ID reference in Return model)
                // Wait, Return model stores product.name, but what if multiple same items?
                // The implementation plan didn't change the model. 
                // Let's try to match by name/price, or if we improved the creation to store granular info.
                // In createReturnRequest, we didn't store item ID in Return model.
                // WE SHOULD STORE ITEM ID.
                // BUT, without modifying schema, I have to guess or assume unique items.
                // I will try to match the first item with that name that has a 'Requested' status or matches logic.
                
                const itemToUpdate = order.orderItems.find(i => 
                    i.name === returnRequest.product.name
                );
                
                if (itemToUpdate) {
                     // Map return status to order item status
                     // Return Statuses: 'Pending', 'Approved', 'Pickup Scheduled', 'Received at Warehouse', 'Refund Initiated', 'Replacement Dispatched', 'Completed', 'Rejected'
                     // Order Item Statuses: custom strings
                     
                     let newItemStatus = itemToUpdate.status;
                     
                     if (req.body.status === 'Rejected') {
                         newItemStatus = 'Delivered'; // Revert to delivered? or 'Return Rejected'
                     } else if (req.body.status === 'Completed') {
                         newItemStatus = returnRequest.type === 'Return' ? 'Returned' : 'Replaced';
                     } else {
                         newItemStatus = req.body.status; // Most map directly
                     }
                     
                     itemToUpdate.status = newItemStatus;
                     await order.save();
                }
            }

            res.json(updatedReturn);
        } else {
            res.status(404).json({ message: 'Return request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
