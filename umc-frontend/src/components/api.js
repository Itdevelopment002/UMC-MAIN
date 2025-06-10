import axios from 'axios';

export const baseURL = 'https://umc.gov.in/api/api';

const api = axios.create({
  baseURL,
});

export default api;
