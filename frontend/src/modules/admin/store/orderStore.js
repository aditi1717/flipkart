import { create } from 'zustand';
import API from '../../../services/api';

const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/orders');
            set({ orders: data, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    },

    updateOrderStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/orders/${id}/status`, { status });
            set((state) => ({
                orders: state.orders.map(o => o._id === id ? data : o),
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

export default useOrderStore;
