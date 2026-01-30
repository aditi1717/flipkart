import { create } from 'zustand';
import API from '../../../services/api';

const useSellerStore = create((set) => ({
    sellers: [],
    isLoading: false,

    fetchSellers: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/sellers');
            set({ sellers: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateSellerStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/sellers/${id}`, { status });
            set((state) => ({
                sellers: state.sellers.map(s => s.id === id ? data : s),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    },

    deleteSeller: async (id) => {
        set({ isLoading: true });
        try {
            await API.delete(`/sellers/${id}`);
            set((state) => ({
                sellers: state.sellers.filter(s => s.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    }
}));

export default useSellerStore;
