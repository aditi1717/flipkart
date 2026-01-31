import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPrint, MdLocalShipping, MdCheckCircle, MdPendingActions, MdCancel, MdPerson, MdEmail, MdPhone, MdLocationOn, MdPayment, MdSchedule } from 'react-icons/md';
import useOrderStore from '../../store/orderStore';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, updateOrderStatus, cancelOrder } = useOrderStore();
    const order = orders.find(o => o.id === id);

    const [updating, setUpdating] = useState(false);
    const [actionNote, setActionNote] = useState('');

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6">
                    <MdCancel size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Order Not Found</h2>
                <button onClick={() => navigate('/admin/orders')} className="mt-4 text-blue-600 font-bold hover:underline">Back to Orders</button>
            </div>
        );
    }

    const handleStatusUpdate = (newStatus) => {
        updateOrderStatus(id, newStatus, actionNote);
        setActionNote('');
        setUpdating(false);
    };

    const getStatusStepStatus = (stepStatus) => {
        const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
        const currentIdx = statuses.indexOf(order.status);
        const stepIdx = statuses.indexOf(stepStatus);

        if (order.status === 'Cancelled') return 'cancelled';
        if (currentIdx >= stepIdx) return 'completed';
        return 'upcoming';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 text-gray-500 hover:text-gray-900 rounded-2xl transition-all shadow-sm group"
                    >
                        <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{order.id}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                        'bg-blue-100 text-blue-600 animate-pulse'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Placed on {new Date(order.date).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-600 font-black text-xs rounded-2xl hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest">
                        <MdPrint size={18} /> Print Invoice
                    </button>
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button
                            onClick={() => setUpdating(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest"
                        >
                            Update Status
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Order Items ({order.items.length})</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-6 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 p-2 overflow-hidden flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2" title={item.name}>{item.name}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded">ID: {item.id}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Quantity: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-gray-900">₹{item.price.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">₹{(item.price * item.quantity).toLocaleString()} Subtotal</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col items-end gap-3 text-right">
                            <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-400 uppercase">
                                <span>Subtotal</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-400 uppercase">
                                <span>Shipping</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <div className="flex justify-between w-full max-w-[200px] text-xl font-black text-gray-900 mt-2">
                                <span>TOTAL</span>
                                <span>₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <MdSchedule className="text-blue-500" size={20} /> Order Timeline
                        </h2>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gray-100 before:pointer-events-none pb-4">
                            {order.timeline.map((event, idx) => (
                                <div key={idx} className="relative flex gap-8">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-sm transition-transform hover:scale-110 ${event.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                            event.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        <div className="w-4 h-4 rounded-full bg-current"></div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{event.status}</h4>
                                            <span className="text-[10px] text-gray-400 font-bold">{new Date(event.time).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                                        </div>
                                        {event.note && <p className="text-xs text-gray-500 font-medium italic">"{event.note}"</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="lg:col-span-4 space-y-8">
                    {/* User Info */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">Customer Profile</h2>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm font-black text-xl">
                                {order.user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-black text-gray-900 truncate">{order.user.name}</h4>
                                <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">Gold Member</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <MdEmail className="text-gray-300" size={18} />
                                <span className="text-xs font-medium truncate">{order.user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MdPhone className="text-gray-300" size={18} />
                                <span className="text-xs font-medium">{order.user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Address</h2>
                            <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase rounded text-gray-500">{order.address.type}</span>
                        </div>
                        <div className="flex gap-4">
                            <MdLocationOn className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                            <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                <p className="font-black text-gray-900 mb-1">{order.address.name}</p>
                                <p>{order.address.line}</p>
                                <p>{order.address.city}, {order.address.state}</p>
                                <p className="font-black mt-1 text-gray-400">{order.address.pincode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Metadata</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Method</span>
                                <span className="font-black text-gray-800">{order.payment.method}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Status</span>
                                <span className={`font-black uppercase tracking-tighter px-2 py-0.5 rounded ${order.payment.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                    }`}>{order.payment.status}</span>
                            </div>
                            {order.payment.transactionId && (
                                <div className="pt-4 border-t border-gray-50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Transaction ID</p>
                                    <p className="text-[11px] font-bold text-gray-600 font-mono break-all bg-gray-50 p-2 rounded-lg">{order.payment.transactionId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal/Pop-up */}
            {updating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900">Update fulfillment status</h3>
                                <button onClick={() => setUpdating(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><MdCancel size={24} /></button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action Note (Optional)</p>
                                <textarea
                                    placeholder="e.g. Dispatched via Express Couriers..."
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 outline-none text-sm transition-all h-24 font-medium"
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select New Status</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'].map(status => (
                                        <button
                                            key={status}
                                            disabled={order.status === status}
                                            onClick={() => handleStatusUpdate(status)}
                                            className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${order.status === status
                                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                            cancelOrder(id, actionNote);
                                            setUpdating(false);
                                        }
                                    }}
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
