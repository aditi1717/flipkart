import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Wishlist = () => {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, moveToCart } = useCartStore();

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="bg-white sticky top-0 z-10 px-4 py-4 flex items-center gap-4 border-b">
                <button onClick={() => navigate(-1)} className="material-icons">arrow_back</button>
                <h1 className="text-lg font-bold">My Wishlist ({wishlist.length})</h1>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center">
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d405a710-1043-4977-88f2-fdc95bede36f.png?q=90" alt="empty" className="w-48 mb-6" />
                    <h2 className="text-xl font-bold mb-2">Empty Wishlist!</h2>
                    <p className="text-gray-500 text-sm mb-6">You have no items in your wishlist. Start adding!</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">Shop Now</button>
                </div>
            ) : (
                <div className="divide-y">
                    {wishlist.map((product) => (
                        <div key={product.id} className="p-4 flex gap-4 bg-white">
                            <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col pt-1">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</h2>
                                    <button onClick={() => toggleWishlist(product)} className="material-icons text-gray-400 text-xl">delete</button>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-lg font-bold">₹{product.price}</span>
                                    {product.originalPrice && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>}
                                    {product.discount && <span className="text-xs text-green-600 font-bold">{product.discount}% off</span>}
                                </div>
                                <button
                                    onClick={() => {
                                        moveToCart(product);
                                        navigate('/cart');
                                    }}
                                    className="mt-4 text-blue-600 font-bold text-sm border border-blue-600 rounded-lg py-2 hover:bg-blue-50"
                                >
                                    Move to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
