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
                    const { data } = await API.post('/auth/login', { email, password });
                    if (data.isAdmin) {
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

            logout: () => {
                set({
                    isAuthenticated: false,
                    adminUser: null
                });
            }
        }),
        {
            name: 'admin-auth-storage'
        }
    )
);

export default useAdminAuthStore;
