import axios from 'axios';

const api = axios.create({
  // Use 127.0.0.1 to avoid potential IPv6/IPv4 localhost resolution issues
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;