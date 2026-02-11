import React, { useState, useEffect } from 'react';
import API from '../../../../services/api';
import { MdStore, MdCheck, MdClose, MdEmail, MdPhone, MdLocationOn, MdInfo } from 'react-icons/md';
import toast from 'react-hot-toast';

const SellerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/seller-requests');
            setRequests(data);
        } catch (err) {
            toast.error('Failed to fetch seller requests');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`/seller-requests/${id}`, { status, adminNotes });
            toast.success(`Request ${status.toLowerCase()} successfully`);
            fetchRequests();
            setSelectedRequest(null);
            setAdminNotes('');
        } catch (err) {
            toast.error('Failed to update request');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Seller Requests</h1>
                    <p className="text-gray-500 font-medium">Manage and review merchant applications</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 uppercase tracking-wider">
                    {requests.length} Total Requests
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.map((request) => (
                    <div 
                        key={request._id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                <MdStore className="text-2xl text-gray-400" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-0.5 truncate">{request.storeName}</h3>
                                <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm font-medium text-gray-500">
                                    <span className="flex items-center gap-1"><MdEmail className="text-blue-500" /> {request.businessEmail}</span>
                                    <span className="flex items-center gap-1"><MdPhone className="text-blue-500" /> {request.phoneNumber}</span>
                                    <span className="text-blue-600 font-bold">GST: {request.taxId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                request.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                request.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                                {request.status}
                            </div>
                            
                            <button 
                                onClick={() => setSelectedRequest(request)}
                                className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-100"
                            >
                                Review Application
                            </button>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <MdStore className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-500 italic">No seller requests yet</h3>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Review Application</h2>
                                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-0.5">{selectedRequest.storeName}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Type</h4>
                                    <p className="font-bold text-gray-900 flex items-center gap-2"><MdInfo className="text-blue-600" /> {selectedRequest.businessType}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registration ID</h4>
                                    <p className="font-bold text-gray-900 flex items-center gap-2"><MdInfo className="text-blue-600" /> {selectedRequest.taxId}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Address</h4>
                                <p className="font-medium text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-2">
                                    <MdLocationOn className="text-blue-600 text-xl shrink-0 mt-0.5" />
                                    {selectedRequest.businessAddress}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Business Description</h4>
                                <div className="font-medium text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedRequest.description}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Admin Notes (Optional)</h4>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add feedback for the seller..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-blue-500 outline-none font-medium text-gray-800 transition-all min-h-[100px] placeholder:text-gray-500"
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button 
                                onClick={() => handleUpdateStatus(selectedRequest._id, 'Rejected')}
                                className="px-6 py-3 rounded-xl border-2 border-red-100 text-red-600 font-black hover:bg-red-50 transition-all flex items-center gap-2"
                            >
                                <MdClose /> Reject Request
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(selectedRequest._id, 'Approved')}
                                className="px-6 py-3 rounded-xl bg-green-600 text-white font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center gap-2"
                            >
                                <MdCheck /> Approve Seller
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerRequests;
