
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavbar from "@/components/TopNavbar";
import Navbar from "@/components/Navbar";
import ProfileEditSections from "@/components/ProfileEditSections";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Bell } from "lucide-react";
import { userService, relationshipService } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import ProfileImage from "@/components/ProfileImage";
import { parseJsonField } from "@/utils/dataUtils";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isOwnProfile = !userId || (currentUser?._id === userId);
  const displayUserId = userId || currentUser?._id;
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!displayUserId) return;
      
      try {
        setLoading(true);
        const userData = isOwnProfile
          ? currentUser
          : await userService.getProfile(displayUserId);
          
        setProfileUser(userData || null);
        setEditData(userData || {});
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
  
  const handleConnectionResponse = async (relationshipId: string, action: 'matched' | 'rejected') => {
    try {
      await relationshipService.respondToRequest(relationshipId, action);
      
      setPendingRequests(prev => prev.filter(
        req => req.relationship.id !== relationshipId
      ));
      
      toast({
        title: action === 'matched' ? 'Connection Accepted' : 'Connection Declined',
        description: action === 'matched' 
          ? 'You can now chat with this person' 
          : 'The connection request has been declined',
      });
      
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

  const handleProfileSave = async () => {
    if (!profileUser?._id) return;
    
    try {
      await userService.updateProfile(profileUser._id, editData);
      setProfileUser(prev => prev ? { ...prev, ...editData } : null);
      setIsEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TopNavbar />
        <div className="container py-6 flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TopNavbar />
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

  if (isOwnProfile && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <TopNavbar />
        <div className="container py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProfileSave}>
                    Save Changes
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      value={editData.fname || ''}
                      onChange={(e) => handleInputChange('fname', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      value={editData.lname || ''}
                      onChange={(e) => handleInputChange('lname', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="kunya">Nickname/Kunya</Label>
                    <Input
                      id="kunya"
                      value={editData.kunya || ''}
                      onChange={(e) => handleInputChange('kunya', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={editData.nationality || ''}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={editData.summary || ''}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      rows={4}
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <TopNavbar />
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
            age={profileUser.dob ? new Date().getFullYear() - new Date(profileUser.dob).getFullYear() : 0}
            location={profileUser.country || "Location not specified"}
            photoUrl={profileUser.profile_pic || ""}
            isOwnProfile={isOwnProfile}
          />
          
          {isOwnProfile && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsEditMode(true)}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <ProfileInfo
                user={profileUser}
                isCurrentUser={isOwnProfile}
                onEditClick={() => setIsEditMode(true)}
                bio={profileUser.summary || "No summary provided"}
                interests={[]}
                lookingFor={profileUser.maritalStatus || "Not specified"}
                occupation={profileUser.workEducation?.split(',')[0] || undefined}
                education={profileUser.workEducation?.includes('degree') ? profileUser.workEducation : undefined}
              />
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {profileUser.kunya && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Nickname/Kunya:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.kunya}</span>
                        </div>
                      )}
                      {profileUser.maritalStatus && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Marital Status:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.maritalStatus}</span>
                        </div>
                      )}
                      {profileUser.noOfChildren && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Children:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.noOfChildren}</span>
                        </div>
                      )}
                      {profileUser.nationality && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Nationality:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.nationality}</span>
                        </div>
                      )}
                      {profileUser.region && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Region:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.region}</span>
                        </div>
                      )}
                      {profileUser.ethnicity && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Ethnicity:</span>
                          <span className="text-sm text-muted-foreground">
                            {Array.isArray(parseJsonField(profileUser.ethnicity)) 
                              ? parseJsonField(profileUser.ethnicity).join(", ") 
                              : profileUser.ethnicity}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Religious Practice</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {profileUser.patternOfSalaah && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Pattern of Salaah:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.patternOfSalaah}</span>
                        </div>
                      )}
                      {profileUser.revert && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Revert:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.revert}</span>
                        </div>
                      )}
                      {profileUser.scholarsSpeakers && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Scholars & Speakers:</span>
                          <span className="text-sm text-muted-foreground">{profileUser.scholarsSpeakers}</span>
                        </div>
                      )}
                      {profileUser.traits && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Traits:</span>
                          <span className="text-sm text-muted-foreground">
                            {Array.isArray(parseJsonField(profileUser.traits)) 
                              ? parseJsonField(profileUser.traits).join(", ") 
                              : profileUser.traits}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="photos">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No photos available</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;
