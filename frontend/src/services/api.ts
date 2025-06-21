import axios from 'axios';
import { AuthResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5205/api';

// Check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
};

// Get token expiration time
const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Handle token expiration
const handleTokenExpiration = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiration');
  
  // Show user-friendly message with better UX
  const showToast = () => {
    // Create a toast notification if toast context is available
    const event = new CustomEvent('showToast', {
      detail: {
        type: 'warning',
        title: 'Oturum Süresi Doldu',
        message: 'Güvenliğiniz için oturum süreniz dolmuştur. Lütfen tekrar giriş yapınız.'
      }
    });
    window.dispatchEvent(event);
  };

  // Show toast first, then redirect after a short delay
  showToast();
  
  setTimeout(() => {
    window.location.href = '/login';
  }, 2000); // 2 saniye bekle
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and check expiration
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before making the request
      if (isTokenExpired(token)) {
        handleTokenExpiration();
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // User login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    
    // Try different response structures
    let authData;
    if (response.data.data) {
      authData = response.data.data;
    } else {
      authData = response.data;
    }
    
    // Store token expiration info
    const token = authData.Token || authData.token;
    
    if (token) {
      const expirationTime = getTokenExpirationTime(token);
      if (expirationTime) {
        localStorage.setItem('tokenExpiration', expirationTime.toISOString());
      }
    }
    
    // Return normalized response
    return {
      token: token,
      user: authData.User || authData.user,
      expiresAt: authData.ExpiresAt || authData.expiresAt,
      success: authData.Success || authData.success
    };
  },

  // User registration
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    const authData = response.data.data; // Backend returns data in 'data' field
    
    // Store token expiration info
    if (authData.Token) {
      const expirationTime = getTokenExpirationTime(authData.Token);
      if (expirationTime) {
        localStorage.setItem('tokenExpiration', expirationTime.toISOString());
      }
    }
    
    // Return normalized response
    return {
      token: authData.Token,
      user: authData.User,
      expiresAt: authData.ExpiresAt,
      success: authData.Success
    };
  },

  // User logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      handleTokenExpiration();
      return false;
    }
    
    return true;
  },

  // Get token expiration time from localStorage
  getTokenExpirationTime: () => {
    const expirationStr = localStorage.getItem('tokenExpiration');
    return expirationStr ? new Date(expirationStr) : null;
  },

  // Get remaining token time
  getRemainingTime: () => {
    const token = localStorage.getItem('token');
    if (!token) return 0;
    
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return 0;
    
    const now = new Date();
    const remaining = expirationTime.getTime() - now.getTime();
    return Math.max(0, remaining);
  }
};

export const productService = {
  // Get all products with pagination
  getAll: async (page = 1, pageSize = 12) => {
    const response = await api.get(`/products?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Get product by ID
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getByCategory: async (categoryId: number, page = 1, pageSize = 12) => {
    const response = await api.get(`/products/category/${categoryId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Get featured products
  getFeatured: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Search products
  search: async (searchTerm: string) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },
};

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export const cartService = {
  getItems: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addItem: async (productId: number, quantity: number) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateItem: async (productId: number, quantity: number) => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data;
  },

  removeItem: async (productId: number) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  getTotal: async () => {
    const response = await api.get('/cart/total');
    return response.data;
  },
};

export const orderService = {
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getByUser: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export const addressService = {
  getByUser: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  create: async (addressData: any) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  update: async (id: number, addressData: any) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefault: async (id: number) => {
    const response = await api.put(`/addresses/${id}/set-default`);
    return response.data;
  },
};

export default api; 