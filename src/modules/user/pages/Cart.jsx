import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ProductSection from '../components/home/ProductSection';
import { products } from '../data/mockData';

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        savedForLater,
        removeFromCart,
        updateQuantity,
        moveToSavedForLater,
        moveToCart,
        removeFromSavedForLater,
        getTotalPrice,
        getTotalOriginalPrice,
        getTotalSavings,
        addresses
    } = useCartStore();

    const price = getTotalPrice();
    const originalPrice = getTotalOriginalPrice();
    const savings = getTotalSavings();
    const delivery = price > 500 ? 0 : 40;

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-24">
            {/* Header */}
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-2 border-b sticky top-0 z-50 shadow-sm md:static md:shadow-none md:border-b-0 md:bg-transparent md:mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="material-icons p-2 -ml-2 active:bg-gray-100 rounded-full transition-all cursor-pointer relative z-[60] md:hidden"
                >
                    arrow_back
                </button>
                <h1 className="text-lg font-bold md:text-2xl">My Cart ({cart.length})</h1>
            </div>

            {/* Main Content Grid */}
            {cart.length === 0 && savedForLater.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center bg-white h-[70vh] md:rounded-xl md:shadow-sm md:h-auto md:py-20">
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d405a710-1043-4977-88f2-fdc95bede36f.png?q=90" alt="empty" className="w-48 mb-6" />
                    <h2 className="text-xl font-bold mb-2">Your cart is empty!</h2>
                    <p className="text-gray-500 text-sm mb-6">Add items to it now.</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold shadow-md">Shop Now</button>
                </div>
            ) : (
                <div className="w-full md:flex md:gap-6">
                    {/* LEFT COLUMN */}
                    <div className="space-y-2 md:space-y-4 md:flex-1">
                        {/* Deliver to section */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-b md:rounded-sm md:shadow-sm w-full">
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-gray-700">Deliver to: <span className="font-bold">{addresses[0]?.name}, {addresses[0]?.pincode}</span></span>
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase shrink-0">{addresses[0]?.type}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 truncate">{addresses[0]?.address}, {addresses[0]?.city}</p>
                            </div>
                            <button onClick={() => navigate('/checkout')} className="text-blue-600 font-bold text-[12px] border border-gray-300 px-3 py-1.5 rounded-sm active:bg-blue-50 hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0 ml-4">Change</button>
                        </div>

                        {/* Checkout Process Steps */}
                        <div className="bg-white px-6 py-5 border-b flex items-center justify-between overflow-x-auto no-scrollbar relative">
                            <div className="absolute top-[34px] left-[15%] right-[15%] h-[1px] bg-gray-200 -z-0"></div>

                            <div className="flex flex-col items-center gap-2 min-w-[60px] relative z-10">
                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[12px] font-bold shadow-sm ring-4 ring-white">1</div>
                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Cart</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 min-w-[60px] relative z-10 opacity-40">
                                <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-[12px] font-bold shadow-sm ring-4 ring-white">2</div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Address</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 min-w-[60px] relative z-10 opacity-40">
                                <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-[12px] font-bold shadow-sm ring-4 ring-white">3</div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Summary</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 min-w-[60px] relative z-10 opacity-40">
                                <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center text-[12px] font-bold shadow-sm ring-4 ring-white">4</div>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Payment</span>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white md:rounded-sm md:shadow-sm">
                            {cart.map((item) => (
                                <div key={`${item.id}-${JSON.stringify(item.selectedSize)}`} className="p-4 border-b last:border-b-0">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded border p-1">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-sm text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h2>
                                            {item.selectedSize && <p className="text-xs text-gray-500 mt-1">Size: {item.selectedSize}</p>}
                                            {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-lg font-bold">₹{item.price}</span>
                                                {item.originalPrice && (
                                                    <span className="text-xs text-gray-500 line-through">₹{item.originalPrice}</span>
                                                )}
                                                <span className="text-xs text-green-600 font-bold">
                                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, { selectedSize: item.selectedSize, selectedColor: item.selectedColor })}
                                                className="w-8 h-8 flex items-center justify-center active:bg-gray-100 hover:bg-gray-50"
                                            >
                                                <span className="material-icons text-lg">remove</span>
                                            </button>
                                            <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, { selectedSize: item.selectedSize, selectedColor: item.selectedColor })}
                                                className="w-8 h-8 flex items-center justify-center active:bg-gray-100 hover:bg-gray-50"
                                            >
                                                <span className="material-icons text-lg">add</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm font-bold text-gray-800 uppercase">
                                            <button onClick={() => moveToSavedForLater(item)} className="hover:text-blue-600">Save for later</button>
                                            <button onClick={() => removeFromCart(item.id, { selectedSize: item.selectedSize, selectedColor: item.selectedColor })} className="hover:text-red-500">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Saved for Later */}
                        {savedForLater.length > 0 && (
                            <div className="bg-white md:rounded-sm md:shadow-sm md:mt-4">
                                <div className="px-4 py-3 border-b">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase">Saved for later ({savedForLater.length})</h3>
                                </div>
                                {savedForLater.map((item) => (
                                    <div key={item.id} className="p-4 border-b last:border-b-0 flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                        <div className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded border p-1 grayscale">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-sm text-gray-600 line-clamp-2">{item.name}</h2>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-lg font-bold text-gray-600">₹{item.price}</span>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4 text-xs font-bold uppercase">
                                                <button onClick={() => moveToCart(item)} className="text-blue-600 hover:underline">Move to Cart</button>
                                                <button onClick={() => removeFromSavedForLater(item.id)} className="text-gray-500 hover:text-red-500">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Similar Products (Inside Left Col for consistent flow) */}
                        <div className="pb-10 px-4">
                            <ProductSection
                                title="You might be interested in"
                                products={products.slice(0, 6)}
                                containerClass="mt-2"
                                onViewAll={() => navigate('/category/You might be interested in')}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Desktop Sidebar) */}
                    <div className="hidden w-[320px] lg:w-[360px] shrink-0">
                        <div className="sticky top-20 space-y-4">
                            {/* Price Summary */}
                            {cart.length > 0 && (
                                <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
                                    <h3 className="text-gray-500 font-bold uppercase text-[13px] mb-4 border-b pb-2">Price Details</h3>
                                    <div className="space-y-3 text-[14px]">
                                        <div className="flex justify-between">
                                            <span>Price ({cart.length} items)</span>
                                            <span>₹{originalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Discount</span>
                                            <span className="text-green-600">- ₹{savings.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery Charges</span>
                                            <span className={delivery === 0 ? "text-green-600" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t border-dashed pt-3 mt-3">
                                            <span>Total Amount</span>
                                            <span>₹{(price + delivery).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-green-600 font-bold text-[14px]">
                                        You will save ₹{savings.toLocaleString()} on this order
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>

                    {/* Mobile Price Summary (Visible on All screens now) */}
                    <div className="">
                        {cart.length > 0 && (
                            <div className="bg-white py-4 mb-4">
                                <h3 className="text-gray-500 font-bold uppercase text-[13px] mb-4 border-b pb-2 px-4">Price Details</h3>
                                <div className="space-y-3 text-[14px] px-4">
                                    <div className="flex justify-between">
                                        <span>Price ({cart.length} items)</span>
                                        <span>₹{originalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="text-green-600">- ₹{savings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span className={delivery === 0 ? "text-green-600" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t border-dashed pt-3 mt-3">
                                        <span>Total Amount</span>
                                        <span>₹{(price + delivery).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-green-600 font-bold text-[14px] px-4">
                                    You will save ₹{savings.toLocaleString()} on this order
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Actions - MOBILE ONLY */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between z-[100] shadow-[0_-4px_6px_rgba(0,0,0,0.1)] md:px-12">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold">₹{(price + delivery).toLocaleString()}</span>
                        <span className="text-xs text-blue-600 font-bold cursor-pointer" onClick={() => document.getElementById('price-details')?.scrollIntoView({ behavior: 'smooth' })}>View price details</span>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="bg-[#fb641b] text-white px-8 py-3 rounded-md font-bold text-sm shadow-sm hover:bg-[#e65a17] transition w-1/2 ml-4"
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};


export default Cart;
