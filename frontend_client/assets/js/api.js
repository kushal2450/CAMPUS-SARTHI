// API Base URL
const API_URL = 'http://localhost:5000/api';

// Store token
let authToken = localStorage.getItem('token');

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (authToken) {
        headers['x-auth-token'] = authToken;
    }

    const config = {
        method,
        headers,
        mode: 'cors', // Add this
        cache: 'no-cache' // Add this
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        console.log(`Making ${method} request to: ${API_URL}${endpoint}`);
        console.log('Request data:', data);
        
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok) {
            throw new Error(result.message || 'API call failed');
        }

        return result;
    } catch (error) {
        console.error('API Error Details:', {
            message: error.message,
            endpoint: endpoint,
            method: method,
            data: data
        });
        throw error;
    }
}

// Auth functions
async function login(email, password) {
    try {
        console.log('Attempting login for:', email);
        const data = await apiCall('/auth/login', 'POST', { email, password });
        authToken = data.token;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login successful');
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
}

async function register(userData) {
    try {
        console.log('Attempting registration for:', userData.email);
        const data = await apiCall('/auth/register', 'POST', userData);
        authToken = data.token;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Registration successful');
        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function isAuthenticated() {
    return !!authToken || !!localStorage.getItem('token');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Event functions
async function getEvents() {
    return await apiCall('/events');
}

// Notice functions
async function getNotices() {
    return await apiCall('/notices');
}