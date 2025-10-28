import axios from 'axios';
export const proxyService = {
    request: async (proxyConfig: any) => {
        try {
            const config = {
                baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
                url: '/proxy',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: proxyConfig
            }
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }
};

