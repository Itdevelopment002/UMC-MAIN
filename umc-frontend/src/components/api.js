import axios from 'axios';

// export const baseURL = 'https://api.umc.gov.in/api';
 export const baseURL = 'http://localhost:6002/api';
const api = axios.create({
  baseURL,
});

export default api;