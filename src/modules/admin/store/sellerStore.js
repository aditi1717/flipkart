import { create } from 'zustand';

const useSellerStore = create((set, get) => ({
    sellers: [
        {
            id: 'S001',
            contactNumber: '9876543210',
            emailId: 'business@techworld.com',
            gstNumber: 'GSTIN12345678',
            brandName: 'Tech World',
            registrationNumber: 'REG-2024-001',
            status: 'pending',
            joinedDate: '2024-01-20'
        },
        {
            id: 'S002',
            contactNumber: '8765432109',
            emailId: 'fashion@hub.com',
            gstNumber: 'GSTIN87654321',
            brandName: 'Fashion Hub',
            registrationNumber: 'REG-2024-002',
            status: 'approved',
            joinedDate: '2024-01-15'
        }
    ],

    // Approve Seller
    approveSeller: (id) => {
        set((state) => ({
            sellers: state.sellers.map(s =>
                s.id === id ? { ...s, status: 'approved' } : s
            )
        }));
    },

    // Reject Seller
    rejectSeller: (id) => {
        set((state) => ({
            sellers: state.sellers.map(s =>
                s.id === id ? { ...s, status: 'rejected' } : s
            )
        }));
    },

    // Delete Seller
    deleteSeller: (id) => {
        set((state) => ({
            sellers: state.sellers.filter(s => s.id !== id)
        }));
    },

    // Add new seller application
    addSeller: (sellerData) => {
        set((state) => ({
            sellers: [{ ...sellerData, id: `S${Date.now()}`, status: 'pending', joinedDate: new Date().toISOString().split('T')[0] }, ...state.sellers]
        }));
    }
}));

export default useSellerStore;
