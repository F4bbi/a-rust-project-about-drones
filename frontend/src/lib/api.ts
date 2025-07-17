const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_PATH = '/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  BASE_PATH: API_BASE_PATH,
  FULL_BASE_URL: `${API_BASE_URL}${API_BASE_PATH}`,
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // For development with Vite proxy, use relative paths
  if (import.meta.env.DEV) {
    return `${API_CONFIG.BASE_PATH}/${cleanEndpoint}`;
  }
  
  // For production, use full URL if API_BASE_URL is set
  if (API_CONFIG.BASE_URL) {
    return `${API_CONFIG.FULL_BASE_URL}/${cleanEndpoint}`;
  }
  
  // Fallback to relative path (same domain deployment)
  return `${API_CONFIG.BASE_PATH}/${cleanEndpoint}`;
};