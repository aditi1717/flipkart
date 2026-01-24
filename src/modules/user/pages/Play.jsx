import React from 'react';
import { videos } from '../data/mockData';

const Play = () => {
    return (
        <div className="h-[calc(100vh-64px)] w-full overflow-hidden bg-black relative">
            <div className="h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
                {videos.map((video) => (
                    <section key={video.id} className="h-full w-full snap-start relative flex flex-col">
                        {/* Video Background Placeholder */}
                        <img
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            src={video.image}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>

                        {/* Top Bar Info */}
                        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center z-10">
                            <div className="flex items-center space-x-3">
                                <img
                                    alt={video.user}
                                    className="w-10 h-10 rounded-full border border-white/50"
                                    src={video.avatar}
                                />
                                <div>
                                    <p className="text-white font-semibold text-sm">{video.user}</p>
                                    <span className="text-[10px] text-white/70">{video.type}</span>
                                </div>
                                <button className="bg-transparent border border-white text-white px-3 py-1 rounded-md text-xs font-medium ml-2">
                                    Follow
                                </button>
                            </div>
                            <div className="bg-black/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center space-x-1">
                                <span className="material-icons-round text-white text-xs">visibility</span>
                                <span className="text-white text-[10px] font-medium">{video.views}</span>
                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none px-10 text-center">
                            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase mb-2">Popular</span>
                            <h2 className="text-white text-2xl font-black leading-tight drop-shadow-lg uppercase">
                                {video.title.split(' ').map((word, i) => (
                                    <React.Fragment key={i}>
                                        {word === 'GIFT' || word === 'Nike' ? <span className="text-yellow-400">{word} </span> : word + ' '}
                                        {i === 3 && <br />}
                                    </React.Fragment>
                                ))}
                            </h2>
                        </div>

                        {/* Right Side Actions */}
                        <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-10">
                            <div className="flex flex-col items-center text-white">
                                <button className="p-2"><span className="material-icons-round text-3xl">favorite_border</span></button>
                                <span className="text-xs font-medium">{video.likes}</span>
                            </div>
                            <div className="flex flex-col items-center text-white">
                                <button className="p-2"><span className="material-icons-round text-3xl">reply</span></button>
                                <span className="text-xs font-medium">Share</span>
                            </div>
                            <div className="flex flex-col items-center text-white">
                                <button className="p-2"><span className="material-icons-round text-3xl">chat_bubble_outline</span></button>
                                <span className="text-xs font-medium">{video.comments}</span>
                            </div>
                        </div>

                        {/* Bottom Product Info */}
                        <div className="absolute bottom-4 left-4 right-16 z-10">
                            {video.id === 2 ? (
                                <div className="bg-white/95 p-3 rounded-2xl flex items-center space-x-3">
                                    <img alt="Product" className="w-12 h-12 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoFpmZSRcIdkdtxynRzuu5PKjL_X3xWOKBFczlVHoMMFv9oDO2qKEQ1E0QWssaikfPfhtH-aLhvuKmP3RM-OQHSeNOAO1YRxZtpAMIO-RCHvLXEDGd49fFQjVPfmWkEZvmIbGrMj8eGxJMmoUTt0cTes1xD3EgLQ4jFmnbQRgZvLm6AF1hCF2KctDfRXr10CJswAgkFk6PTuthptHlDzT_vDeN2mBSPQMtIiP2DNUwr255ZIalsl63VsgwZLAOVGAzk_m42pNzPXU7" />
                                    <div className="flex-1">
                                        <p className="text-slate-900 text-xs font-bold line-clamp-1">Nike Air Max Premium Edition</p>
                                        <p className="text-slate-500 text-[10px]">Special Offer Price</p>
                                        <p className="text-primary text-sm font-bold">₹7,999 <span className="text-slate-400 line-through text-[10px]">₹12,999</span></p>
                                    </div>
                                    <button className="bg-primary text-white text-[10px] px-3 py-2 rounded-lg font-bold">BUY NOW</button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3">
                                    <p className="text-white text-sm font-medium">Top Picks for Men</p>
                                    <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-2 rounded-xl flex items-center space-x-3 w-fit">
                                        <span className="material-icons-round text-white text-sm">shopping_bag</span>
                                        <span className="text-white text-xs font-semibold">5 Products</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Play;
