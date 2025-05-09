
import axios from 'axios';
import type { AuthResponse, LoginCredentials, SignupData, User } from '../types/user';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // Debug the API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log responses for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method}] ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', { ...credentials, password: '****' });
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      console.log('Attempting signup with:', { ...userData, password: '****' });
      const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
      return null;
    }
  },
};

// User services
export const userService = {
  getProfile: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${userId}`, userData);
    return response.data;
  },
  
  getBrowseUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/browse');
    return response.data;
  },
};

// Relationship services
export const relationshipService = {
  sendRequest: async (followedUserId: string): Promise<any> => {
    const response = await apiClient.post('/relationships/request', { followedUserId });
    return response.data;
  },
  
  respondToRequest: async (relationshipId: string, status: 'rejected' | 'matched'): Promise<any> => {
    const response = await apiClient.put(`/relationships/${relationshipId}/status`, { status });
    return response.data;
  },
  
  withdrawRequest: async (relationshipId: string): Promise<any> => {
    const response = await apiClient.delete(`/relationships/withdraw/${relationshipId}`);
    return response.data;
  },
  
  getMatches: async (): Promise<any[]> => {
    const response = await apiClient.get('/relationships/matches');
    return response.data;
  },
};

// Chat services
export const chatService = {
  getConversations: async (): Promise<any[]> => {
    const response = await apiClient.get('/chats/conversations');
    return response.data;
  },
  
  getMessages: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get(`/chats/messages/${userId}`);
    return response.data;
  },
  
  sendMessage: async (receiverId: string, message: string): Promise<any> => {
    const response = await apiClient.post('/chats/send', { receiverId, message });
    return response.data;
  },
  
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/chats/unread');
    return response.data.unreadCount;
  }
};

export default apiClient;
