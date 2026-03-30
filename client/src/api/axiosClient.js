import axios from "axios";

const axiosClient = axios.create({
    // ✅ Locked exclusively to your local machine
    baseURL: 'http://localhost:5000/api/v1', 
    
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach the JWT token to every single request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;