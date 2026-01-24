import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const MyOrders = () => {
    const navigate = useNavigate();
    const orders = useCartStore(state => state.orders);

    // Flatten all orders into individual items for the history view
    const allItems = orders.flatMap(order =>
        order.items.map(item => ({
            ...item,
            orderId: order.id,
            orderDate: order.date,
            orderStatus: order.status,
            // If item has no specific status, use order status
            displayStatus: item.status || order.status
        }))
    );

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-20">
            <div className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => navigate('/account')}
                        className="material-icons p-2 -ml-2 active:bg-white/10 rounded-full transition-all cursor-pointer relative z-20"
                    >
                        arrow_back
                    </button>
                    <h1 className="text-lg font-bold">My Orders</h1>
                </div>
                <button className="material-icons text-white">search</button>
            </div>

            {allItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center bg-white h-[80vh]">
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d405a710-1043-4977-88f2-fdc95bede36f.png?q=90" alt="empty" className="w-48 mb-6" />
                    <h2 className="text-xl font-bold mb-2">You haven't placed any orders yet!</h2>
                    <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here.</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Shop Now</button>
                </div>
            ) : (
                <div className="space-y-[1px] py-[1px]">
                    {allItems.map((item, idx) => (
                        <div
                            key={`${item.orderId}-${idx}`}
                            onClick={() => navigate(`/my-orders/${item.orderId}`)}
                            className="bg-white p-4 flex gap-4 cursor-pointer active:bg-gray-50 transition-colors"
                        >
                            <div className="w-16 h-20 bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                                <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-[13px] font-bold text-gray-800 line-clamp-1 leading-tight flex-1">
                                            {item.name}
                                        </h2>
                                        <span className="material-icons text-gray-300 text-[18px]">chevron_right</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.displayStatus === 'DELIVERED' ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                <p className="text-[11px] font-bold text-gray-900">Delivered on {new Date(item.orderDate).toLocaleDateString()}</p>
                                            </div>
                                        ) : item.displayStatus === 'CANCELLED' ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                                                <p className="text-[11px] font-bold text-red-600">Cancelled</p>
                                            </div>
                                        ) : item.displayStatus === 'REFUND_PROCESSED' ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                                <p className="text-[11px] font-bold text-gray-500">Returned</p>
                                            </div>
                                        ) : item.displayStatus === 'REPLACEMENT_DELIVERED' ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                <p className="text-[11px] font-bold text-green-600">Replaced</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                                <p className={`text-[11px] font-bold ${item.displayStatus.includes('RETURN') ? 'text-orange-600' :
                                                    item.displayStatus.includes('REPLACEMENT') ? 'text-blue-600' : 'text-gray-900'
                                                    }`}>
                                                    {item.displayStatus.replace(/_/g, ' ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2">
                                    <div className="flex items-center gap-1">
                                        <span className="material-icons text-[14px] text-gray-400">inventory_2</span>
                                        <span className="text-[10px] text-gray-400 uppercase font-black">ID: {item.orderId.slice(-6)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!['DELIVERED', 'CANCELLED', 'REFUND_PROCESSED', 'REPLACEMENT_DELIVERED'].includes(item.displayStatus) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/track-order/${item.orderId}${item.displayStatus.includes('RETURN') || item.displayStatus.includes('REPLACEMENT') ? `/${item.id}` : ''}`);
                                                }}
                                                className="text-[10px] font-black text-blue-600 border border-blue-600/20 bg-blue-50 px-2.5 py-1 rounded-sm uppercase active:scale-95 transition-all"
                                            >
                                                Track {item.displayStatus.includes('RETURN') ? 'Return' : item.displayStatus.includes('REPLACEMENT') ? 'Replacement' : 'Item'}
                                            </button>
                                        )}
                                        {item.displayStatus === 'DELIVERED' && (
                                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter">Delivered</span>
                                        )}
                                        {item.displayStatus === 'REFUND_PROCESSED' && (
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter">Returned</span>
                                        )}
                                        {item.displayStatus === 'REPLACEMENT_DELIVERED' && (
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter">Replaced</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
