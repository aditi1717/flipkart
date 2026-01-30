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

    offers: [
        {
            id: 'OFF001',
            type: 'Bank Offer',
            title: '10% off on HDFC Bank Credit Card',
            description: 'Get 10% instant discount on HDFC Bank Credit Card transactions. Min purchase value ₹5000.',
            terms: 'Max discount up to ₹1500. TCA.',
            active: true
        },
        {
            id: 'OFF002',
            type: 'Partner Offer',
            title: 'Sign up for Flipkart Pay Later',
            description: 'Get ₹500 Gift Card on signing up for Flipkart Pay Later.',
            terms: 'Valid only for new signups.',
            active: true
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
    },

    addOffer: (offerData) => {
        set((state) => ({
            offers: [
                {
                    ...offerData,
                    id: `OFF${Date.now()}`,
                    active: true
                },
                ...state.offers
            ]
        }));
    },

    deleteOffer: (id) => {
        set((state) => ({
            offers: state.offers.filter(o => o.id !== id)
        }));
    },

    toggleOfferStatus: (id) => {
        set((state) => ({
            offers: state.offers.map(o =>
                o.id === id ? { ...o, active: !o.active } : o
            )
        }));
    }
}));

export default useCouponStore;
