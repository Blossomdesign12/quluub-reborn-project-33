
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Initialize Supabase client for edge functions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Auth service
export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  signup: async (userData: {
    username: string;
    email: string;
    password: string;
    fname: string;
    lname: string;
    gender: string;
  }) => {
    const response = await apiClient.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  }
};

// User service
export const userService = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/profile/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userId: string, profileData: any) => {
    const response = await apiClient.put(`/users/${userId}`, profileData);
    return response.data;
  },
  
  getBrowseUsers: async (params?: any) => {
    const response = await apiClient.get('/users/browse', { params });
    return response.data;
  },
  
  upgradePlan: async (planData: { email: string; plan: string }) => {
    const response = await apiClient.post('/users/upgrade-plan', planData);
    return response.data;
  },
  
  // Favorites
  addToFavorites: async (userId: string) => {
    const response = await apiClient.post(`/users/favorites/${userId}`);
    return response.data;
  },
  
  removeFromFavorites: async (userId: string) => {
    const response = await apiClient.delete(`/users/favorites/${userId}`);
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await apiClient.get('/users/favorites');
    return response.data;
  }
};

// Relationship service
export const relationshipService = {
  sendRequest: async (followedUserId: string) => {
    const response = await apiClient.post('/relationships/request', { followedUserId });
    return response.data;
  },
  
  respondToRequest: async (requestId: string, action: 'accept' | 'reject') => {
    // Map frontend actions to backend status values
    const status = action === 'accept' ? 'matched' : 'rejected';
    const response = await apiClient.put(`/relationships/${requestId}/status`, { status });
    return response.data;
  },
  
  getReceivedRequests: async () => {
    const response = await apiClient.get('/relationships/pending');
    return response.data;
  },
  
  getPendingRequests: async () => {
    const response = await apiClient.get('/relationships/pending');
    return response.data;
  },
  
  getSentRequests: async () => {
    const response = await apiClient.get('/relationships/sent');
    return response.data;
  },
  
  getMatches: async () => {
    const response = await apiClient.get('/relationships/matches');
    return response.data;
  }
};

// Chat service
export const chatService = {
  getConversations: async () => {
    const response = await apiClient.get('/chats/conversations');
    return response.data;
  },
  
  getMessages: async (userId: string) => {
    const response = await apiClient.get(`/chats/messages/${userId}`);
    return response.data;
  },
  
  sendMessage: async (receiverId: string, message: string) => {
    const response = await apiClient.post('/chats/send', { receiverId, message });
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await apiClient.get('/chats/unread');
    return response.data;
  }
};

// Payment service
export const paymentService = {
  createPaystackPayment: async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-paystack-payment', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }
};

export default apiClient;
