import { create } from 'zustand';
import { products as initialProducts } from '../../user/data/mockData';

const useProductStore = create((set) => ({
    products: initialProducts, // Initialize with mock data
    isLoading: false,

    // Actions
    addProduct: (product) => {
        set((state) => ({
            products: [{ ...product, id: Date.now(), rating: 0, reviews: [] }, ...state.products]
        }));
    },

    updateProduct: (id, updatedData) => {
        set((state) => ({
            products: state.products.map(p => p.id === id ? { ...p, ...updatedData } : p)
        }));
    },

    deleteProduct: (id) => {
        set((state) => ({
            products: state.products.filter(p => p.id !== id)
        }));
    },

    // Helper to get formatted product for editing
    getProductById: (id) => {
        return (state) => state.products.find(p => p.id === id);
    }
}));

export default useProductStore;
