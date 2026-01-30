import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import logo from '../../../assets/indiankart-logo.png';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useCartStore();
    const [mobile, setMobile] = useState('');
    const from = location.state?.from?.pathname || '/';

    const handleLogin = () => {
        // In a real app, this would trigger an OTP or auth flow
        if (mobile.length === 10) {
            login();
            navigate(from, { replace: true });
        } else {
            alert('Please enter a valid 10-digit mobile number');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col p-4">
            <div className="flex justify-start mb-2">
                <button onClick={() => navigate('/')} className="material-icons text-2xl text-gray-800">close</button>
            </div>

            <div className="flex-1 flex flex-col pt-0">
                <div className="mb-4 flex flex-col items-center">
                    <div className="w-40 h-40 bg-white flex items-center justify-center mb-2">
                        <img src={logo} alt="logo" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Log in for the best experience</h2>
                    <p className="text-sm text-gray-500 text-center">Enter your phone number to continue</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-[10px] uppercase text-blue-600 font-bold absolute -top-1.5 left-3 bg-white px-1">Mobile Number</label>
                        <div className="flex items-center border border-blue-600 rounded-lg overflow-hidden h-12">
                            <span className="pl-4 text-gray-500 text-sm font-medium">+91</span>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="flex-1 h-full px-4 outline-none text-gray-900 font-medium"
                                placeholder="Enter mobile number"
                            />
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-tight">
                        By continuing, you agree to Flipkart's <span className="text-blue-600">Terms of Use</span> and <span className="text-blue-600">Privacy Policy</span>.
                    </p>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#fb641b] text-white py-3.5 rounded-sm font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                    >
                        Continue
                    </button>
                </div>

                <div className="mt-auto text-center pb-8">
                    <p className="text-sm text-gray-500">
                        New to Flipkart? <button onClick={() => navigate('/signup')} className="text-blue-600 font-bold">Create an account</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
