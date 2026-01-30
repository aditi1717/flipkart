import { create } from 'zustand';

const usePlayStore = create((set, get) => ({
    reels: [
        {
            id: 1,
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
            thumbnailUrl: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Neon',
            caption: 'Summer Vibes Collection ☀️',
            productId: '101',
            productName: 'Neon T-Shirt',
            active: true,
            views: '1.2k',
            likes: '450'
        },
        {
            id: 2,
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
            thumbnailUrl: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Flowers',
            caption: 'Fresh Floral Prints 🌸',
            productId: '102',
            productName: 'Floral Dress',
            active: true,
            views: '850',
            likes: '230'
        }
    ],

    addReel: (reelData) => {
        set((state) => ({
            reels: [
                {
                    ...reelData,
                    id: Date.now(),
                    views: '0',
                    likes: '0'
                },
                ...state.reels
            ]
        }));
    },

    deleteReel: (id) => {
        set((state) => ({
            reels: state.reels.filter(r => r.id !== id)
        }));
    },

    toggleReelStatus: (id) => {
        set((state) => ({
            reels: state.reels.map(r =>
                r.id === id ? { ...r, active: !r.active } : r
            )
        }));
    },

    updateReel: (id, updates) => {
        set((state) => ({
            reels: state.reels.map(r =>
                r.id === id ? { ...r, ...updates } : r
            )
        }));
    }
}));

export default usePlayStore;
