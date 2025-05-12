
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, Calendar, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService, relationshipService, chatService } from "@/lib/api-client";
import { User } from "@/types/user";
import { DatabaseStats } from "@/components/DatabaseStats";
import { UserDemographics } from "@/components/UserDemographics";
import { UserProfileCard } from "@/components/UserProfileCard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for the dashboard
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const fetchedUsers = await userService.getBrowseUsers({ limit: 20 });
        setUsers(fetchedUsers || []);
        
        // Fetch matches
        const matchesData = await relationshipService.getMatches();
        setMatches(matchesData || []);
        
        // Fetch unread messages count
        const unreadData = await chatService.getUnreadCount();
        setUnreadCount(unreadData || 0);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get active users (seen in last 30 days)
  const activeUsers = users.filter(user => {
    if (!user.lastSeen) return false;
    const lastActive = new Date(user.lastSeen);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActive > thirtyDaysAgo;
  });

  // Get recent users (joined in last 7 days)
  const recentUsers = users.filter(user => {
    if (!user.createdAt) return false;
    const joinDate = new Date(user.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return joinDate > sevenDaysAgo;
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <DatabaseStats 
              totalUsers={users.length} 
              activeUsers={activeUsers.length}
              totalMatches={matches.length}
              unreadMessages={unreadCount}
            />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-6">
              <Button 
                variant="default" 
                className="h-20 space-x-2"
                onClick={() => navigate('/browse')}
              >
                <UserPlus className="h-5 w-5" />
                <span>Browse</span>
              </Button>
              
              <Button 
                variant="default" 
                className="h-20 space-x-2"
                onClick={() => navigate('/messages')}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Messages</span>
              </Button>
              
              <Button 
                variant="default" 
                className="h-20 space-x-2"
                onClick={() => navigate('/matches')}
              >
                <Heart className="h-5 w-5" />
                <span>Matches</span>
              </Button>
              
              <Button 
                variant="default" 
                className="h-20 space-x-2"
                onClick={() => navigate('/profile')}
              >
                <Users className="h-5 w-5" />
                <span>Profile</span>
              </Button>
            </div>
            
            {/* Demographics Charts */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">User Demographics</h2>
              <UserDemographics users={users} />
            </div>
            
            {/* Recent Users */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Recent Profiles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentUsers.length > 0 ? (
                  recentUsers.map(user => (
                    <UserProfileCard
                      key={user._id || user.id}
                      user={user}
                      onView={(id) => navigate(`/profile?id=${id}`)}
                      onLike={(id) => navigate(`/browse`)}
                      onMessage={(id) => navigate(`/messages?userId=${id}`)}
                    />
                  ))
                ) : (
                  <Card className="col-span-4">
                    <CardContent className="py-6 text-center">
                      <p className="text-muted-foreground">No recent users</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
