import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../services/translationService';

/**
 * Custom hook to translate text asynchronously using Google API.
 * @param {string} text - The text to translate
 * @returns {string} - The translated text (or original while loading/error)
 */
export const useGoogleTranslation = (text) => {
    const { i18n } = useTranslation();
    const [translatedText, setTranslatedText] = useState(text);
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchTranslation = async () => {
            if (!text || i18n.language === 'en') {
                setTranslatedText(text);
                return;
            }

            setIsLoading(true);
            try {
                const result = await translateText(text, i18n.language);
                if (isMounted) {
                    setTranslatedText(result);
                }
            } catch (error) {
                console.error("Translation hook error:", error);
                if (isMounted) setTranslatedText(text);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchTranslation();

        return () => {
            isMounted = false;
        };
    }, [text, i18n.language]);

    return translatedText;
};
