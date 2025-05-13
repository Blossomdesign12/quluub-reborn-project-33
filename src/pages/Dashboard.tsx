
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/user";
import { DatabaseStats } from "@/components/DatabaseStats";
import { Heart, User as UserIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    matches: 0,
    receivedRequests: 0,
    sentRequests: 0,
    profileViews: 0
  });
  
  // This would normally come from an API
  useEffect(() => {
    // Simulate API call to get stats
    setStats({
      matches: 0,
      receivedRequests: 0,
      sentRequests: 0,
      profileViews: 0
    });
  }, []);

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
              <p className="text-xs text-muted-foreground mt-1">= 0% this week</p>
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
              <Button variant="link" className="text-primary border-b-2 border-primary px-4 pb-2">
                MATCHES (0)
              </Button>
              <Button variant="link" className="text-gray-500 px-4 pb-2">
                RECEIVED REQUESTS (0)
              </Button>
              <Button variant="link" className="text-gray-500 px-4 pb-2">
                SENT REQUESTS (0)
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
