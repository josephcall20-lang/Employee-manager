// API Configuration
export const API_BASE_URL = 'https://employee-manager-1-ilvi.onrender.com'

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

