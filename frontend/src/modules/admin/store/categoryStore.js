import { create } from 'zustand';
import API from '../../../services/api';

const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    // Selectors
    getAllCategoriesFlat: () => {
        const categories = get().categories;
        const flatten = (cats, level = 0) => {
            let result = [];
            for (const cat of cats) {
                result.push({ ...cat, level });
                // Check if subCategories exists and has items
                // Note: The backend might populate subCategories, or it might be just IDs. 
                // However, based on the frontend usage so far, we treat them as nested objects for display if available.
                // If they are just IDs, this map won't work for display names. 
                // Assuming the fetchCategories populates them or they are embedded.
                if (cat.subCategories && Array.isArray(cat.subCategories) && cat.subCategories.length > 0) {
                    result = result.concat(flatten(cat.subCategories, level + 1));
                }
            }
            return result;
        };
        return flatten(categories);
    },

    // Actions
    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/categories');
            set({ categories: data, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    },

    addCategory: async (categoryData) => {
        set({ isLoading: true });
        try {
            const { data } = await API.post('/categories', categoryData);
            set((state) => ({
                categories: [...state.categories, data],
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
            throw error;
        }
    },

    updateCategory: async (id, updatedData) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/categories/${id}`, updatedData);
            set((state) => ({
                categories: state.categories.map(c => c.id === id ? data : c),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true });
        try {
            await API.delete(`/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter(c => c.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
            throw error;
        }
    },

    toggleCategoryStatus: async (id) => {
        set({ isLoading: true });
        try {
            // Determine current status to toggle it.
            // Note: Ideally the backend should handle the toggle logic or we pass the new boolean.
            // For now, let's assume we find it in state or pass isActive flag to backend.
            // But since we don't have the current state easily accessible without searching, 
            // maybe we can just assume the backend has a specific toggle endpoint or we just send an update.
            // For this implementation, I'll fetch the category or just send a generic update if backend supports it.
            // Better yet, let's just find it in local state.
            const category = get().categories.find(c => c.id === id);
            // If deeply nested, this search might fail. 
            // However, the standard `updateCategory` should be sufficient if we pass the toggled value.
            
            // NOTE: Since the backend might not have a specific toggle endpoint, 
            // and `updateCategory` implementation already exists, 
            // we should rely on the component to pass the *new* status or handle it here if possible.
            // Given the component just calls `toggleCategoryStatus(id)`, it expects the store to handle the logic.
            
            // We need to implement a deep find if categories are nested.
             const findCategory = (cats) => {
                for (const cat of cats) {
                    if (cat.id === id) return cat;
                    if (cat.items) { // Check 'items' or 'children' or 'subCategories' depending on structure
                        const found = findCategory(cat.items || cat.children || cat.subCategories || []);
                        if (found) return found;
                    }
                }
                return null;
            };

            // Recursively find category to get current active status
            const currentCat = findCategory(get().categories);
            const currentStatus = currentCat?.active ?? true; // Default to true if not found to potentially fail gracefully or strict

            // Call update
            const { data } = await API.put(`/categories/${id}`, { active: !currentStatus });
            
            // Update state recursively
             const updateRecursive = (cats) => {
                return cats.map(cat => {
                    if (cat.id === id) return data;
                    if (cat.children) return { ...cat, children: updateRecursive(cat.children) }; // Assuming 'children' prop
                    return cat;
                });
            };

            set((state) => ({
                categories: updateRecursive(state.categories),
                isLoading: false
            }));

        } catch (error) {
             set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    }
}));

export default useCategoryStore;
