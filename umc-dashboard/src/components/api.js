import axios from 'axios';
 
export const baseURL = process.env.REACT_APP_API_BASE_URL;
 
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or unauthorized
        localStorage.removeItem("authToken");
        // window.location.href = "/admin/login"; // redirect to login
      }
      return Promise.reject(error);
    }
  );
 
export default api;
