import { create } from 'zustand';

const mockOrders = [
    {
        id: 'ORD12543',
        user: { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210' },
        items: [
            { id: 1, name: 'Kvinner Casual Regular Fit Tops', price: 360, quantity: 2, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=300' },
            { id: 4, name: 'Smart Phone X', price: 18499, quantity: 1, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300' }
        ],
        total: 19219,
        status: 'Confirmed',
        payment: { method: 'UPI', status: 'Paid', transactionId: 'TXN987654321' },
        address: {
            name: 'Rahul Sharma',
            line: 'H.No 45, Sector 12',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122001',
            type: 'Home'
        },
        date: '2026-01-25T14:30:00Z',
        timeline: [
            { status: 'Pending', time: '2026-01-25T14:30:00Z', note: 'Order placed' },
            { status: 'Confirmed', time: '2026-01-25T15:00:00Z', note: 'Order confirmed by seller' }
        ]
    },
    {
        id: 'ORD12544',
        user: { name: 'Aditi Singh', email: 'aditi@example.com', phone: '+91 91234 56789' },
        items: [
            { id: 3, name: 'Acer Iconia Tab i8', price: 9990, quantity: 1, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300' }
        ],
        total: 9990,
        status: 'Shipped',
        payment: { method: 'Debit Card', status: 'Paid', transactionId: 'TXN1122334455' },
        address: {
            name: 'Aditi Singh',
            line: 'A-201, Crystal Towers',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            type: 'Work'
        },
        date: '2026-01-24T10:15:00Z',
        timeline: [
            { status: 'Pending', time: '2026-01-24T10:15:00Z', note: 'Order placed' },
            { status: 'Confirmed', time: '2026-01-24T11:00:00Z', note: 'Order confirmed' },
            { status: 'Shipped', time: '2026-01-25T09:00:00Z', note: 'Packed and dispatched via BlueDart' }
        ]
    },
    {
        id: 'ORD12545',
        user: { name: 'Priya Verma', email: 'priya@example.com', phone: '+91 88888 77777' },
        items: [
            { id: 25, name: 'Mamaearth Rosemary Kit', price: 515, quantity: 3, image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/shampoo/j/x/o/-original-imagm5y2j5j5z5e6.jpeg?q=70' }
        ],
        total: 1545,
        status: 'Delivered',
        payment: { method: 'COD', status: 'Paid', transactionId: 'COD_ORD12545' },
        address: {
            name: 'Priya Verma',
            line: 'Street No. 5, Model Town',
            city: 'Ludhiana',
            state: 'Punjab',
            pincode: '141001',
            type: 'Home'
        },
        date: '2026-01-20T16:45:00Z',
        timeline: [
            { status: 'Pending', time: '2026-01-20T16:45:00Z' },
            { status: 'Confirmed', time: '2026-01-20T17:30:00Z' },
            { status: 'Shipped', time: '2026-01-21T10:00:00Z' },
            { status: 'Delivered', time: '2026-01-23T12:20:00Z', note: 'Handed over to customer' }
        ]
    },
    {
        id: 'ORD12546',
        user: { name: 'Vikram Mehta', email: 'vikram@example.com', phone: '+91 77777 66666' },
        items: [
            { id: 23, name: 'HP Laptop 15s Ryzen 5', price: 39999, quantity: 1, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300' }
        ],
        total: 39999,
        status: 'Pending',
        payment: { method: 'Net Banking', status: 'Pending' },
        address: {
            name: 'Vikram Mehta',
            line: 'Penthouse 5, Sky High',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            type: 'Home'
        },
        date: '2026-01-25T18:00:00Z',
        timeline: [
            { status: 'Pending', time: '2026-01-25T18:00:00Z', note: 'Waiting for payment confirmation' }
        ]
    }
];

const useOrderStore = create((set) => ({
    orders: mockOrders,
    isLoading: false,

    // Actions
    updateOrderStatus: (orderId, status, note = '') => {
        set((state) => ({
            orders: state.orders.map(order =>
                order.id === orderId
                    ? {
                        ...order,
                        status,
                        timeline: [...order.timeline, { status, time: new Date().toISOString(), note }]
                    }
                    : order
            )
        }));
    },

    cancelOrder: (orderId, reason = '') => {
        set((state) => ({
            orders: state.orders.map(order =>
                order.id === orderId
                    ? {
                        ...order,
                        status: 'Cancelled',
                        timeline: [...order.timeline, { status: 'Cancelled', time: new Date().toISOString(), note: `Cancelled: ${reason}` }]
                    }
                    : order
            )
        }));
    }
}));

export default useOrderStore;
