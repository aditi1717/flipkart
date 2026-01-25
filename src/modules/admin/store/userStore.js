import { create } from 'zustand';

const mockUsers = [
    {
        id: 'USR001',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        type: 'customer',
        status: 'active',
        joinedDate: '2025-01-10',
        lastLogin: '2026-01-25T14:30:00Z',
        lastOrderDate: '2026-01-25T14:30:00Z',
        orderStats: {
            total: 5,
            completed: 3,
            pending: 2,
            cancelled: 0
        },
        financials: {
            totalSpent: 15499,
            avgOrderValue: 3100
        },
        address: 'H.No 45, Sector 12, Gurugram, Haryana - 122001',
        avatar: 'https://i.pravatar.cc/150?u=USR001'
    },
    {
        id: 'USR002',
        name: 'Aditi Singh',
        email: 'aditi@example.com',
        phone: '9123456789',
        type: 'customer',
        status: 'active',
        joinedDate: '2025-02-15',
        lastLogin: '2026-01-24T10:15:00Z',
        lastOrderDate: '2026-01-24T10:15:00Z',
        orderStats: {
            total: 3,
            completed: 2,
            pending: 1,
            cancelled: 0
        },
        financials: {
            totalSpent: 8990,
            avgOrderValue: 2997
        },
        address: 'A-201, Crystal Towers, Mumbai, Maharashtra - 400001',
        avatar: 'https://i.pravatar.cc/150?u=USR002'
    },
    {
        id: 'USR003',
        name: 'Priya Verma',
        email: 'priya@example.com',
        phone: '8888877777',
        type: 'customer',
        status: 'disabled',
        joinedDate: '2025-03-20',
        lastLogin: '2026-01-23T12:20:00Z',
        lastOrderDate: '2026-01-20T16:45:00Z',
        orderStats: {
            total: 1,
            completed: 1,
            pending: 0,
            cancelled: 0
        },
        financials: {
            totalSpent: 515,
            avgOrderValue: 515
        },
        address: 'Street No. 5, Model Town, Ludhiana, Punjab - 141001',
        avatar: 'https://i.pravatar.cc/150?u=USR003'
    },
    {
        id: 'USR004',
        name: 'Vikram Mehta',
        email: 'vikram@example.com',
        phone: '7777766666',
        type: 'customer',
        status: 'active',
        joinedDate: '2025-04-05',
        lastLogin: '2026-01-25T18:00:00Z',
        lastOrderDate: '2026-01-25T18:00:00Z',
        orderStats: {
            total: 2,
            completed: 0,
            pending: 2,
            cancelled: 0
        },
        financials: {
            totalSpent: 39999,
            avgOrderValue: 20000
        },
        address: 'Penthouse 5, Sky High, Bangalore, Karnataka - 560001',
        avatar: 'https://i.pravatar.cc/150?u=USR004'
    },
    {
        id: 'USR005',
        name: 'Suresh Kumar',
        email: 'suresh@example.com',
        phone: '6666655555',
        type: 'customer',
        status: 'active',
        joinedDate: '2025-05-12',
        lastLogin: '2026-01-10T11:00:00Z',
        lastOrderDate: null,
        orderStats: {
            total: 0,
            completed: 0,
            pending: 0,
            cancelled: 0
        },
        financials: {
            totalSpent: 0,
            avgOrderValue: 0
        },
        address: 'Flat 102, Green View, Pune, Maharashtra - 411001',
        avatar: 'https://i.pravatar.cc/150?u=USR005'
    }
];

const useUserStore = create((set) => ({
    users: mockUsers,
    isLoading: false,

    toggleUserStatus: (userId) => {
        set((state) => ({
            users: state.users.map(user =>
                user.id === userId
                    ? { ...user, status: user.status === 'active' ? 'disabled' : 'active' }
                    : user
            )
        }));
    },

    deleteUser: (userId) => {
        set((state) => ({
            users: state.users.filter(user => user.id !== userId)
        }));
    }
}));

export default useUserStore;
