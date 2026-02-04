import { create } from 'zustand';
import API from '../../../services/api';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/notifications');
            const unread = data.filter(n => !n.isRead).length;
            
            // Beep if new unread notifications found compared to previous state?
            // Simplest is to let the caller handle the sound or do it here if count increases
            const previousUnread = get().unreadCount;
            if (unread > previousUnread) {
                 // Option: Trigger sound from component to obey browser autoplay policies
            }

            set({ notifications: data, unreadCount: unread, isLoading: false });
        } catch (error) {
            console.error('Fetch notifications error:', error);
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            set((state) => {
                const updatedNotifications = state.notifications.map(n => 
                    n._id === id ? { ...n, isRead: true } : n
                );
                return {
                    notifications: updatedNotifications,
                    unreadCount: updatedNotifications.filter(n => !n.isRead).length
                };
            });
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await API.put('/notifications/read-all');
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (error) {
            console.error('Mark all read error:', error);
        }
    },

    playSound: () => {
        try {
            // Using a simple beep base64 for now
            // Or a hosted url. Let's use a simple beep data URI
            const beep = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            beep.volume = 0.5;
            beep.play().catch(e => console.log('Audio play block:', e));
        } catch (e) {
            console.error('Sound error:', e);
        }
    }
}));

export default useNotificationStore;
