
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Edit } from "lucide-react";

const Profile = () => {
  // In a real app, this would come from an API or context
  const profileData = {
    name: "Aisha",
    age: 28,
    location: "New York, NY",
    photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
    bio: "Assalamualaikum! Medical resident passionate about healthcare and community service. I enjoy reading, hiking, and exploring new cuisines in my free time. Looking for someone who values family and faith.",
    faith: {
      practice: "Practicing",
      prayFiveTimes: true,
      hijab: "Always",
      sect: "Sunni",
      converted: false,
      important: "Very important"
    },
    personal: {
      ethnicity: "Arab",
      languages: ["English", "Arabic"],
      maritalStatus: "Never Married",
      hasChildren: false,
      wantsChildren: "Yes",
      education: "Doctorate",
      occupation: "Medical Doctor",
      relocate: "Yes, within my country"
    },
    interests: ["Reading", "Hiking", "Cooking", "Charity Work", "Islamic Studies", "Travel"],
    photos: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400"
    ],
    isOwnProfile: false,
    compatibilityScore: 87
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-4xl py-6">
        {/* Profile header */}
        <Card className="border-0 shadow-none mb-6">
          <CardContent className="p-0">
            <div className="relative">
              <div className="h-40 md:h-60 w-full bg-gradient-to-b from-primary/20 to-primary/5 rounded-t-xl"></div>
              <div className="absolute bottom-0 left-10 md:left-16 transform translate-y-1/2">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white">
                  <AvatarImage src={profileData.photoUrl} alt={profileData.name} />
                  <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              {!profileData.isOwnProfile && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-primary/80 hover:bg-primary text-white px-3 py-1.5">
                    {profileData.compatibilityScore}% Compatible
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="mt-16 md:mt-20 px-8 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.name}, {profileData.age}</h1>
                  <p className="text-muted-foreground">{profileData.location}</p>
                </div>
                
                <div className="flex mt-4 md:mt-0 space-x-2">
                  {profileData.isOwnProfile ? (
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="default" className="rounded-full px-6">
                        <Heart className="h-5 w-5 mr-2" />
                        <span>Like</span>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Share className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="faith">Faith</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          {/* About tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profileData.bio}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="text-sm"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {!profileData.isOwnProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Faith values</span>
                    <Badge variant="outline" className="text-primary">95% match</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Life goals</span>
                    <Badge variant="outline" className="text-primary">85% match</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interests</span>
                    <Badge variant="outline" className="text-primary">80% match</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall compatibility</span>
                    <Badge className="bg-primary text-white">{profileData.compatibilityScore}%</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Faith tab */}
          <TabsContent value="faith" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Faith & Religious Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Religious Practice</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.practice}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pray Five Times</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.prayFiveTimes ? "Yes" : "No"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Wear Hijab</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.hijab}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Religious Sect</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.sect}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Converted to Islam</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.converted ? "Yes" : "No"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Faith is</span>
                    <span className="text-sm text-muted-foreground">{profileData.faith.important}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Personal tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ethnicity</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.ethnicity}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Languages</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.languages.join(", ")}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Marital Status</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.maritalStatus}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Has Children</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.hasChildren ? "Yes" : "No"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Wants Children</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.wantsChildren}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Education</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.education}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Occupation</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.occupation}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Willing to Relocate</span>
                    <span className="text-sm text-muted-foreground">{profileData.personal.relocate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Photos tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileData.photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-md overflow-hidden"
                    >
                      <img 
                        src={photo} 
                        alt={`${profileData.name}'s photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {profileData.isOwnProfile && profileData.photos.length < 6 && (
                    <div 
                      className="aspect-square rounded-md border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <span className="text-2xl text-muted-foreground">+</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
