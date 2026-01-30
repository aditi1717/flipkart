import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            adminUser: null,

            // Dummy login - checks against hardcoded credentials
            login: (email, password) => {
                // Hardcoded admin credentials for demo
                if (email === 'admin@flipkart.com' && password === 'admin123') {
                    set({
                        isAuthenticated: true,
                        adminUser: {
                            name: 'Admin User',
                            email: 'admin@flipkart.com',
                            role: 'Super Admin'
                        }
                    });
                    return true;
                }
                return false;
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
