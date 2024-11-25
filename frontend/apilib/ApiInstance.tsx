// src/api/apiInstance.js
import axios from "axios";

// Create a custom Axios instance
const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer YOUR_TOKEN', // Can be added dynamically later
    },
});

// Set up response interceptors to handle common errors globally
apiInstance.interceptors.response.use(
    response => response, // Directly return response if successful
    error => {
        if (error.response) {
            // Handle different status codes globally
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized! Please login again.');
                    break;
                case 500:
                    console.error('Server error, please try again later.');
                    break;
                default:
                    console.error('API Error: ', error.response);
            }
        } else if (error.request) {
            console.error('No response received from server.');
        } else {
            console.error('Axios configuration error:', error.message);
        }
        return Promise.reject(error); // Pass error to the component-level handler
    }
);

export default apiInstance;
