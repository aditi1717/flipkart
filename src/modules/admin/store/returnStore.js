import { create } from 'zustand';

const mockReturns = [
    {
        id: 'RET44321',
        orderId: 'ORD12545',
        type: 'Return',
        customer: 'Priya Verma',
        product: {
            name: 'Mamaearth Rosemary Kit',
            image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/shampoo/j/x/o/-original-imagm5y2j5j5z5e6.jpeg?q=70',
            price: 515
        },
        reason: 'Defective Product',
        comment: 'The shampoo bottle was leaking when it arrived.',
        status: 'Pending',
        date: '2026-01-24T11:20:00Z',
        images: [
            'https://rukminim1.flixcart.com/image/612/612/xif0q/shampoo/j/x/o/-original-imagm5y2j5j5z5e6.jpeg?q=70'
        ],
        timeline: [
            { status: 'Pending', time: '2026-01-24T11:20:00Z', note: 'Request submitted by customer' }
        ]
    },
    {
        id: 'REP44322',
        orderId: 'ORD12544',
        type: 'Replacement',
        customer: 'Aditi Singh',
        product: {
            name: 'Acer Iconia Tab i8',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=300',
            price: 9990
        },
        reason: 'Wrong Color Received',
        comment: 'I ordered the Blue one but received the Gray version.',
        status: 'Pickup Scheduled',
        date: '2026-01-25T09:15:00Z',
        images: [],
        timeline: [
            { status: 'Pending', time: '2026-01-25T09:15:00Z', note: 'Request submitted' },
            { status: 'Approved', time: '2026-01-25T10:00:00Z', note: 'Verified by returns team' },
            { status: 'Pickup Scheduled', time: '2026-01-25T14:30:00Z', note: 'Pickup scheduled for tomorrow' }
        ]
    },
    {
        id: 'RET44323',
        orderId: 'ORD12541',
        type: 'Return',
        customer: 'Rahul Sharma',
        product: {
            name: 'Sennheiser HD 450SE',
            image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/headphone/9/f/v/hd-450se-sennheiser-original-imaghyzwzrgzrgzz.jpeg?q=70',
            price: 7490
        },
        reason: 'Performance Not Satisfactory',
        comment: 'The noise cancellation is not as expected.',
        status: 'Refund Processed',
        date: '2026-01-23T14:20:00Z',
        images: [],
        timeline: [
            { status: 'Pending', time: '2026-01-23T14:20:00Z', note: 'Return request created' },
            { status: 'Approved', time: '2026-01-23T16:00:00Z', note: 'Return approved' },
            { status: 'Picked Up', time: '2026-01-24T11:00:00Z', note: 'Item picked up from customer' },
            { status: 'Refund Processed', time: '2026-01-25T10:00:00Z', note: 'Refund initiated to original payment method' }
        ]
    },
    {
        id: 'REP44324',
        orderId: 'ORD12540',
        type: 'Replacement',
        customer: 'Rahul Sharma',
        product: {
            name: 'Logitech MX Master 3S',
            image: 'https://rukminim1.flixcart.com/image/612/612/xif0q/mouse/p/6/v/mx-master-3s-logitech-original-imaghrzhgzugzyyy.jpeg?q=70',
            price: 9999
        },
        reason: 'Defective Product',
        comment: 'The scroll wheel is loose and makes a rattling sound.',
        status: 'Out for Replacement',
        date: '2026-01-25T08:30:00Z',
        images: [],
        timeline: [
            { status: 'Pending', time: '2026-01-25T08:30:00Z', note: 'Replacement request submitted' },
            { status: 'Approved', time: '2026-01-25T09:45:00Z', note: 'Checked and approved' },
            { status: 'Out for Replacement', time: '2026-01-25T15:00:00Z', note: 'New unit dispatched' }
        ]
    }
];

const useReturnStore = create((set) => ({
    returns: mockReturns,
    isLoading: false,

    updateReturnStatus: (id, status, note = '') => {
        set((state) => ({
            returns: state.returns.map(ret =>
                ret.id === id
                    ? {
                        ...ret,
                        status,
                        timeline: [...(ret.timeline || []), { status, time: new Date().toISOString(), note }]
                    }
                    : ret
            )
        }));
    }
}));

export default useReturnStore;
