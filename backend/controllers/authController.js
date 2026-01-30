import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTP, verifyOTP } from '../utils/smsService.js';

// Generate JWT and set cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

// @desc    Send OTP for Login/Register
// @route   POST /api/auth/send-otp
// @access  Public
export const sendLoginOtp = async (req, res) => {
    const { mobile, userType } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
        const response = await sendOTP(mobile, userType || 'Customer');
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and Login/Register User
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyLoginOtp = async (req, res) => {
    const { mobile, otp, userType, name } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile and OTP are required' });
    }

    try {
        const isValid = await verifyOTP(mobile, otp, userType || 'Customer');

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

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
            isAdmin: user.isAdmin,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Email/Pass - Legacy/Admin)
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user (Email/Pass)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
    };
    res.status(200).json(user);
};
