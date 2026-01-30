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
    }
}));

export default useCategoryStore;
