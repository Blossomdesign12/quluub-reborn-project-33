
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileEditForm from "@/components/ProfileEditForm";
import { Card, CardContent } from "@/components/ui/card";
import { userService, relationshipService } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "@/components/ProfileImage";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Determine if showing own profile or someone else's
  const isOwnProfile = !userId || (currentUser?._id === userId);
  const displayUserId = userId || currentUser?._id;
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!displayUserId) return;
      
      try {
        setLoading(true);
        const userData = isOwnProfile
          ? currentUser // Use current user data if viewing own profile
          : await userService.getProfile(displayUserId);
          
        setProfileUser(userData || null);
        console.log("Profile user data:", userData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [displayUserId, isOwnProfile, currentUser, toast]);
  
  // Fetch pending requests if viewing own profile
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!isOwnProfile) return;
      
      try {
        const response = await relationshipService.getPendingRequests();
        console.log("Pending requests:", response);
        if (response && response.requests && response.requests.length > 0) {
          setPendingRequests(response.requests);
          setHasPendingRequests(true);
        }
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      }
    };
    
    if (isOwnProfile) {
      fetchPendingRequests();
    }
  }, [isOwnProfile]);
  
  // Handle accepting or rejecting connection requests
  const handleConnectionResponse = async (relationshipId: string, action: 'matched' | 'rejected') => {
    try {
      await relationshipService.respondToRequest(relationshipId, action);
      
      // Update the pending requests list
      setPendingRequests(prev => prev.filter(
        req => req.relationship.id !== relationshipId
      ));
      
      // Show success toast
      toast({
        title: action === 'matched' ? 'Connection Accepted' : 'Connection Declined',
        description: action === 'matched' 
          ? 'You can now chat with this person' 
          : 'The connection request has been declined',
      });
      
      // If action is matched, navigate to messages
      if (action === 'matched') {
        navigate(`/messages`);
      }
      
      // If no more pending requests, hide notification area
      if (pendingRequests.length <= 1) {
        setHasPendingRequests(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} connection:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action === 'matched' ? 'accept' : 'decline'} connection`,
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdated = () => {
    // Refresh the current user data through the auth context
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-6 flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Profile not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate age from DOB
  const calculateAge = (dob: Date | string | undefined) => {
    if (!dob) return null;
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        {/* Pending Connection Requests Notification */}
        {isOwnProfile && hasPendingRequests && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="text-blue-500" />
                <h3 className="text-lg font-medium">Connection Requests</h3>
                <Badge variant="secondary">{pendingRequests.length}</Badge>
              </div>
              
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                    <div className="flex items-center space-x-3">
                      <ProfileImage
                        src=""
                        alt={`${request.fname} ${request.lname}`}
                        fallback={`${request.fname?.charAt(0)}${request.lname?.charAt(0)}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{request.fname} {request.lname}</p>
                        <p className="text-sm text-muted-foreground">{request.country || "Unknown location"}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleConnectionResponse(request.relationship.id, 'rejected')}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleConnectionResponse(request.relationship.id, 'matched')}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-4">
          <ProfileHeader
            name={`${profileUser.fname} ${profileUser.lname}`}
            age={calculateAge(profileUser.dob) || 0}
            location={profileUser.country || "Location not specified"}
            photoUrl={profileUser.profile_pic || ""}
            isOwnProfile={isOwnProfile}
          />
        </div>
        
        {/* Always show edit form for own profile */}
        <div className="mt-6">
          {isOwnProfile ? (
            <ProfileEditForm 
              user={profileUser} 
              onSaved={handleProfileUpdated} 
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About {profileUser.fname}</h2>
                <p className="mb-4">{profileUser.summary || "No summary provided"}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium mb-2">Details</h3>
                    <div className="space-y-2">
                      {profileUser.nationality && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Nationality:</span>
                          <span className="text-sm">{profileUser.nationality}</span>
                        </div>
                      )}
                      {profileUser.maritalStatus && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Status:</span>
                          <span className="text-sm">{profileUser.maritalStatus}</span>
                        </div>
                      )}
                      {profileUser.patternOfSalaah && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Practice:</span>
                          <span className="text-sm">{profileUser.patternOfSalaah}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="space-y-2">
                      {profileUser.country && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Country:</span>
                          <span className="text-sm">{profileUser.country}</span>
                        </div>
                      )}
                      {profileUser.region && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Region:</span>
                          <span className="text-sm">{profileUser.region}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6" onClick={() => navigate(`/messages?userId=${profileUser._id}`)}>
                  Message
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
