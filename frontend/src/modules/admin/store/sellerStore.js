import { create } from 'zustand';
import API from '../../../services/api';

const useSellerStore = create((set) => ({
    sellers: [],
    isLoading: false,

    fetchSellers: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/seller-requests');
            set({ sellers: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateSellerStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/seller-requests/${id}`, { status });
            set((state) => ({
                sellers: state.sellers.map(s => s.id === id ? data : s),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    },

    approveSeller: async (id) => {
        const { updateSellerStatus } = useSellerStore.getState();
        await updateSellerStatus(id, 'approved');
    },

    rejectSeller: async (id) => {
        const { updateSellerStatus } = useSellerStore.getState();
        await updateSellerStatus(id, 'rejected');
    },

    deleteSeller: async (id) => {
        set({ isLoading: true });
        try {
            await API.delete(`/seller-requests/${id}`);
            set((state) => ({
                sellers: state.sellers.filter(s => s.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    },

    submitSellerRequest: async (formData) => {
        try {
            await API.post('/seller-requests', formData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Submission failed' };
        }
    }
}));

export default useSellerStore;
