import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const languages = [
    { name: 'English', native: 'English' },
    { name: 'Hindi', native: 'हिन्दी' },
    { name: 'Marathi', native: 'मराठी' },
    { name: 'Telugu', native: 'తెలుగు' },
    { name: 'Tamil', native: 'தமிழ்' },
    { name: 'Kannada', native: 'ಕನ್ನಡ' },
    { name: 'Gujarati', native: 'ગુજરાતી' },
    { name: 'Bengali', native: 'বাংলা' }
];

const SelectLanguage = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useCartStore();

    const handleSelect = (lang) => {
        setLanguage(lang);
        setTimeout(() => {
            navigate('/account');
        }, 300);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="material-icons text-gray-700">arrow_back</button>
                <h1 className="text-lg font-bold text-gray-800">Select Language</h1>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                    <button
                        key={lang.name}
                        onClick={() => handleSelect(lang.name)}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 group active:scale-95 ${language === lang.name
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-100 hover:border-blue-200'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${language === lang.name ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                            {language === lang.name && <span className="material-icons text-white text-[16px]">check</span>}
                        </div>
                        <span className={`text-base font-bold ${language === lang.name ? 'text-blue-600' : 'text-gray-800'}`}>
                            {lang.native}
                        </span>
                        <span className={`text-xs ${language === lang.name ? 'text-blue-400' : 'text-gray-400'}`}>
                            {lang.name}
                        </span>
                    </button>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white">
                <button
                    onClick={() => navigate('/account')}
                    className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-black uppercase text-sm shadow-lg active:scale-[0.98] transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SelectLanguage;
