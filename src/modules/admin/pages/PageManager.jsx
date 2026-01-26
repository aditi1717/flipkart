import React, { useState, useEffect } from 'react';
import { useContentStore } from '../store/contentStore';
import { MdSave, MdDescription, MdSecurity } from 'react-icons/md';

const PageManager = () => {
    const { privacyPolicy, aboutUs, seoContent, updateContent } = useContentStore();
    const [activeTab, setActiveTab] = useState('privacyPolicy');
    const [editorContent, setEditorContent] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (activeTab === 'privacyPolicy') {
            setEditorContent(privacyPolicy);
        } else if (activeTab === 'aboutUs') {
            setEditorContent(aboutUs);
        } else {
            setEditorContent(seoContent);
        }
        setIsSaved(false);
    }, [activeTab, privacyPolicy, aboutUs, seoContent]);

    const handleSave = () => {
        updateContent(activeTab, editorContent);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Content Management</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('privacyPolicy')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'privacyPolicy'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <MdSecurity className="text-lg" />
                        Privacy Policy
                    </button>
                    <button
                        onClick={() => setActiveTab('aboutUs')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'aboutUs'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <MdDescription className="text-lg" />
                        About Us
                    </button>
                    <button
                        onClick={() => setActiveTab('seoContent')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'seoContent'
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <MdDescription className="text-lg" />
                        SEO Footer
                    </button>
                </div>

                {/* Editor Area */}
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Page Content ({activeTab === 'privacyPolicy' ? 'Privacy Policy' : activeTab === 'aboutUs' ? 'About Us' : 'SEO Footer'})
                        </label>
                        <div className="relative">
                            <textarea
                                value={editorContent}
                                onChange={(e) => {
                                    setEditorContent(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="w-full h-[500px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none font-mono text-sm leading-relaxed"
                                placeholder="Enter page content here..."
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                                {editorContent.length} characters
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * Supports basic text formatting. You can use markdown-like structure.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        {isSaved && (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                <span className="material-icons text-sm">check_circle</span>
                                Saved Successfully
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <MdSave />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageManager;
