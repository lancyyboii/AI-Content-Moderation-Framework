import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Moderate text content
 * @param {string} content - Text content to moderate
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Moderation result
 */
export const moderateText = async (content, options = {}) => {
  try {
    const response = await api.post('/moderate', {
      content,
      type: 'text',
      context: options.context || {},
      options: options.options || {}
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to moderate text content');
  }
};

/**
 * Moderate image content
 * @param {File} file - Image file to moderate
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Moderation result
 */
export const moderateImage = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add context and options as JSON strings
    if (options.context) {
      formData.append('context', JSON.stringify(options.context));
    }
    if (options.options) {
      formData.append('options', JSON.stringify(options.options));
    }
    
    const response = await api.post('/moderate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to moderate image content');
  }
};

/**
 * Moderate URL content
 * @param {string} url - URL to moderate
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Moderation result
 */
export const moderateUrl = async (url, options = {}) => {
  try {
    const response = await api.post('/moderate', {
      content: url,
      type: 'url',
      context: options.context || {},
      options: options.options || {}
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to moderate URL content');
  }
};

/**
 * Get moderation result by ID
 * @param {string} resultId - Moderation result ID
 * @returns {Promise<Object>} Moderation result
 */
export const getModerationResult = async (resultId) => {
  try {
    const response = await api.get(`/moderate/result/${resultId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get moderation result');
  }
};

/**
 * Get moderation statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getStats = async () => {
  try {
    const response = await api.get('/moderate/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get statistics');
  }
};

/**
 * Get system health status
 * @returns {Promise<Object>} Health status
 */
export const getHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get health status');
  }
};

export default api;