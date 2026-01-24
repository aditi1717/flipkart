import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Addresses = () => {
    const navigate = useNavigate();
    const { addresses, addAddress, updateAddress, removeAddress } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showMenu, setShowMenu] = useState(null);

    const initialAddr = {
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        city: '',
        state: '',
        type: 'Home'
    };

    const [newAddr, setNewAddr] = useState(initialAddr);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateAddress(editingId, newAddr);
            setEditingId(null);
        } else {
            addAddress({ ...newAddr, id: Date.now() });
        }
        setIsAdding(false);
        setNewAddr(initialAddr);
    };

    const handleEdit = (addr) => {
        setNewAddr(addr);
        setEditingId(addr.id);
        setIsAdding(true);
        setShowMenu(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            removeAddress(id);
        }
        setShowMenu(null);
    };

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-10">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b">
                <button onClick={() => navigate(-1)} className="material-icons text-gray-700">arrow_back</button>
                <h1 className="text-lg font-bold text-gray-800">My Addresses</h1>
            </div>

            <div className="p-2 space-y-2">
                {/* Add New Address Button */}
                {!isAdding && (
                    <button
                        onClick={() => {
                            setNewAddr(initialAddr);
                            setEditingId(null);
                            setIsAdding(true);
                        }}
                        className="w-full bg-white p-4 flex items-center gap-3 text-blue-600 font-bold text-sm shadow-sm active:bg-gray-50 transition-colors"
                    >
                        <span className="material-icons text-lg">add</span>
                        ADD A NEW ADDRESS
                    </button>
                )}

                {/* Add/Edit Address Form */}
                {isAdding && (
                    <div className="bg-white p-4 shadow-sm animate-in slide-in-from-top duration-300">
                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                            <h2 className="text-blue-600 font-bold uppercase text-[12px] tracking-wider">
                                {editingId ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                                    <input required type="text" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.name} onChange={e => setNewAddr({ ...newAddr, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                                    <input required type="tel" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.mobile} onChange={e => setNewAddr({ ...newAddr, mobile: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Pincode</label>
                                    <input required type="number" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Address (Area and Street)</label>
                                    <textarea required rows="3" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.address} onChange={e => setNewAddr({ ...newAddr, address: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">City/District/Town</label>
                                    <input required type="text" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">State</label>
                                    <input required type="text" className="w-full border border-gray-200 p-3 rounded-sm text-sm outline-none focus:border-blue-500" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Address Type</label>
                                <div className="flex gap-6">
                                    {['Home', 'Work'].map(type => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" checked={newAddr.type === type} onChange={() => setNewAddr({ ...newAddr, type })} className="accent-blue-600 w-4 h-4" />
                                            <span className="text-sm text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-4 text-gray-500 font-bold uppercase text-[12px]">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-sm font-bold uppercase text-[12px] shadow-lg active:scale-95 transition-all">
                                    {editingId ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Addresses List */}
                <div className="space-y-2">
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white p-4 shadow-sm relative border-l-4 border-transparent hover:border-blue-600 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded-sm text-gray-500 font-bold uppercase tracking-tighter">{addr.type}</span>
                                    {addr.isDefault && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-sm font-bold uppercase">Default</span>}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(showMenu === addr.id ? null : addr.id)}
                                        className="material-icons text-gray-400 text-lg p-1 hover:bg-gray-50 rounded-full"
                                    >
                                        more_vert
                                    </button>
                                    {showMenu === addr.id && (
                                        <div className="absolute right-0 top-8 bg-white shadow-xl border border-gray-100 rounded-md py-1 w-32 z-50 animate-in fade-in zoom-in duration-200">
                                            <button
                                                onClick={() => handleEdit(addr)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <span className="material-icons text-sm">edit</span> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <span className="material-icons text-sm text-red-600">delete</span> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[14px] text-gray-800">{addr.name}</span>
                                    <span className="font-bold text-[14px] text-gray-800">{addr.mobile}</span>
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed max-w-[90%]">
                                    {addr.address}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay to close menu on outside click */}
            {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(null)}></div>}
        </div>
    );
};

export default Addresses;
