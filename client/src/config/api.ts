// API Configuration
// Change this URL when deploying to production
export const API_CONFIG = {
    // For local development
    // BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    BASE_URL:"https://community-rag-tau.vercel.app/",

    // API endpoints
    ENDPOINTS: {
        INIT: '/api/init',
        CHAT: '/api/chat',
        CUSTOM_BOT: '/api/custom-bot',
    }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
