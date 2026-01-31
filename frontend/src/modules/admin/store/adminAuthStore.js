import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../../../services/api';

const useAdminAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            adminUser: null,
            error: null,

            // Real login
            login: async (email, password) => {
                try {
                    const { data } = await API.post('/admin/login', { email, password });
                    if (data.isAdmin || data.role === 'superadmin' || data.role === 'admin') {
                        set({
                            isAuthenticated: true,
                            adminUser: data,
                            error: null
                        });
                        return true;
                    } else {
                        set({ error: 'Not authorized as admin' });
                        return false;
                    }
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isAuthenticated: false
                    });
                     return false;
                }
            },

            logout: async () => {
                try {
                    await API.post('/admin/logout');
                } catch (e) { console.error(e); }
                set({
                    isAuthenticated: false,
                    adminUser: null
                });
            },

            // Update admin profile
            updateProfile: async (profileData) => {
                try {
                    const { data } = await API.put('/admin/profile', profileData);
                    set({
                        adminUser: data,
                        error: null
                    });
                    return data;
                } catch (error) {
                    set({
                        error: error.response?.data?.message || 'Update failed'
                    });
                    throw error;
                }
            }
        }),
        {
            name: 'admin-auth-storage'
        }
    )
);

export default useAdminAuthStore;
