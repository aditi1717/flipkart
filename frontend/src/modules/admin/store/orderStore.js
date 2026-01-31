import { create } from 'zustand';
import API from '../../../services/api';

const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const { data } = await API.get('/orders');
            // Transform backend data to match frontend structure
            const transformedOrders = data.map(order => ({
                ...order,
                id: order._id,
                date: order.createdAt,
                items: order.orderItems?.map(item => ({
                    id: item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.qty
                })) || [],
                total: order.totalPrice,
                payment: {
                    method: order.paymentMethod === 'COD' ? 'COD' : order.paymentMethod,
                    status: order.isPaid ? 'Paid' : 'Pending',
                    transactionId: order.paymentResult?.razorpay_order_id || order.paymentResult?.id
                },
                address: {
                    name: order.user?.name || 'N/A',
                    line: order.shippingAddress?.street || '',
                    city: order.shippingAddress?.city || '',
                    state: order.shippingAddress?.state || '',
                    pincode: order.shippingAddress?.postalCode || '',
                    type: 'Home'
                },
                timeline: [
                    {
                        status: order.status,
                        time: order.updatedAt || order.createdAt,
                        note: ''
                    }
                ]
            }));
            set({ orders: transformedOrders, isLoading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    },

    updateOrderStatus: async (id, status, note) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/orders/${id}/status`, { status });
            // Transform the updated order
            const transformedOrder = {
                ...data,
                id: data._id,
                date: data.createdAt,
                items: data.orderItems?.map(item => ({
                    id: item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.qty
                })) || [],
                total: data.totalPrice,
                payment: {
                    method: data.paymentMethod === 'COD' ? 'COD' : data.paymentMethod,
                    status: data.isPaid ? 'Paid' : 'Pending',
                    transactionId: data.paymentResult?.razorpay_order_id || data.paymentResult?.id
                },
                address: {
                    name: data.user?.name || 'N/A',
                    line: data.shippingAddress?.street || '',
                    city: data.shippingAddress?.city || '',
                    state: data.shippingAddress?.state || '',
                    pincode: data.shippingAddress?.postalCode || '',
                    type: 'Home'
                },
                timeline: [
                    {
                        status: data.status,
                        time: data.updatedAt || data.createdAt,
                        note: note || ''
                    }
                ]
            };
            set((state) => ({
                orders: state.orders.map(o => o.id === id ? transformedOrder : o),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    },

    cancelOrder: async (id, note) => {
        set({ isLoading: true });
        try {
            const { data } = await API.put(`/orders/${id}/status`, { status: 'Cancelled' });
            const transformedOrder = {
                ...data,
                id: data._id,
                date: data.createdAt,
                items: data.orderItems?.map(item => ({
                    id: item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.qty
                })) || [],
                total: data.totalPrice,
                payment: {
                    method: data.paymentMethod === 'COD' ? 'COD' : data.paymentMethod,
                    status: data.isPaid ? 'Paid' : 'Pending',
                    transactionId: data.paymentResult?.razorpay_order_id || data.paymentResult?.id
                },
 address: {
                    name: data.user?.name || 'N/A',
                    line: data.shippingAddress?.street || '',
                    city: data.shippingAddress?.city || '',
                    state: data.shippingAddress?.state || '',
                    pincode: data.shippingAddress?.postalCode || '',
                    type: 'Home'
                },
                timeline: [
                    {
                        status: 'Cancelled',
                        time: data.updatedAt || data.createdAt,
                        note: note || ''
                    }
                ]
            };
            set((state) => ({
                orders: state.orders.map(o => o.id === id ? transformedOrder : o),
                isLoading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || error.message, 
                isLoading: false 
            });
        }
    }
}));

export default useOrderStore;
