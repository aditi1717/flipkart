import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Coupons = () => {
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');

    const activeCoupons = [
        {
            id: 1,
            code: 'FLIPKART50',
            title: 'Flat ₹50 Off',
            desc: 'On your first order of the month',
            expiry: 'Expires in 2 days',
            type: 'Offer',
            color: 'bg-blue-600'
        },
        {
            id: 2,
            code: 'WELCOME200',
            title: 'Extra ₹200 Off',
            desc: 'On purchase of ₹1999 and above',
            expiry: 'Expires on 31st Jan',
            type: 'Fashion',
            color: 'bg-green-600'
        },
        {
            id: 3,
            code: 'MAHA20',
            title: '20% Instant Discount',
            desc: 'Applicable on select electronics',
            expiry: 'Limited time offer',
            type: 'Electronics',
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="bg-[#f1f3f6] min-h-screen">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="material-icons text-gray-700">arrow_back</button>
                <h1 className="text-lg font-bold text-gray-800">My Coupons</h1>
            </div>

            <div className="p-4">
                {/* Apply Coupon Box */}
                <div className="bg-white p-4 rounded-sm shadow-sm flex gap-3 mb-6 border border-gray-100">
                    <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        className="flex-1 border-b-2 border-gray-200 outline-none focus:border-blue-600 px-1 py-1 text-sm font-bold uppercase tracking-wider"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <button className="text-blue-600 font-bold text-sm uppercase px-2 hover:bg-blue-50 transition-colors">Apply</button>
                </div>

                {/* Coupons List */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Available Coupons</h3>
                <div className="space-y-4">
                    {activeCoupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex relative border border-gray-100 group">
                            {/* Left Design edge */}
                            <div className={`w-2 ${coupon.color}`}></div>

                            <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase ${coupon.color}`}>
                                            {coupon.type}
                                        </span>
                                        <h4 className="text-lg font-black text-gray-800 mt-2">{coupon.title}</h4>
                                    </div>
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 px-3 py-1 text-sm font-bold text-gray-700 select-all">
                                        {coupon.code}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{coupon.desc}</p>
                                <div className="flex items-center gap-1 text-[11px] text-red-500 font-bold">
                                    <span className="material-icons text-[14px]">history</span>
                                    {coupon.expiry}
                                </div>
                            </div>

                            {/* Ticket cutouts */}
                            <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f1f3f6] rounded-full border border-gray-100"></div>
                            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#f1f3f6] rounded-full border border-gray-100"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                    <span className="material-icons text-blue-300 text-4xl mb-2">auto_awesome</span>
                    <p className="text-blue-800 font-bold text-sm">Want more deals?</p>
                    <p className="text-blue-400 text-xs mt-1">Check back later for personalized rewards.</p>
                </div>
            </div>
        </div>
    );
};

export default Coupons;
