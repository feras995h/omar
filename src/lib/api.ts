// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function for API requests
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response;
};

// Helper for JSON API requests
export const apiRequestJson = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await apiRequest(endpoint, options);
  return response.json();
};