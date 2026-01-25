import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

const SellerRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        contactNumber: '',
        email: '',
        gst: '',
        brandName: '',
        sellerRegNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Seller Registration Data:', formData);
        alert('Registration Submitted Successfully! We will contact you soon.');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-3 flex items-center gap-3">
                <MdArrowBack onClick={() => navigate(-1)} className="text-2xl text-gray-700 cursor-pointer" />
                <h1 className="text-lg font-bold text-gray-800">Become a Seller</h1>
            </div>

            <div className="max-w-md mx-auto p-4 mt-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-2 text-gray-900">Seller Registration</h2>
                    <p className="text-sm text-gray-500 mb-6">Join our platform and scale your business.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                required
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="business@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">GST Number</label>
                            <input
                                type="text"
                                name="gst"
                                required
                                value={formData.gst}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="GSTIN12345678"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Brand Name / Deal</label>
                            <input
                                type="text"
                                name="brandName"
                                required
                                value={formData.brandName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Your Brand Name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Seller Registration Number</label>
                            <input
                                type="text"
                                name="sellerRegNumber"
                                required
                                value={formData.sellerRegNumber}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="REG-2024-XXXX"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/30 active:scale-95 transition-all mt-4"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerRegistration;
