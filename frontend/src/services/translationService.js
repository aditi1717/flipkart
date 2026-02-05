/**
 * Service to handle Google Cloud Translation API interactions.
 * Includes caching in localStorage to minimize API costs and improve performance.
 */

const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY || ''; // User needs to set this
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const CACHE_KEY_PREFIX = 'trans_cache_v2_'; // Incremented version to clear old "Apple" -> "सेब" cache

// List of words that should NOT be translated
const PROTECTED_WORDS = [
    'Apple', 'Samsung', 'Realme', 'Xiaomi', 'Redmi', 'Oppo', 'Vivo', 
    'OnePlus', 'Sony', 'LG', 'Google', 'Microsoft', 'Dell', 'HP', 
    'Lenovo', 'Asus', 'Acer', 'Motorola', 'Nokia', 'Huawei', 'Honor',
    'Infinix', 'Tecno', 'Itel', 'Lava', 'Nothing', 'Poco', 'iQOO',
    'Flipkart', 'Amazon', 'IndianKart', 'iPhone', 'iPad', 'MacBook',
    'Galaxy', 'Note', 'Ultra', 'Pro', 'Max', 'Plus', 'Mini', 'Air',
    'Watch', 'Buds', 'AirPods'
];

/**
 * Generates a cache key for a specific text and target language.
 */
const getCacheKey = (text, targetLang) => `${CACHE_KEY_PREFIX}${targetLang}_${text}`;

/**
 * Replaces protected words with placeholders
 */
const maskProtectedWords = (text) => {
    let maskedText = text;
    const placeholders = [];
    
    PROTECTED_WORDS.forEach((word, index) => {
        // Case-insensitive regex with boundary check
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(maskedText)) {
            // Store the actual matched word case (e.g., "apple" -> "Apple")
            const matches = maskedText.match(regex);
            matches.forEach(match => {
                const placeholder = `__BP${placeholders.length}__`; // BP = Brand Placeholder
                // Only replace the first occurrence found to keep indices synced, or replace all safely?
                // Replacing one by one is safer for multiple same words
                 maskedText = maskedText.replace(match, placeholder);
                 placeholders.push({ placeholder, original: match });
            });
        }
    });
    
    return { maskedText, placeholders };
};

/**
 * Restores protected words from placeholders
 */
const unmaskProtectedWords = (text, placeholders) => {
    let unmaskedText = text;
    // Reverse order to avoid partial matches if nested (though unlikely with this scheme)
    for (let i = placeholders.length - 1; i >= 0; i--) {
        const { placeholder, original } = placeholders[i];
        // Replace all occurrences of the placeholder
        unmaskedText = unmaskedText.split(placeholder).join(original);
    }
    return unmaskedText;
};

/**
 * Fetches translation from Google API or local cache.
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'hi')
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLang) => {
    if (!text) return '';
    if (targetLang === 'en') return text; // Assuming source is English
    
    // Check Cache
    const cacheKey = getCacheKey(text, targetLang);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        return cached;
    }

    if (!API_KEY) {
        console.warn('Google Translation API Key is missing. Please set VITE_GOOGLE_TRANSLATION_API_KEY in .env');
        return text;
    }

    try {
        // 1. Mask protected words
        const { maskedText, placeholders } = maskProtectedWords(text);

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: maskedText,
                target: targetLang,
                format: 'text' // or 'html'
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Google Translation API Error:', data.error);
            return text;
        }

        let translatedText = data.data.translations[0].translatedText;

        // 2. Unmask protected words
        translatedText = unmaskProtectedWords(translatedText, placeholders);
        
        // Save to Cache
        localStorage.setItem(cacheKey, translatedText);
        
        return translatedText;
    } catch (error) {
        console.error('Translation fetch error:', error);
        return text;
    }
};

/**
 * Batch translation (if needed in future)
 */
export const translateBatch = async (texts, targetLang) => {
    // Implementation for array of strings if needed to reduce HTTP overhead
};
