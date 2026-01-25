import React from 'react';
import {
    MdInventory,
    MdShoppingCart,
    MdLocalOffer,
    MdPeople,
    MdTrendingUp,
    MdAttachMoney
} from 'react-icons/md';

const Dashboard = () => {
    // Dummy data
    const stats = [
        {
            title: 'Total Products',
            value: '1,234',
            change: '+12%',
            icon: MdInventory,
            color: 'blue'
        },
        {
            title: 'Total Orders',
            value: '856',
            change: '+8%',
            icon: MdShoppingCart,
            color: 'green'
        },
        {
            title: 'Active Coupons',
            value: '45',
            change: '+5',
            icon: MdLocalOffer,
            color: 'purple'
        },
        {
            title: 'Total Users',
            value: '12,567',
            change: '+23%',
            icon: MdPeople,
            color: 'orange'
        },
    ];

    const recentOrders = [
        { id: '#ORD001', customer: 'John Doe', total: '₹2,499', status: 'Delivered', date: '2024-01-24' },
        { id: '#ORD002', customer: 'Jane Smith', total: '₹1,899', status: 'Shipped', date: '2024-01-24' },
        { id: '#ORD003', customer: 'Mike Johnson', total: '₹3,299', status: 'Processing', date: '2024-01-23' },
        { id: '#ORD004', customer: 'Sarah Williams', total: '₹999', status: 'Delivered', date: '2024-01-23' },
        { id: '#ORD005', customer: 'Tom Brown', total: '₹4,599', status: 'Pending', date: '2024-01-22' },
    ];

    const topProducts = [
        { name: 'iPhone 14 Pro', sales: 234, revenue: '₹2,34,000' },
        { name: 'Samsung Galaxy S23', sales: 189, revenue: '₹1,89,000' },
        { name: 'Nike Air Max', sales: 156, revenue: '₹1,24,800' },
        { name: 'Sony Headphones', sales: 145, revenue: '₹87,000' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Delivered': 'bg-green-100 text-green-800',
            'Shipped': 'bg-blue-100 text-blue-800',
            'Processing': 'bg-yellow-100 text-yellow-800',
            'Pending': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Total</th>
                                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-6 text-sm font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, index) => (
                                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm font-medium text-blue-600">{order.id}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{order.customer}</td>
                                        <td className="py-4 px-6 text-sm font-semibold text-gray-800">{order.total}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Top Products</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{product.sales} sales</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{product.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
