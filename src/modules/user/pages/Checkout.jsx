import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, addresses, placeOrder, getTotalPrice, addAddress } = useCartStore();
    const [step, setStep] = useState(2); // 2: Order Summary, 3: Payment
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || null);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isChangingAddress, setIsChangingAddress] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    // New Address Form State
    const [newAddr, setNewAddr] = useState({
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        city: '',
        state: '',
        type: 'Home'
    });

    const handleAddAddress = (e) => {
        e.preventDefault();
        const id = Date.now();
        addAddress({ ...newAddr, id });
        setSelectedAddress(id);
        setIsAddingAddress(false);
        setIsChangingAddress(false);
    };

    const totalPrice = getTotalPrice();
    const delivery = totalPrice > 500 ? 0 : 40;
    const finalAmount = totalPrice + delivery;

    const handlePlaceOrder = () => {
        setIsPlacingOrder(true);
        setTimeout(() => {
            const orderData = {
                items: cart,
                totalAmount: finalAmount,
                address: addresses.find(a => a.id === selectedAddress),
                paymentMethod,
            };
            placeOrder(orderData);
            setIsPlacingOrder(false);
            navigate('/order-success', { replace: true });
        }, 2500);
    };

    if (isPlacingOrder) {
        return (
            <div className="fixed inset-0 bg-white z-[1000] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">Processing Payment...</h2>
                <p className="text-gray-500 text-sm">Finishing your order safely.</p>
                <div className="mt-12 flex items-center gap-4 grayscale opacity-30">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="upi" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="mc" className="h-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f1f3f6] min-h-screen">
            {/* Simple Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b">
                <button onClick={() => step === 3 ? setStep(2) : navigate(-1)} className="material-icons text-gray-700">arrow_back</button>
                <h1 className="text-lg font-bold text-gray-800">{step === 2 ? 'Order Summary' : 'Payment'}</h1>
            </div>

            {/* Steps Progress (Flipkart Style) */}
            <div className="bg-white px-2 py-4 border-b flex items-center justify-center mb-2">
                <div className="flex items-center w-full max-w-sm">
                    {/* Cart Step */}
                    <div className="flex flex-col items-center flex-1 relative">
                        <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center z-10">
                            <span className="material-icons text-[14px]">check</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 uppercase mt-1 tracking-tighter">Cart</span>
                    </div>

                    <div className="flex-1 h-[1px] bg-gray-200 -mt-5"></div>

                    {/* Summary Step */}
                    <div className="flex flex-col items-center flex-1 relative">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} text-white text-[11px] font-bold`}>
                            {step > 2 ? <span className="material-icons text-[14px]">check</span> : '2'}
                        </div>
                        <span className={`text-[10px] font-bold uppercase mt-1 tracking-tighter ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Summary</span>
                    </div>

                    <div className={`flex-1 h-[1px] -mt-5 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

                    {/* Payment Step */}
                    <div className="flex flex-col items-center flex-1 relative">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${step === 3 ? 'bg-blue-600' : 'bg-gray-200'} text-white text-[11px] font-bold`}>
                            3
                        </div>
                        <span className={`text-[10px] font-bold uppercase mt-1 tracking-tighter ${step === 3 ? 'text-blue-600' : 'text-gray-400'}`}>Payment</span>
                    </div>
                </div>
            </div>

            {step === 2 && (
                <div className="space-y-2 pb-24">
                    {/* Delivery Address Section */}
                    {!isChangingAddress ? (
                        <div className="bg-white px-4 py-4 flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-gray-800">Deliver to: <span className="font-bold">{addresses.find(a => a.id === selectedAddress)?.name}, {addresses.find(a => a.id === selectedAddress)?.pincode}</span></span>
                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">{addresses.find(a => a.id === selectedAddress)?.type}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-normal">{addresses.find(a => a.id === selectedAddress)?.address}, {addresses.find(a => a.id === selectedAddress)?.city}</p>
                            </div>
                            <button
                                onClick={() => setIsChangingAddress(true)}
                                className="text-blue-600 font-bold text-[12px] border border-gray-100 px-4 py-1.5 rounded-sm shadow-sm active:bg-gray-50"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Select Delivery Address</h3>
                                <button onClick={() => setIsChangingAddress(false)} className="text-blue-600 text-xs font-bold uppercase">Done</button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <label key={addr.id} className={`block p-4 rounded border transition-all cursor-pointer ${selectedAddress === addr.id ? 'border-blue-500 bg-blue-50/20' : 'border-gray-100'}`}>
                                        <div className="flex gap-3">
                                            <input
                                                type="radio"
                                                checked={selectedAddress === addr.id}
                                                onChange={() => setSelectedAddress(addr.id)}
                                                className="mt-1 accent-blue-600"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm text-gray-800">{addr.name}</span>
                                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">{addr.type}</span>
                                                    <span className="text-sm text-gray-800 ml-auto font-medium">{addr.mobile}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                                {selectedAddress === addr.id && (
                                                    <button
                                                        onClick={() => {
                                                            setIsChangingAddress(false);
                                                            setStep(2);
                                                        }}
                                                        className="mt-3 bg-[#fb641b] text-white px-6 py-2 rounded-sm text-[11px] font-bold uppercase shadow-md active:scale-95 transition-all w-full"
                                                    >
                                                        Deliver Here
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                ))}

                                {!isAddingAddress ? (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="w-full flex items-center gap-2 p-4 text-blue-600 border border-dashed border-blue-200 rounded-lg bg-blue-50/30 active:bg-blue-50 transition-colors"
                                    >
                                        <span className="material-icons text-sm">add</span>
                                        <span className="text-sm font-bold">Add a new address</span>
                                    </button>
                                ) : (
                                    <form onSubmit={handleAddAddress} className="border border-blue-200 p-4 rounded-lg bg-blue-50/10 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1 col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Name</label>
                                                <input required type="text" placeholder="Full Name" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.name} onChange={e => setNewAddr({ ...newAddr, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Mobile</label>
                                                <input required type="tel" placeholder="10-digit number" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.mobile} onChange={e => setNewAddr({ ...newAddr, mobile: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Pincode</label>
                                                <input required type="number" placeholder="6-digit pincode" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.pincode} onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                                            </div>
                                            <div className="space-y-1 col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Address</label>
                                                <textarea required rows="3" placeholder="House No, Building Name, Road Area" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.address} onChange={e => setNewAddr({ ...newAddr, address: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">City</label>
                                                <input required type="text" placeholder="City/District" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">State</label>
                                                <input required type="text" placeholder="State" className="w-full border border-gray-200 p-2.5 rounded-sm text-sm focus:border-blue-500 outline-none" value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Address Type</label>
                                            <div className="flex gap-4">
                                                {['Home', 'Work'].map(type => (
                                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" name="addrType" checked={newAddr.type === type} onChange={() => setNewAddr({ ...newAddr, type })} className="accent-blue-600" />
                                                        <span className="text-sm text-gray-700">{type}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 py-3 text-gray-500 font-bold uppercase text-[12px]">Cancel</button>
                                            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-sm font-bold uppercase text-[12px] shadow-lg">Save & Deliver</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="bg-white">
                        {cart.map(item => (
                            <div key={item.id} className="p-4 border-b border-gray-100 last:border-0 flex gap-4">
                                <div className="w-16 h-20 bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
                                    <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">Quantity: {item.quantity}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[16px] font-black text-gray-900">₹{item.price.toLocaleString()}</span>
                                        {item.originalPrice && (
                                            <span className="text-[11px] text-gray-400 line-through font-medium">₹{item.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Details */}
                    <div className="bg-white p-4">
                        <h3 className="text-gray-400 font-bold uppercase text-[10px] mb-4 tracking-widest">Price Details</h3>
                        <div className="space-y-4 text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Price ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Delivery Charges</span>
                                <span className={delivery === 0 ? "text-green-600 font-black" : "text-gray-900"}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                            </div>
                            <div className="flex justify-between font-black text-[15px] border-t border-dashed pt-4 mt-2">
                                <span className="text-gray-900 tracking-tight">Total Amount</span>
                                <span className="text-gray-900 font-black">₹{finalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer for step 2 (Flipkart Style) */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-[50]">
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-gray-900">₹{finalAmount.toLocaleString()}</span>
                            <button className="text-[10px] text-blue-600 font-black uppercase tracking-tighter text-left w-fit">View Details</button>
                        </div>
                        <button
                            onClick={() => setStep(3)}
                            className="bg-[#fb641b] text-white px-14 py-3.5 rounded-sm font-black uppercase text-[13px] shadow-lg shadow-[#fb641b]/20 active:scale-[0.98] transition-all"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="p-2 space-y-4">
                    <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100">
                        <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-50">
                            <h3 className="text-[13px] font-bold uppercase text-gray-500 tracking-wide">Payment Options</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${paymentMethod === 'UPI' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-50'}`}>
                                    <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="accent-blue-600" />
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">UPI (PhonePe / Google Pay)</span>
                                            <span className="text-[10px] text-gray-400">Safe & Secure payments</span>
                                        </div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="upi" className="h-[14px]" />
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${paymentMethod === 'Card' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-50'}`}>
                                    <input type="radio" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="accent-blue-600" />
                                    <div className="flex-1 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">Credit / Debit Card</span>
                                            <span className="text-[10px] text-gray-400">All banks supported</span>
                                        </div>
                                        <div className="flex gap-1.5 grayscale opacity-50">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="visa" className="h-[10px]" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="mc" className="h-4" />
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-50'}`}>
                                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-blue-600" />
                                    <span className="text-sm font-bold text-gray-800">Cash on Delivery</span>
                                </label>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full mt-6 bg-[#fb641b] text-white py-4 rounded-sm font-black uppercase text-[14px] shadow-lg shadow-[#fb641b]/20 active:scale-[0.98] transition-all"
                            >
                                Pay & Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
