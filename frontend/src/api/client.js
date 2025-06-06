// src/api/client.js
import axios from 'axios';

// Base API configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;  // Add this line to export the client