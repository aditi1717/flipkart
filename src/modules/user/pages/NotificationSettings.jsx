import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationSettings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        promotional: true,
        orderUpdates: true,
        stockAlerts: false,
        newsletters: true,
        whatsapp: true,
        sms: false
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            title: 'Order Tracking',
            items: [
                { id: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status, delivery, and returns.', icon: 'local_shipping' }
            ]
        },
        {
            title: 'Offers & Promotions',
            items: [
                { id: 'promotional', label: 'Sale & Offers', desc: 'Personalized offers, coupons, and sale alerts.', icon: 'sell' },
                { id: 'stockAlerts', label: 'Stock Alerts', desc: 'Notify when items in your wishlist are back in stock.', icon: 'inventory' }
            ]
        },
        {
            title: 'Channels',
            items: [
                { id: 'whatsapp', label: 'WhatsApp Notifications', desc: 'Fastest way to get order updates and offers.', icon: 'message' },
                { id: 'sms', label: 'SMS Notifications', desc: 'Get important updates via text message.', icon: 'sms' },
                { id: 'newsletters', label: 'Email Newsletters', desc: 'Weekly digest of top deals and new launches.', icon: 'mail' }
            ]
        }
    ];

    return (
        <div className="bg-[#f1f3f6] min-h-screen">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="material-icons text-gray-700">arrow_back</button>
                <h1 className="text-lg font-bold text-gray-800">Notification Settings</h1>
            </div>

            <div className="space-y-2 pb-10">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white shadow-sm">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{section.title}</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {section.items.map((item) => (
                                <div key={item.id} className="p-4 flex items-start justify-between gap-4 active:bg-gray-50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <span className="material-icons text-blue-600 opacity-80">{item.icon}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{item.label}</span>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting(item.id)}
                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0 ${settings[item.id] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${settings[item.id] ? 'right-1' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="p-4 mt-4">
                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                        Flipkart Private Limited
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
