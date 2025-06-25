import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { relationshipService } from "@/lib/api-client";
import { timeAgo } from "@/utils/dataUtils";
import { User } from "@/types/user";

interface NotificationBellProps {
  onNotificationsRead?: () => void;
}

interface Notification {
  id: string;
  type: 'connection_request' | 'connection_accepted' | 'message';
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  relationshipId?: string;
  user?: User;
}

const NotificationBell = ({ onNotificationsRead }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch notifications (connection requests and acceptances)
  const fetchNotifications = async () => {
    try {
      // Get pending connection requests
      const pendingResponse = await relationshipService.getPendingRequests();
      console.log("Pending requests:", pendingResponse);
      
      if (pendingResponse && pendingResponse.requests) {
        const pendingNotifications: Notification[] = pendingResponse.requests.map((item: any) => ({
          id: item.relationship.id,
          type: 'connection_request',
          message: `${item.fname} ${item.lname} wants to connect with you`,
          timestamp: new Date(item.relationship.createdAt || Date.now()),
          read: false,
          userId: item._id,
          relationshipId: item.relationship.id,
          user: item
        }));
        
        setNotifications(pendingNotifications);
        setUnreadCount(pendingNotifications.length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Mark notifications as read when opened
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      if (onNotificationsRead) {
        onNotificationsRead();
      }
    }
  };

  const handleAccept = async (relationshipId: string, userId: string) => {
    try {
      await relationshipService.respondToRequest(relationshipId, 'accept');
      toast({
        title: "Connection Accepted",
        description: "You can now message each other",
      });
      // Remove this notification
      setNotifications(notifications.filter(n => n.id !== relationshipId));
    } catch (error) {
      console.error("Failed to accept connection:", error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (relationshipId: string) => {
    try {
      await relationshipService.respondToRequest(relationshipId, 'reject');
      toast({
        title: "Connection Declined",
        description: "The request has been declined",
      });
      // Remove this notification
      setNotifications(notifications.filter(n => n.id !== relationshipId));
    } catch (error) {
      console.error("Failed to reject connection:", error);
      toast({
        title: "Error",
        description: "Failed to decline connection request",
        variant: "destructive",
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1rem] h-[1rem] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map(notification => (
              <Card key={notification.id} className="m-2 shadow-none border">
                <CardContent className="p-3">
                  <div className="text-sm mb-1">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {timeAgo(notification.timestamp)}
                  </div>
                  
                  {notification.type === 'connection_request' && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="w-full"
                        onClick={() => handleAccept(notification.relationshipId!, notification.userId!)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleReject(notification.relationshipId!)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
