import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const orders = useCartStore(state => state.orders);
    const order = orders.find(o => o.id === orderId);
    const updateStatus = useCartStore(state => state.updateOrderStatus);
    const startSimulation = useCartStore(state => state.startSimulation);

    React.useEffect(() => {
        if (order) {
            const isActiveOrder = order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && !order.status.startsWith('RETURN');
            const isActiveItem = order.items.some(item =>
                (item.status?.startsWith('RETURN') && item.status !== 'REFUND_PROCESSED') ||
                (item.status?.startsWith('REPLACEMENT') && item.status !== 'DELIVERED')
            );

            if (isActiveOrder || isActiveItem) {
                startSimulation(order.id);
            }
        }
    }, [order?.id, startSimulation, order?.status, order?.items]);

    if (!order) {
        return <div className="p-10 text-center">Order not found.</div>;
    }

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            updateStatus(order.id, 'CANCELLED');
        }
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-20">
            <div className="bg-blue-600 text-white px-4 py-4 flex items-center gap-4 sticky top-0 z-50 shadow-md">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="material-icons p-2 -ml-2 active:bg-white/10 rounded-full transition-all cursor-pointer relative z-[60]"
                >
                    arrow_back
                </button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold uppercase tracking-tight">Order Details</h1>
                    <span className="text-[10px] text-white/80 uppercase">ID: {order.id}</span>
                </div>
            </div>

            <div className="space-y-2">
                {/* 1. Track Order CTA */}
                {order.status !== 'CANCELLED' && (
                    <div className="bg-white p-4 flex items-center justify-between border-b cursor-pointer" onClick={() => navigate(`/track-order/${order.id}`)}>
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-blue-600">local_shipping</span>
                            <span className="text-sm font-bold">Track Order</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded-sm uppercase tracking-tighter">{order.status.replace(/_/g, ' ')}</span>
                            <span className="material-icons text-gray-400">chevron_right</span>
                        </div>
                    </div>
                )}

                {/* 2. Order Status Summary */}
                <div className="bg-white p-4">
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'CANCELLED' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                            <div className="w-0.5 h-12 bg-gray-200"></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'DELIVERED' || order.status === 'REFUND_PROCESSED' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        </div>
                        <div className="flex-1 -mt-1">
                            <div>
                                <p className={`text-sm font-bold ${order.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-900'}`}>
                                    {order.status === 'CANCELLED' ? 'Order Cancelled' : order.status.startsWith('RETURN') ? 'Return In Progress' : 'Order Placed'}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{new Date(order.date).toLocaleString()}</p>
                            </div>
                            <div className="mt-6">
                                <p className={`text-sm font-bold ${order.status === 'DELIVERED' || order.status === 'REFUND_PROCESSED' ? 'text-green-600' : 'text-gray-400'}`}>
                                    {order.status === 'DELIVERED' ? 'Delivered' : order.status === 'REFUND_PROCESSED' ? 'Refund Processed' : order.status === 'CANCELLED' ? 'Cancelled' : 'In Progress'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {order.status === 'DELIVERED' ? 'Successfully Delivered' : order.status === 'REFUND_PROCESSED' ? 'Money credited' : 'Expected soon'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Shipping Address */}
                <div className="bg-white p-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1 border-l-2 border-gray-200 ml-[-4px]">Delivery Address</h3>
                    <p className="text-sm font-bold">{order.address?.name}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {order.address?.address}, {order.address?.city}, {order.address?.state} - <span className="font-bold text-gray-900">{order.address?.pincode}</span>
                    </p>
                    <p className="text-sm font-bold mt-2">Phone number: <span className="font-normal text-gray-600">{order.address?.mobile}</span></p>
                </div>

                {/* 4. Product List */}
                <div className="bg-white">
                    <div className="px-4 py-3 border-b flex items-center gap-2">
                        <span className="material-icons text-gray-400 text-[16px]">shopping_bag</span>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-tight">Items in this order ({order.items.length})</h3>
                    </div>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="p-4 flex gap-4 border-b last:border-b-0 active:bg-gray-50 transition-colors">
                            <div className="w-16 h-20 bg-gray-50 rounded border p-1 flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium line-clamp-2 text-gray-800 leading-tight">{item.name}</h4>
                                    {item.status && item.status !== 'DELIVERED' && (
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${item.status.includes('RETURN') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {item.status.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm font-black">₹{item.price.toLocaleString()}</span>
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-sm text-gray-500 uppercase font-black">Qty: {item.quantity}</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button className="text-[10px] font-black text-blue-600 border border-blue-600/20 bg-blue-50 px-3 py-1.5 rounded-sm uppercase active:scale-95 transition-all">Buy it again</button>
                                    {item.status && (item.status.startsWith('RETURN') || item.status.startsWith('REPLACEMENT') || item.status === 'REFUND_PROCESSED') && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/track-order/${order.id}/${item.id}`);
                                            }}
                                            className="text-[10px] font-black text-blue-600 border border-blue-600/20 bg-blue-50 px-3 py-1.5 rounded-sm uppercase active:scale-95 transition-all"
                                        >
                                            Track {(item.status.includes('RETURN') || item.status.includes('REFUND')) ? 'Return' : 'Replacement'}
                                        </button>
                                    )}
                                    {order.status === 'DELIVERED' && (!item.status || item.status === 'DELIVERED') && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/my-orders/${order.id}/return/${item.id}`);
                                            }}
                                            className="text-[10px] font-black text-red-600 border border-red-600/20 bg-red-50 px-3 py-1.5 rounded-sm uppercase active:scale-95 transition-all"
                                        >
                                            Return / Replace
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. Price Breakdown */}
                <div className="bg-white p-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-tight">Price Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">List Price</span>
                            <span className="font-medium">₹{(order.totalAmount + 500).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600 font-bold">
                            <span>Discount</span>
                            <span>-₹500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping Fee</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="flex justify-between text-base font-black border-t border-dashed pt-4 mt-2">
                            <span>Total Amount</span>
                            <span className="text-blue-600">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-4">
                            <p className="text-[11px] font-black text-green-700 uppercase tracking-widest text-center">You saved ₹500 on this order!</p>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-sm text-blue-600">verified</span>
                            <span>Payment: {order.paymentMethod}</span>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-sm uppercase tracking-tighter">Paid</span>
                    </div>
                </div>

                {/* 6. Footer Actions */}
                <div className="bg-white p-4 space-y-3">
                    <button
                        onClick={() => navigate('/help-center')}
                        className="w-full border border-gray-200 py-3.5 rounded-xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
                    >
                        <span className="material-icons text-[18px] text-blue-600/70">help_outline</span>
                        Need Help?
                    </button>

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && !order.status.startsWith('RETURN') && order.status !== 'REFUND_PROCESSED' && (
                        <button
                            onClick={handleCancel}
                            className="w-full border border-red-100 py-3.5 rounded-xl text-sm font-bold text-red-500 flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
                        >
                            <span className="material-icons text-[18px]">cancel</span>
                            Cancel Order
                        </button>
                    )}

                    {order.status === 'DELIVERED' && order.items.some(item => !item.status || item.status === 'DELIVERED') && (
                        <button
                            onClick={() => navigate(`/my-orders/${order.id}/return`)}
                            className="w-full border border-blue-600 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                        >
                            <span className="material-icons text-[18px]">assignment_return</span>
                            Return or Replace All Items
                        </button>
                    )}

                    {order.status === 'CANCELLED' && (
                        <div className="text-center py-2">
                            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">This order has been cancelled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
