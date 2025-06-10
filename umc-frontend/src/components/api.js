import axios from 'axios';

export const baseURL = 'https://umc.gov.in/api/api';
//  export const baseURL = 'http://localhost:6002/api';
const api = axios.create({
  baseURL,
});

export default api;
