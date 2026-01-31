import axios from 'axios';
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    try {
        const storageData = localStorage.getItem('admin-auth-storage');
        if (storageData) {
            const parsed = JSON.parse(storageData);
            const token = parsed?.state?.adminUser?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    } catch (error) {
        console.error('Error retrieving auth token:', error);
    }
    return config;
});

export default API;
