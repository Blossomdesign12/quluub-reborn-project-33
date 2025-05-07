
import axios from 'axios';

// Define your API base URL here, where your MongoDB API will be hosted
// For development, this might be something like http://localhost:5000/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://yourapi.example.com/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define auth related functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (userData: any) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },
  verifyToken: async () => {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('auth_token');
  }
};

// Define user related functions
export const userAPI = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  getMatches: async () => {
    const response = await apiClient.get('/users/matches');
    return response.data;
  }
};

// Define relationship related functions
export const relationshipAPI = {
  sendRequest: async (userId: string) => {
    const response = await apiClient.post('/relationships', { followed_user_id: userId });
    return response.data;
  },
  acceptRequest: async (relationshipId: string) => {
    const response = await apiClient.put(`/relationships/${relationshipId}/accept`);
    return response.data;
  },
  rejectRequest: async (relationshipId: string) => {
    const response = await apiClient.put(`/relationships/${relationshipId}/reject`);
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await apiClient.get('/relationships/pending');
    return response.data;
  }
};

// Define chat related functions
export const chatAPI = {
  getConversations: async () => {
    const response = await apiClient.get('/chats/conversations');
    return response.data;
  },
  getMessages: async (userId: string) => {
    const response = await apiClient.get(`/chats/${userId}`);
    return response.data;
  },
  sendMessage: async (receiverId: string, message: string) => {
    const response = await apiClient.post('/chats', { receiverId, message });
    return response.data;
  },
  markAsRead: async (chatId: string) => {
    const response = await apiClient.put(`/chats/${chatId}/read`);
    return response.data;
  }
};

export default apiClient;
