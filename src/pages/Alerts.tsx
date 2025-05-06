
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Alerts = () => {
  // In a real app, these would come from an API
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
    },
    {
      id: "5",
      type: "system",
      title: "Account Update",
      description: "Your profile has been successfully updated.",
      time: "1 week ago",
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button variant="ghost" size="sm">Mark all as read</Button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
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
          ))}
        </div>
        
        {notifications.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-center text-muted-foreground">
                You don't have any notifications yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Alerts;
