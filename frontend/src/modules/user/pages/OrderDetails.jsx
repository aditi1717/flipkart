import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../../services/api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/orders/${orderId}`);
            setOrder(data);
            setError(null);
        } catch (err) {
            console.error('Fetch order details error:', err);
            setError(err.response?.data?.message || 'Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
            'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'Dispatched': 'bg-purple-100 text-purple-800 border-purple-200',
            'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-200',
            'Delivered': 'bg-green-100 text-green-800 border-green-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pending': 'pending',
            'Confirmed': 'check_circle',
            'Packed': 'inventory_2',
            'Dispatched': 'local_shipping',
            'Out for Delivery': 'delivery_dining',
            'Delivered': 'done_all',
            'Cancelled': 'cancel'
        };
        return icons[status] || 'info';
    };

    const getStatusStep = (currentStatus) => {
        const steps = ['Pending', 'Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'];
        return steps.indexOf(currentStatus);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-10 rounded-xl shadow-lg">
                    <span className="material-icons text-red-400 text-6xl mb-4">error</span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
                    <button onClick={() => navigate('/my-orders')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const currentStep = getStatusStep(order.status);
    const steps = [
        { name: 'Order Placed', status: 'Pending', icon: 'shopping_cart' },
        { name: 'Confirmed', status: 'Confirmed', icon: 'check_circle' },
        { name: 'Packed', status: 'Packed', icon: 'inventory_2' },
        { name: 'Dispatched', status: 'Dispatched', icon: 'local_shipping' },
        { name: 'Out for Delivery', status: 'Out for Delivery', icon: 'delivery_dining' },
        { name: 'Delivered', status: 'Delivered', icon: 'done_all' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-5 sticky top-0 z-50 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="material-icons p-2 -ml-2 active:bg-white/10 rounded-full transition-all cursor-pointer"
                    >
                        arrow_back
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">Order Details</h1>
                        <p className="text-xs text-white/80">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        <span className="material-icons text-sm">{getStatusIcon(order.status)}</span>
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Timeline */}
                        {order.status !== 'Cancelled' && (
                            <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="material-icons text-blue-600">local_shipping</span>
                                    Track Your Order
                                </h2>
                                <div className="relative">
                                    {/* Progress Bar */}
                                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 hidden md:block">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                        ></div>
                                    </div>

                                    {/* Steps */}
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-0">
                                        {steps.map((step, index) => {
                                            const isCompleted = index <= currentStep;
                                            const isCurrent = index === currentStep;
                                            return (
                                                <div key={step.status} className="flex flex-col items-center relative z-10">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                                        } ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                                                        <span className="material-icons text-lg">{step.icon}</span>
                                                    </div>
                                                    <p className={`text-xs font-bold text-center ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                                        {step.name}
                                                    </p>
                                                    {isCurrent && (
                                                        <span className="text-[10px] text-blue-600 font-bold mt-1">Current</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cancelled Status */}
                        {order.status === 'Cancelled' && (
                            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-red-600 text-4xl">cancel</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-800">Order Cancelled</h3>
                                        <p className="text-sm text-red-600 mt-1">This order has been cancelled</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-icons text-blue-600">shopping_bag</span>
                                Items in Order ({order.orderItems.length})
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-white to-blue-50 rounded-lg border border-blue-100">
                                        <div className="w-20 h-20 bg-white rounded-lg border-2 border-blue-100 p-2 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                                                    {item.variant && (
                                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                                            {Object.entries(item.variant).map(([key, value]) => (
                                                                <span key={key} className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                                                    {key}: <span className="text-blue-600">{value}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {item.serialNumber && (
                                                        <div className="mt-2">
                                                            <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold font-mono border border-blue-200 shadow-sm flex items-center gap-2 w-max select-all">
                                                    <span className="text-blue-400 select-none">{item.serialType === 'IMEI' ? 'IMEI:' : 'SN:'}</span> {item.serialNumber}
                                                </span>
                                                        </div>
                                                    )}
                                            <p className="text-xs text-gray-500 mt-1">Quantity: {item.qty}</p>
                                            <p className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
                                                ₹{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-icons text-blue-600">location_on</span>
                                Delivery Address
                            </h2>
                            <div className="bg-gradient-to-r from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="font-bold text-gray-800">{order.shippingAddress.street}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Price Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-icons text-blue-600">receipt</span>
                                Price Details
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items Price</span>
                                    <span className="font-semibold">₹{order.itemsPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-green-600">
                                        {order.shippingPrice > 0 ? `₹${order.shippingPrice}` : 'FREE'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">₹{order.taxPrice.toLocaleString()}</span>
                                </div>
                                <div className="border-t-2 border-dashed border-blue-200 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-gray-800">Total Amount</span>
                                    <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        ₹{order.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-icons text-blue-600">payment</span>
                                Payment Info
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Method</span>
                                    <span className="text-sm font-bold text-gray-800">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Status</span>
                                    {order.isPaid ? (
                                        <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                                            <span className="material-icons text-green-600 text-sm">check_circle</span>
                                            <span className="text-xs font-bold text-green-700">Paid</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                                            <span className="material-icons text-yellow-600 text-sm">pending</span>
                                            <span className="text-xs font-bold text-yellow-700">COD</span>
                                        </div>
                                    )}
                                </div>
                                {order.paidAt && (
                                    <div className="text-xs text-gray-500 mt-2">
                                        Paid on {new Date(order.paidAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="material-icons text-blue-600">info</span>
                                Order Info
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-600">Order Date</span>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {order.deliveredAt && (
                                    <div>
                                        <span className="text-gray-600">Delivered On</span>
                                        <p className="font-semibold text-green-600">
                                            {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Download Invoice Button */}
                        <button
                            onClick={() => {
                                import('../../../utils/invoiceGenerator').then(({ generateInvoice }) => {
                                    generateInvoice(order);
                                });
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons">download</span>
                            Download Invoice
                        </button>

                        {/* Help Button */}
                        <button
                            onClick={() => navigate('/help-center')}
                            className="w-full bg-white border-2 border-blue-100 text-blue-600 px-6 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons">help_outline</span>
                            Need Help?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
