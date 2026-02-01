import { create } from 'zustand';
import API from '../../../services/api';
import toast from 'react-hot-toast';

const usePinCodeStore = create((set, get) => ({
    pinCodes: [],
    isLoading: false,
    
    fetchPinCodes: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/pincodes');
            set({ pinCodes: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
            // toast.error('Failed to load PIN codes');
        }
    },

    addPinCode: async (pinData) => {
        set({ isLoading: true });
        try {
            const { data } = await API.post('/pincodes', pinData);
            set(state => ({ 
                pinCodes: [data, ...state.pinCodes],
                isLoading: false 
            }));
            toast.success('PIN Code added successfully');
            return true;
        } catch (error) {
            set({ isLoading: false });
            const message = error.response?.data?.message || 'Failed to add PIN code';
            toast.error(message);
            return false;
        }
    },

    deletePinCode: async (id) => {
        if (!window.confirm('Are you sure you want to delete this PIN Code?')) return;
        
        try {
            await API.delete(`/pincodes/${id}`);
            set(state => ({
                pinCodes: state.pinCodes.filter(p => p._id !== id)
            }));
            toast.success('PIN Code deleted');
        } catch (error) {
            toast.error('Failed to delete PIN Code');
        }
    }
}));

export default usePinCodeStore;
