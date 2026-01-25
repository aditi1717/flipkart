import { create } from 'zustand';

const useCouponStore = create((set) => ({
    coupons: [
        {
            id: 'C001',
            code: 'WELCOME50',
            title: 'New User Offer',
            description: 'Get 50% off on your first order above ₹500',
            type: 'percentage', // percentage | flat
            value: 50,
            minPurchase: 500,
            maxDiscount: 100,
            expiryDate: '2024-12-31',
            active: true,
            usageCount: 45,
            userSegment: 'new_user', // all | new_user | existing_user
            applicableCategory: 'all' // all | electronics | fashion | ...
        },
        {
            id: 'C002',
            code: 'FLAT200',
            title: 'Flat ₹200 OFF',
            description: 'Flat Rs. 200 off on all orders above ₹1000',
            type: 'flat',
            value: 200,
            minPurchase: 1000,
            maxDiscount: 200,
            expiryDate: '2024-10-15',
            active: true,
            usageCount: 12,
            userSegment: 'all',
            applicableCategory: 'fashion'
        }
    ],

    addCoupon: (couponData) => {
        set((state) => ({
            coupons: [
                {
                    ...couponData,
                    id: `C${Date.now()}`,
                    active: true,
                    usageCount: 0
                },
                ...state.coupons
            ]
        }));
    },

    deleteCoupon: (id) => {
        set((state) => ({
            coupons: state.coupons.filter(c => c.id !== id)
        }));
    },

    toggleCouponStatus: (id) => {
        set((state) => ({
            coupons: state.coupons.map(c =>
                c.id === id ? { ...c, active: !c.active } : c
            )
        }));
    }
}));

export default useCouponStore;
