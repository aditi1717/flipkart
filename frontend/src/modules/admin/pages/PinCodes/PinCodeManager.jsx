import React, { useState, useEffect } from 'react';
import { MdLocationOn, MdDelete, MdAdd, MdTimer } from 'react-icons/md';
import usePinCodeStore from '../../store/pinCodeStore';

const PinCodeManager = () => {
    const { pinCodes, fetchPinCodes, addPinCode, deletePinCode, isLoading } = usePinCodeStore();
    const [formData, setFormData] = useState({
        code: '',
        deliveryTime: '',
        unit: 'days'
    });

    useEffect(() => {
        fetchPinCodes();
    }, [fetchPinCodes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addPinCode(formData);
        if (success) {
            setFormData({ code: '', deliveryTime: '', unit: 'days' });
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <MdLocationOn size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Delivery PIN Codes</h1>
                    <p className="text-gray-500 text-sm">Manage serviceable areas and delivery estimates</p>
                </div>
            </div>

            {/* Add PIN Code Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MdAdd className="text-blue-500" /> Add New Serviceable Area
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">PIN Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 110001"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-700"
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Time</label>
                        <input
                            type="number"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="e.g. 2"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-700"
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none text-gray-700 font-medium"
                        >
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="minutes">Minutes</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Adding...' : 'Add PIN Code'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List of PIN Codes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Serviceable Locations ({pinCodes.length})</h3>
                </div>
                
                {pinCodes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <MdLocationOn className="mx-auto mb-3 opacity-20" size={48} />
                        <p>No PIN codes added yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {pinCodes.map((pin) => (
                            <div key={pin._id} className="p-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
                                <div className="flex items-center gap-6">
                                    <span className="text-lg font-black text-gray-800 font-mono tracking-wider">{pin.code}</span>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                        <MdTimer className="text-green-500" />
                                        {pin.deliveryTime} {pin.unit}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deletePinCode(pin._id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove PIN Code"
                                >
                                    <MdDelete size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinCodeManager;
