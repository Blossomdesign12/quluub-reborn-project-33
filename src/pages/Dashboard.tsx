
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/user";
import { DatabaseStats } from "@/components/DatabaseStats";
import { Heart, User as UserIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { relationshipService, chatService } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    matches: 0,
    receivedRequests: 0,
    sentRequests: 0,
    profileViews: 0
  });
  
  // Fetch relationship stats from the backend
  const { data: relationshipData, isLoading, error } = useQuery({
    queryKey: ['relationships'],
    queryFn: async () => {
      try {
        // Fetch matches data
        const matchesData = await relationshipService.getMatches();
        
        // Fetch pending requests
        const pendingData = await relationshipService.getPendingRequests();
        
        // Get unread messages count
        const unreadCount = await chatService.getUnreadCount();
        
        return {
          matches: matchesData?.matches?.length || 0,
          receivedRequests: pendingData?.requests?.length || 0,
          sentRequests: 0, // This would need a separate endpoint if available
          profileViews: 0, // This would need a separate endpoint if available
          unreadMessages: unreadCount || 0
        };
      } catch (err) {
        console.error("Failed to fetch relationship data:", err);
        toast({
          title: "Error",
          description: "Failed to fetch your dashboard data",
          variant: "destructive",
        });
        return {
          matches: 0,
          receivedRequests: 0,
          sentRequests: 0,
          profileViews: 0,
          unreadMessages: 0
        };
      }
    },
    enabled: !!user, // Only run query if user is logged in
  });
  
  // Update stats when data is loaded
  useEffect(() => {
    if (relationshipData) {
      setStats({
        matches: relationshipData.matches,
        receivedRequests: relationshipData.receivedRequests,
        sentRequests: relationshipData.sentRequests,
        profileViews: relationshipData.profileViews
      });
    }
  }, [relationshipData]);

  // Handle resend validation email
  const handleResendEmail = async () => {
    try {
      // This would typically call an API endpoint
      // await authService.resendValidationEmail();
      
      toast({
        title: "Email sent",
        description: "Please check your inbox for the validation email",
      });
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container py-6">
        {/* Email validation banner - only show if user's email is not validated */}
        {user && !user.emailVerified && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertDescription className="flex items-center gap-2">
              <span className="bg-yellow-400 text-white p-1 rounded-full">!</span>
              Please validate your email address to continue
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleResendEmail}
              >
                Resend validation mail
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Matches */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Matches</h3>
                <Heart className="h-5 w-5 text-teal-500" />
              </div>
              <p className="text-2xl font-bold">{stats.matches}</p>
              <p className="text-xs text-muted-foreground mt-1">= 0% this week</p>
            </CardContent>
          </Card>
          
          {/* Received Requests */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Received Requests</h3>
                <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2"></rect>
                  <path d="M9 12h6m-3-3v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <p className="text-2xl font-bold">{stats.receivedRequests}</p>
              <Link to="/alerts" className="text-xs text-blue-500 hover:underline">View requests</Link>
            </CardContent>
          </Card>
          
          {/* Sent Requests */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Sent Requests</h3>
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M19 12l-4-4m0 8l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <p className="text-2xl font-bold">{stats.sentRequests}</p>
              <p className="text-xs text-muted-foreground mt-1">= 0% this week</p>
            </CardContent>
          </Card>
          
          {/* Profile Views */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Profile Views</h3>
                <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M2 12s3-9 10-9 10 9 10 9-3 9-10 9-10-9-10-9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <p className="text-2xl font-bold">{stats.profileViews}</p>
              <p className="text-xs text-muted-foreground mt-1">= 0% this week</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Advertisement Section */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Advert</h3>
              <span className="text-xs text-muted-foreground">This is sponsored</span>
            </div>
            <div className="py-8 text-center text-muted-foreground">
              Sponsored post placeholder
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs Section */}
        <div className="mt-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <Button 
                variant="link" 
                className="text-primary border-b-2 border-primary px-4 pb-2"
                onClick={() => {}}
              >
                MATCHES ({stats.matches})
              </Button>
              <Button 
                variant="link" 
                className="text-gray-500 px-4 pb-2"
                onClick={() => {}}
              >
                RECEIVED REQUESTS ({stats.receivedRequests})
              </Button>
              <Button 
                variant="link" 
                className="text-gray-500 px-4 pb-2"
                onClick={() => {}}
              >
                SENT REQUESTS ({stats.sentRequests})
              </Button>
            </div>
          </div>
          
          {/* Matches Tab Content */}
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-lg text-muted-foreground">No matches yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/browse'}
            >
              Browse potential matches
            </Button>
          </div>
        </div>
        
        {/* Feed Section */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Feed</h3>
            <Button variant="link" className="text-primary p-0">
              SEE ALL
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Recent information you may find useful
          </div>
          
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-lg text-muted-foreground">Nothing here yet</p>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Dashboard;
