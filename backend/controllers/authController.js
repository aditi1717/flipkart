import User from '../models/User.js';
import Order from '../models/Order.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTP, verifyOTP } from '../utils/smsService.js';
import generateToken from '../utils/generateToken.js';

// ... (Existing Auth Functions) ...

// ... (Keep existing login/otp functions same, just appending admin functions) ...
// For brevity in this tool call, I will rewrite the file with appended functions.
// Actually, it's safer to read-modify, but since I have the full content, I can rewrite.
// Wait, to be safe and avoid regression, I'll copy the existing functions and add new ones.

export const sendLoginOtp = async (req, res) => {
    const { mobile, userType } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });
    try {
        const response = await sendOTP(mobile, userType || 'Customer');
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyLoginOtp = async (req, res) => {
    const { mobile, otp, userType, name } = req.body;
    if (!mobile || !otp) return res.status(400).json({ message: 'Mobile and OTP are required' });
    try {
        const isValid = await verifyOTP(mobile, otp, userType || 'Customer');
        if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });
        let user = await User.findOne({ $or: [{ email: mobile }, { phone: mobile }] });
        if (!user) {
            user = await User.create({
                name: name || 'New User',
                email: mobile,
                phone: mobile,
                password: await bcrypt.hash(Math.random().toString(36), 10),
            });
        }
        generateToken(res, user._id);
        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone,
            gender: user.gender,
            isAdmin: user.isAdmin 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone,
            gender: user.gender,
            isAdmin: user.isAdmin 
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = await User.create({ name, email, password });
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            phone: user.phone,
            gender: user.gender,
            isAdmin: user.isAdmin 
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getUserProfile = async (req, res) => {
    const user = { 
        _id: req.user._id, 
        name: req.user.name, 
        email: req.user.email, 
        phone: req.user.phone,
        gender: req.user.gender,
        isAdmin: req.user.isAdmin 
    };
    res.status(200).json(user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.mobile || req.body.phone || user.phone; // Use mobile or phone
            // Ensure gender is valid enum value
            if (req.body.gender) {
                user.gender = req.body.gender;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            generateToken(res, updatedUser._id);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error); // Log for debugging
        res.status(500).json({ message: error.message });
    }
};

// --- Admin Functions ---

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        
        // Fetch order counts for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const orderCount = await Order.countDocuments({ user: user._id });
            return {
                ...user._doc,
                joinedDate: user.createdAt,
                status: user.status || 'active',
                orderStats: {
                    total: orderCount
                }
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
        user.status = req.body.status || user.status;
        const updatedUser = await user.save();
        res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin, status: updatedUser.status });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle user status
// @route   PATCH /api/auth/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.status = user.status === 'active' ? 'disabled' : 'active';
            const updatedUser = await user.save();
            res.json({ message: `User status updated to ${updatedUser.status}`, status: updatedUser.status });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
