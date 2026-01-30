import { create } from 'zustand';

const useBannerStore = create((set, get) => ({
    banners: [
        {
            id: 1,
            section: 'For You',
            active: true,
            slides: [
                {
                    id: 101,
                    imageUrl: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/1e1177023344f6f2.jpg?q=20',
                    targetType: 'product',
                    targetValue: '101'
                },
                {
                    id: 102,
                    imageUrl: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/a2dace751a021966.jpg?q=20',
                    targetType: 'url',
                    targetValue: '/category/electronics'
                }
            ]
        },
        {
            id: 2,
            section: 'Electronics',
            active: true,
            slides: [
                {
                    id: 201,
                    imageUrl: 'https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/aa1b23751a021921.jpg?q=20',
                    targetType: 'product',
                    targetValue: '102'
                }
            ]
        }
    ],

    // Add Banner
    addBanner: (bannerData) => {
        set((state) => ({
            banners: [
                ...state.banners,
                { ...bannerData, id: Date.now() }
            ]
        }));
    },

    // Update Banner
    updateBanner: (id, updates) => {
        set((state) => ({
            banners: state.banners.map(b =>
                b.id === id ? { ...b, ...updates } : b
            )
        }));
    },

    // Delete Banner
    deleteBanner: (id) => {
        set((state) => ({
            banners: state.banners.filter(b => b.id !== id)
        }));
    },

    // Toggle Active Status
    toggleBannerStatus: (id) => {
        set((state) => ({
            banners: state.banners.map(b =>
                b.id === id ? { ...b, active: !b.active } : b
            )
        }));
    }
}));

export default useBannerStore;
