import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { useContentStore } from '../../admin/store/contentStore';

const InfoPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { privacyPolicy, aboutUs } = useContentStore();
    const type = searchParams.get('type'); // 'privacy' or 'about'
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(null);

    useEffect(() => {
        let rawContent = '';
        if (type === 'privacy') {
            setTitle('Privacy Policy');
            rawContent = privacyPolicy;
        } else if (type === 'about') {
            setTitle('About Us');
            rawContent = aboutUs;
        } else {
            setTitle('Page Not Found');
            setContent(<p>The requested information page could not be found.</p>);
            return;
        }

        setContent(
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                {rawContent?.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                    // Simple heuristic for formatting
                    const trimmed = line.trim();
                    if (trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.includes(' ')) {
                        return <h3 key={index} className="font-bold text-gray-900 dark:text-white mt-4">{trimmed}</h3>;
                    }
                    if (trimmed.startsWith('- ')) {
                        return <li key={index} className="ml-5 list-disc">{trimmed.replace('- ', '')}</li>;
                    }
                    if (trimmed.length < 80 && (trimmed.match(/^[0-9]\./) || !trimmed.endsWith('.'))) {
                        return <h3 key={index} className="font-bold text-gray-900 dark:text-white mt-4">{trimmed}</h3>;
                    }
                    return <p key={index}>{trimmed}</p>;
                })}
            </div>
        );
    }, [type, privacyPolicy, aboutUs]);

    return (
        <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-sm px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800">
                <MdArrowBack onClick={() => navigate(-1)} className="text-2xl text-gray-700 dark:text-white cursor-pointer" />
                <h1 className="text-base font-bold text-gray-800 dark:text-white capitalize">
                    {title}
                </h1>
            </div>

            {/* Content */}
            <div className="p-4 bg-white dark:bg-zinc-900 min-h-[calc(100vh-60px)]">
                {content}
            </div>
        </div>
    );
};

export default InfoPage;
