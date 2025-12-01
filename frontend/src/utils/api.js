import axios from "axios";
// const apiBaseUrl = 'http://localhost:5001/api';
const apiBaseUrl = 'https://react-python-global-app.onrender.com/api';

const api = axios.create({
  baseURL: apiBaseUrl, // your backend API
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // store token on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional: handle 401 globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // redirect to login or logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
