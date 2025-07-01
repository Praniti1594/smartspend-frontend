// utils/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8003' });
export default API;
