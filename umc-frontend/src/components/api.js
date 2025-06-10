import axios from 'axios';

<<<<<<< HEAD
export const baseURL = 'https://umc.gov.in/api/api';
//  export const baseURL = 'http://localhost:6002/api';
=======
export const baseURL = process.env.REACT_APP_API_BASE_URL;

>>>>>>> c9e9ce9030a7b589910757bb9ca07125a0909117
const api = axios.create({
  baseURL,
});

export default api;
