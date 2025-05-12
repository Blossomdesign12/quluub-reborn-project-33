
import { relationshipService, chatService, userService, authService } from "@/lib/api-client";

/**
 * Debug utility to log various model data to the console
 * This function will attempt to fetch and log data from all major models
 */
export const logAllModelData = async () => {
  console.group("Debug Data: Model Logging");
  
  try {
    // Fetch and log user data
    console.log("Attempting to fetch current user...");
    const currentUser = await authService.getCurrentUser();
    console.log("Current User:", currentUser);
    
    // Fetch relationship data
    console.log("Attempting to fetch matches...");
    const matches = await relationshipService.getMatches();
    console.log("Matches:", matches);
    
    console.log("Attempting to fetch pending requests...");
    const pendingRequests = await relationshipService.getPendingRequests();
    console.log("Pending Requests:", pendingRequests);
    
    // Fetch chat data
    console.log("Attempting to fetch conversations...");
    const conversations = await chatService.getConversations();
    console.log("Conversations:", conversations);
    
    // Log unread messages count
    const unreadCount = await chatService.getUnreadCount();
    console.log("Unread Message Count:", unreadCount);
    
    console.log("Debug logging completed successfully");
  } catch (error) {
    console.error("Error during debug logging:", error);
  } finally {
    console.groupEnd();
  }
};
