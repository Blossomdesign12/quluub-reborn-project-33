
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { relationshipService, chatService } from '@/lib/api-client';
import { User, Relationship } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { logUserData, logRelationshipData, logChatData } from '@/utils/userDataLogger';

interface UserDetails {
  user: User | null;
  matches: any;
  pendingRequests: any;
  conversations: any[];
  unreadMessageCount: number;
  isLoading: boolean;
  error: Error | null;
}

export const useCurrentUserDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [details, setDetails] = useState<UserDetails>({
    user: null,
    matches: { count: 0, matches: [] },
    pendingRequests: { count: 0, requests: [] },
    conversations: [],
    unreadMessageCount: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) {
        setDetails(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        setDetails(prev => ({ ...prev, isLoading: true }));
        
        // Fetch all data in parallel
        const [matches, pendingRequests, conversations, unreadCount] = await Promise.all([
          relationshipService.getMatches(),
          relationshipService.getPendingRequests(),
          chatService.getConversations(),
          chatService.getUnreadCount()
        ]);
        
        // Log data for debugging
        logUserData(user, 'User');
        logRelationshipData([...(matches?.matches || []), ...(pendingRequests?.requests || [])]);
        logChatData(conversations || []);
        
        setDetails({
          user,
          matches,
          pendingRequests,
          conversations,
          unreadMessageCount: unreadCount,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setDetails(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Failed to fetch user details')
        }));
        
        toast({
          title: "Error",
          description: "Failed to load user details. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchUserDetails();
  }, [user, toast]);
  
  return details;
};
