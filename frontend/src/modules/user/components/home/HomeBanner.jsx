import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HomeBanner = ({ banner }) => {
    if (!banner || !banner.active) return null;

    // --- Hero Banner Style ---
    if (banner.type === 'hero') {
        return (
            <section className="w-full mt-4 md:mt-8">
                <div className={`relative md:rounded-2xl overflow-hidden h-[180px] md:h-[300px] shadow-xl border border-white/5 group cursor-pointer ${banner.content.backgroundColor || 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a]'}`}>
                    <div className="absolute inset-0 flex">
                        <div className="w-1/2 md:w-2/5 p-5 md:pl-16 flex flex-col justify-center z-10">
                            {(banner.content.brand || banner.content.brandTag) && (
                                <div className="flex items-center gap-2 mb-2">
                                    {banner.content.brand && <span className="text-[10px] md:text-sm font-bold text-blue-400 border border-blue-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">{banner.content.brand}</span>}
                                    {banner.content.brandTag && <span className="text-[10px] md:text-sm font-bold text-yellow-500 uppercase tracking-tighter">{banner.content.brandTag}</span>}
                                </div>
                            )}
                            <h2 className="text-white text-xl md:text-5xl font-black leading-tight tracking-tight uppercase group-hover:underline decoration-yellow-400 decoration-4 underline-offset-4 transition-all line-clamp-2">
                                {banner.content.title}
                            </h2>
                            <p className="text-white text-lg md:text-3xl font-bold mt-1 md:mt-2 line-clamp-1">{banner.content.subtitle}</p>
                            <p className="text-white/60 text-[10px] md:text-base mt-1 leading-tight line-clamp-2">{banner.content.description}</p>

                            {(banner.content.offerText || banner.content.offerBank) && (
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="bg-white/10 backdrop-blur-md rounded p-1.5 md:p-2 flex items-center gap-2 border border-white/10">
                                        {banner.content.offerBank && (
                                            <div className="bg-[#1d4ed8] p-0.5 rounded">
                                                <span className="text-[8px] md:text-xs font-bold text-white">{banner.content.offerBank}</span>
                                            </div>
                                        )}
                                        <span className="text-[8px] md:text-sm font-bold text-white truncate">{banner.content.offerText}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-1/2 md:w-3/5 relative">
                            {banner.content.imageUrl && (
                                <img
                                    src={banner.content.imageUrl}
                                    alt={banner.content.title}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] md:h-[110%] object-contain scale-110 md:scale-100 rotate-[-10deg] md:rotate-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105 duration-500"
                                />
                            )}
                            {banner.content.badgeText && (
                                <div className="absolute bottom-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-[10px] md:text-lg font-black uppercase italic shadow-lg">
                                    {banner.content.badgeText}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // --- Card Style (Visual Image with Text Overlay) ---
    if (banner.type === 'card') {
        return (
            <section className="w-full mt-6 md:mt-8">
                <div className="md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform group relative h-[180px] md:h-[300px]">
                    <img
                        src={banner.content.imageUrl}
                        alt={banner.content.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center p-6 bg-gradient-to-r from-black/50 to-transparent">
                        <div className="max-w-[70%]">
                            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:translate-x-2 transition-transform drop-shadow-md">
                                {banner.content.title}
                            </h2>
                            <p className="text-sm md:text-xl font-bold text-yellow-400 italic tracking-wide group-hover:translate-x-2 transition-transform delay-75 drop-shadow-md">
                                {banner.content.subtitle || banner.content.offerText}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // --- Product Feature Style (Sponsored / Special Layout) ---
    if (banner.type === 'product_feature') {
        return (
            <section className="w-full mt-2 md:mt-10">
                 <div className="flex items-center gap-2 mb-3 px-4 md:px-0">
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900">Sponsored</h3>
                </div>
                <div className={`relative md:rounded-3xl overflow-hidden h-[200px] md:h-[360px] cursor-pointer group hover:shadow-xl transition-shadow ${banner.content.backgroundColor || 'bg-gradient-to-b from-white to-blue-100'} border-y md:border border-blue-200`}>
                    <div className="absolute inset-0 p-6 md:p-12 flex items-center">
                        <div className="w-1/2 md:w-1/3 z-10">
                            {banner.content.brand && (
                                <h4 className="text-[#e67e22] text-xs md:text-sm font-black tracking-widest uppercase mb-1">{banner.content.brand}</h4>
                            )}
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-2 line-clamp-2">
                                {banner.content.title}
                            </h2>
                            <p className="text-xs md:text-lg font-bold text-gray-600 line-clamp-2">
                                {banner.content.description}
                            </p>
                            <button className="hidden md:block mt-6 bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-black transition-colors">
                                Shop Now
                            </button>
                        </div>
                        <div className="w-1/2 md:w-2/3 h-full flex items-center justify-center relative">
                            {banner.content.imageUrl && (
                                <img
                                    src={banner.content.imageUrl}
                                    alt={banner.content.title}
                                    className="h-[120%] md:h-[130%] object-contain drop-shadow-2xl translate-x-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            )}
                        </div>
                    </div>
                    {banner.content.offerText && (
                        <div className="absolute bottom-0 left-0 right-0 py-2.5 px-6 md:px-12 bg-[#ff6b35] flex items-center justify-between z-20">
                            <span className="text-white text-sm md:text-xl font-black">{banner.content.offerText}</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`h-1.5 md:h-2 rounded-full ${i === 4 ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40'}`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // --- Slideshow Style ---
    if (banner.type === 'slides' && banner.slides?.length > 0) {
        return (
            <section className="w-full mt-4 md:mt-8">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    loop={true}
                    className="md:rounded-2xl overflow-hidden shadow-sm group home-banner-swiper"
                >
                    {banner.slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative aspect-[21/9] md:aspect-[3/1] w-full bg-gray-100">
                                <img 
                                    src={slide.imageUrl} 
                                    className="w-full h-full object-cover" 
                                    alt={`Slide ${index + 1}`} 
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        );
    }

    return null;
};

export default HomeBanner;
