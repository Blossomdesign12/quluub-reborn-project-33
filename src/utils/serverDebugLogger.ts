
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Base URL from environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Trigger server-side logging for all models
 */
export const triggerServerLogs = async (): Promise<boolean> => {
  try {
    console.log("Triggering server-side logs for all models...");
    const response = await axios.get(`${API_URL}/debug/logs`);
    console.log("Server logs triggered:", response.data);
    return true;
  } catch (error) {
    console.error("Error triggering server logs:", error);
    toast({
      title: "Error",
      description: "Failed to trigger server logs. Check server connectivity.",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Trigger server-side logging for a specific user
 */
export const triggerUserServerLogs = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.error("User ID is required to trigger user logs");
    return false;
  }
  
  try {
    console.log(`Triggering server-side logs for user ID: ${userId}...`);
    const response = await axios.get(`${API_URL}/debug/logs/user/${userId}`);
    console.log("Server logs for user triggered:", response.data);
    return true;
  } catch (error) {
    console.error(`Error triggering server logs for user ${userId}:`, error);
    toast({
      title: "Error",
      description: `Failed to trigger server logs for user ${userId}. Check server connectivity.`,
      variant: "destructive",
    });
    return false;
  }
};
