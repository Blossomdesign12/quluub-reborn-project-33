
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import { useToast } from "@/hooks/use-toast";

const Alerts = () => {
  const [showConnectionRequests, setShowConnectionRequests] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const { toast } = useToast();

  // In a real app, these would come from an API
  const connectionRequests = [];

  const notifications = [
    {
      id: "1",
      type: "match",
      title: "New Match!",
      description: "You and Sarah matched. Say hello!",
      time: "Just now",
      read: false
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      description: "Alex sent you a message: 'Hi there! How are you doing today?'",
      time: "2 hours ago",
      read: false
    },
    {
      id: "3",
      type: "like",
      title: "Profile Like",
      description: "Jamie liked your profile.",
      time: "Yesterday",
      read: true
    },
    {
      id: "4",
      type: "view",
      title: "Profile View",
      description: "Taylor viewed your profile.",
      time: "2 days ago",
      read: true
    }
  ];

  const handleAcceptRequest = (id: string) => {
    toast({
      title: "Request Accepted",
      description: "Connection request has been accepted.",
    });
  };

  const handleDeclineRequest = (id: string) => {
    toast({
      title: "Request Declined",
      description: "Connection request has been declined.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container py-6">
        {/* Email validation banner */}
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertDescription className="flex items-center gap-2">
            <span className="bg-yellow-400 text-white p-1 rounded-full">!</span>
            Please validate your email address to continue
            <Button variant="outline" size="sm" className="ml-auto bg-blue-600 text-white hover:bg-blue-700">
              Resend validation mail
            </Button>
          </AlertDescription>
        </Alert>
        
        {/* Connection Requests Section */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => setShowConnectionRequests(!showConnectionRequests)}
          >
            <h2 className="text-xl font-bold">Connection requests</h2>
            {showConnectionRequests ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {showConnectionRequests && (
            <div className="space-y-4">
              {connectionRequests.length > 0 ? (
                connectionRequests.map(request => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ProfileImage
                            src=""
                            alt="User"
                            fallback="U"
                            size="md"
                          />
                          <div>
                            <h3 className="font-medium">User Name</h3>
                            <p className="text-sm text-muted-foreground">Location</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            Decline
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-lg text-center text-muted-foreground">
                      No requests yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        {/* Recent Notifications Section */}
        <div>
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <h2 className="text-xl font-bold">Recent notifications</h2>
            {showNotifications ? <ChevronUp /> : <ChevronDown />}
          </div>
          
          {showNotifications && (
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Alert 
                    key={notification.id}
                    variant={notification.read ? "default" : "default"}
                    className={notification.read ? "bg-background" : "bg-primary/5 border-primary/20"}
                  >
                    <div className="flex justify-between">
                      <div>
                        <AlertTitle className="font-semibold">{notification.title}</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                          {notification.description}
                        </AlertDescription>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {notification.time}
                      </div>
                    </div>
                  </Alert>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-lg text-center text-muted-foreground">
                      Nothing here yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Alerts;
