
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { userService } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
  
  // Extract user interests from various fields
  const extractInterests = (user: User | null) => {
    if (!user) return [];
    
    const interests: string[] = [];
    
    if (user.nationality) interests.push(user.nationality);
    if (user.patternOfSalaah) interests.push(user.patternOfSalaah);
    if (user.maritalStatus) interests.push(user.maritalStatus);
    if (user.ethnicity && typeof user.ethnicity === 'string') {
      try {
        const ethnicities = JSON.parse(user.ethnicity);
        if (Array.isArray(ethnicities)) {
          interests.push(...ethnicities);
        }
      } catch (e) {
        interests.push(user.ethnicity);
      }
    }
    
    return interests.filter(Boolean);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <ProfileHeader
          name={`${profileUser.fname} ${profileUser.lname}`}
          age={calculateAge(profileUser.dob) || 0}
          location={profileUser.country || "Location not specified"}
          photoUrl={profileUser.profile_pic || ""}
          isOwnProfile={isOwnProfile}
        />
        
        <div className="mt-6">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <ProfileInfo
                bio={profileUser.summary || "No summary provided"}
                interests={extractInterests(profileUser)}
                lookingFor={profileUser.maritalStatus || "Not specified"}
                occupation={profileUser.workEducation?.split(',')[0] || undefined}
                education={profileUser.workEducation?.includes('degree') ? profileUser.workEducation : undefined}
              />
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
    </div>
  );
};

export default Profile;
