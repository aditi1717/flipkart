import { create } from 'zustand';
import API from '../../../services/api';

const useReturnStore = create((set) => ({
    requests: [],
    isLoading: false,

    fetchReturns: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/returns');
            set({ requests: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    updateStatus: async (id, status, note) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/returns/${id}`, { status, note });
            set((state) => ({
                requests: state.requests.map(r => r.id === id ? data : r),
                isLoading: false
            }));
        } catch (error) {
            set({ isLoading: false });
        }
    }
}));

export default useReturnStore;
