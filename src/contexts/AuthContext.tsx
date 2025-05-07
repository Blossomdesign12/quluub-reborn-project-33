
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  _id: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // Verify token and get user data
      await authAPI.verifyToken();
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Authentication check failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authAPI.login(email, password);
      localStorage.setItem('auth_token', data.token);
      
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to Quluub!',
      });
      
      navigate('/browse');
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      const data = await authAPI.signup(userData);
      localStorage.setItem('auth_token', data.token);
      
      const userProfile = await userAPI.getCurrentUser();
      setUser(userProfile);
      
      toast({
        title: 'Account created successfully',
        description: 'Welcome to Quluub!',
      });
      
      navigate('/browse');
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: 'Signup failed',
        description: 'Please check your information and try again',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/auth');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
