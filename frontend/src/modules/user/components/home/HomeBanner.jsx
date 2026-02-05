import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useGoogleTranslation } from '../../../../hooks/useGoogleTranslation';

const HomeBanner = ({ banner }) => {
    const navigate = useNavigate();
    
    // Debugging Banner Data
    if (banner?.active && banner?.type === 'hero') {
        console.log('Banner Debug:', {
            id: banner._id,
            useCustomPosition: banner.content?.useCustomPosition,
            textPosition: banner.content?.textPosition,
            imagePosition: banner.content?.imagePosition
        });
    }
    
    if (!banner || !banner.active) return null;

    // Translation Hook for Content
    const translatedTitle = useGoogleTranslation(banner.content?.title);
    const translatedSubtitle = useGoogleTranslation(banner.content?.subtitle);
    const translatedDescription = useGoogleTranslation(banner.content?.description);
    const translatedOfferText = useGoogleTranslation(banner.content?.offerText);
    const translatedButtonText = useGoogleTranslation(banner.content?.buttonText);

    const handleSlideClick = (slide) => {
        const offerId = slide.linkedOffer?._id || slide.linkedOffer;
        const productId = slide.linkedProduct?._id || slide.linkedProduct;
        
        if (offerId) {
            navigate(`/offers/${offerId}`);
        } else if (productId) {
            navigate(`/product/${productId}`);
        } else if (slide.link) {
            if (slide.link.startsWith('http')) window.location.href = slide.link;
            else navigate(slide.link);
        }
    };

    const handleBannerContentClick = () => {
        const { content } = banner;
        const offerId = content?.linkedOffer?._id || content?.linkedOffer;
        const productId = content?.linkedProduct?._id || content?.linkedProduct;
        
        if (offerId) {
            navigate(`/offers/${offerId}`);
        } else if (productId) {
            navigate(`/product/${productId}`);
        } else if (content?.link) {
            if (content.link.startsWith('http')) window.location.href = content.link;
            else navigate(content.link);
        }
    };

    // --- Hero Banner Style ---
    if (banner.type === 'hero') {
        const { content } = banner;
        const textColor = content.textColor || '#ffffff';
        const bgColor = content.backgroundColor || '#1e3a5f';
        const useCustomPos = content.useCustomPosition || false;

        return (
            <section className="w-full mt-4 md:mt-8">
                <div 
                    onClick={handleBannerContentClick}
                    className="relative md:rounded-2xl overflow-hidden h-[220px] md:h-[360px] shadow-xl border border-white/5 group cursor-pointer"
                    style={{ backgroundColor: bgColor }}
                >
                    {/* Background Image Layer */}
                    {(content.backgroundImageUrl || content.imageUrl) && (
                        <div className="absolute inset-0">
                            <img 
                                src={content.backgroundImageUrl || content.imageUrl} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                alt="" 
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    )}

                    {/* Text Layer - REMOVED (Image Only Mode) */}

                                    {/* Main Product Image positioning - REMOVED */}


                    {/* Shop the Look - REMOVED (Image Only Mode) */}
                </div>
            </section>
        );
    }

    // --- Card Style (Visual Image with Text Overlay) ---
    if (banner.type === 'card') {
        return (
            <section className="w-full mt-6 md:mt-8">
                <div 
                    onClick={handleBannerContentClick}
                    className="md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform group relative h-[180px] md:h-[300px]"
                >
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
                                {translatedTitle}
                            </h2>
                            <p className="text-sm md:text-xl font-bold text-yellow-400 italic tracking-wide group-hover:translate-x-2 transition-transform delay-75 drop-shadow-md">
                                {translatedSubtitle || translatedOfferText}
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
                <div 
                    onClick={handleBannerContentClick}
                    className={`relative md:rounded-3xl overflow-hidden h-[200px] md:h-[360px] cursor-pointer group hover:shadow-xl transition-shadow ${banner.content.backgroundColor || 'bg-gradient-to-b from-white to-blue-100'} border-y md:border border-blue-200`}
                >
                    <div className="absolute inset-0 p-6 md:p-12 flex items-center">
                        <div className="w-1/2 md:w-1/3 z-10">
                            {banner.content.brand && (
                                <h4 className="text-[#e67e22] text-xs md:text-sm font-black tracking-widest uppercase mb-1">{banner.content.brand}</h4>
                            )}
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-2 line-clamp-2">
                                {translatedTitle}
                            </h2>
                            <p className="text-xs md:text-lg font-bold text-gray-600 line-clamp-2">
                                {translatedDescription}
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
                            <span className="text-white text-sm md:text-xl font-black">{translatedOfferText}</span>
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
                            <div 
                                className="relative aspect-[21/9] md:aspect-[3/1] w-full bg-gray-100 cursor-pointer"
                                onClick={() => handleSlideClick(slide)}
                            >
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

    // Fallback for missing slides or unknown type
    return (
        <div className="w-full h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">
            Banner Content Coming Soon ({banner.type})
        </div>
    );
};

export default HomeBanner;
