import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const orders = useCartStore(state => state.orders);
    const latestOrder = orders[0];

    const startSimulation = useCartStore(state => state.startSimulation);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (latestOrder) {
            startSimulation(latestOrder.id);
        }
    }, [latestOrder, startSimulation]);

    if (!latestOrder) {
        return <div className="p-10 text-center">No order found.</div>;
    }

    return (
        <div className="bg-white min-h-screen flex flex-col items-center">
            {/* Header */}
            <div className="w-full bg-blue-600 text-white p-4 flex items-center justify-between">
                <button onClick={() => navigate('/')} className="material-icons">arrow_back</button>
                <h1 className="text-lg font-bold">Order Confirmed</h1>
                <div className="w-6"></div>
            </div>

            {/* Animation/Icon */}
            <div className="mt-12 mb-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-icons text-green-600 text-[64px]">check_circle</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Payment Successful</h2>
            <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>

            <div className="mt-8 bg-gray-50 w-[90%] p-5 rounded-xl border border-dashed border-gray-300">
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500 text-sm">Order ID</span>
                    <span className="font-bold text-sm">#{latestOrder.id}</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500 text-sm">Total Amount</span>
                    <span className="font-bold text-sm">₹{latestOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Estimated Delivery</span>
                    <span className="font-bold text-sm text-green-600">Expected by Mon, 27 Jan</span>
                </div>
            </div>

            <div className="mt-12 w-[90%] space-y-4">
                <button
                    onClick={() => navigate(`/track-order/${latestOrder.id}`)}
                    className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold shadow-lg"
                >
                    Track Order
                </button>
                <button
                    onClick={() => navigate('/my-orders')}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold shadow-lg"
                >
                    View My Orders
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-lg font-bold"
                >
                    Continue Shopping
                </button>
            </div>

            <div className="mt-auto mb-10 text-center text-[10px] text-gray-400 max-w-[80%] uppercase tracking-widest font-bold">
                Thank you for shopping with Flipkart
            </div>
        </div>
    );
};

export default OrderSuccess;
