import axios from 'axios';
 
// export const baseURL = 'https://api.umc.gov.in/api';
export const baseURL = 'http://localhost:6002/api';
 
const api = axios.create({
    baseURL,
});
 
// Set Authorization Header Dynamically
api.interceptors.request.use((config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
        config.headers['authorization'] = `Bearer ${authToken}`;
    }
    return config;
});
 
export default api;