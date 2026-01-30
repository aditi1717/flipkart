import { create } from 'zustand';
import API from '../../../services/api';

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,

    // Check if user is logged in (on app mount)
    checkAuth: async () => {
        try {
            const { data } = await API.get('/auth/me');
            set({ user: data, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    // Send OTP
    sendOtp: async (mobile, userType = 'Customer') => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.post('/auth/send-otp', { mobile, userType });
            set({ loading: false });
            return data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to send OTP' 
            });
            throw error;
        }
    },

    // Verify OTP & Login
    verifyOtp: async (mobile, otp, userType = 'Customer', name = '') => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.post('/auth/verify-otp', { mobile, otp, userType, name });
            set({ user: data, isAuthenticated: true, loading: false });
            return data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to verify OTP' 
            });
            throw error;
        }
    },

    // Login with Email/Password
    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.post('/auth/login', { email, password });
            set({ user: data, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Login failed' 
            });
            throw error;
        }
    },

    // Signup
    signup: async (userData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await API.post('/auth/register', userData);
            set({ user: data, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ 
                loading: false, 
                error: error.response?.data?.message || 'Signup failed' 
            });
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await API.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error('Logout failed', error);
            // Force client-side logout anyway
            set({ user: null, isAuthenticated: false });
        }
    }
}));
