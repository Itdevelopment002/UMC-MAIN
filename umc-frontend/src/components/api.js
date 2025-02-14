import axios from 'axios';

export const baseURL = 'https://bacumc.genicminds.com/api';
//  export const baseURL = 'http://localhost:5011/api';
const api = axios.create({
  baseURL,
});

export default api;