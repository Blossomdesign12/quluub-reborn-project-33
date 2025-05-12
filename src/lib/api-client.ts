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
  
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>('/auth/users');
      console.log('All users:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
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
  
  getBrowseUsers: async (params: { country?: string, nationality?: string, limit?: number, showAll?: boolean, page?: number } = {}): Promise<User[]> => {
    // Build the query string from params
    const queryParams = new URLSearchParams();
    if (params.country) queryParams.append('country', params.country);
    if (params.nationality) queryParams.append('nationality', params.nationality);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.showAll) queryParams.append('showAll', 'true');
    if (params.page) queryParams.append('page', params.page.toString());
    
    const queryString = queryParams.toString();
    const url = `/users/browse${queryString ? `?${queryString}` : ''}`;
    
    console.log("Fetching users with URL:", url);
    const response = await apiClient.get<User[]>(url);
    console.log("API response for browse users:", response.data);
    return response.data;
  },
};

// Relationship services
export const relationshipService = {
  sendRequest: async (followedUserId: string): Promise<any> => {
    console.log("Sending relationship request to:", followedUserId);
    try {
      const response = await apiClient.post('/relationships/request', { followedUserId });
      return response.data;
    } catch (error) {
      console.error("Error sending relationship request:", error);
      throw error;
    }
  },
  
  respondToRequest: async (relationshipId: string, status: 'rejected' | 'matched'): Promise<any> => {
    try {
      const response = await apiClient.put(`/relationships/${relationshipId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error responding to request:", error);
      throw error;
    }
  },
  
  withdrawRequest: async (relationshipId: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`/relationships/withdraw/${relationshipId}`);
      return response.data;
    } catch (error) {
      console.error("Error withdrawing request:", error);
      throw error;
    }
  },
  
  getMatches: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/relationships/matches');
      console.log("Matches API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      return { count: 0, matches: [] }; // Return empty data on error
    }
  },
  
  getPendingRequests: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/relationships/pending');
      console.log("Pending requests API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      return { count: 0, requests: [] }; // Return empty data on error
    }
  },
};

// Chat services
export const chatService = {
  getConversations: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/chats/conversations');
      return response.data || [];
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  },
  
  getMessages: async (userId: string): Promise<any[]> => {
    try {
      const response = await apiClient.get(`/chats/messages/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  },
  
  sendMessage: async (receiverId: string, message: string): Promise<any> => {
    try {
      const response = await apiClient.post('/chats/send', { receiverId, message });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
  
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/chats/unread');
      return response.data?.unreadCount || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
};

export default apiClient;
