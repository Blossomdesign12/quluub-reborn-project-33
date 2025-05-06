
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProfileEditForm from "@/components/ProfileEditForm";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Edit,
  User,
  Church,
  MapPin,
  Shirt,
  Leaf,
  Star,
  Link2
} from "lucide-react";

const Profile = () => {
  // In a real app, this would come from an API or context
  const [profileData, setProfileData] = useState({
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
    appearance: {
      height: "5'6\"",
      build: "Average",
      hijabStyle: "Traditional",
    },
    lifestyle: {
      smoke: "Never",
      drink: "Never",
      diet: "Halal only",
      exercise: "Regular",
    },
    interests: ["Reading", "Hiking", "Cooking", "Charity Work", "Islamic Studies", "Travel"],
    photos: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400"
    ],
    isOwnProfile: true,
    compatibilityScore: 87
  });

  // Available categories for the profile sidebar
  const categories = [
    { id: "basic", label: "Basic Info", icon: <User className="h-5 w-5" /> },
    { id: "deen", label: "Deen", icon: <Church className="h-5 w-5" /> },
    { id: "location", label: "Location and Ethnicity", icon: <MapPin className="h-5 w-5" /> },
    { id: "appearance", label: "Appearance and Co", icon: <Shirt className="h-5 w-5" /> },
    { id: "lifestyle", label: "Lifestyle and Traits", icon: <Leaf className="h-5 w-5" /> },
    { id: "interests", label: "Interests", icon: <Star className="h-5 w-5" /> },
    { id: "matching", label: "Matching Details", icon: <Link2 className="h-5 w-5" /> }
  ];

  // Active category state
  const [activeCategory, setActiveCategory] = useState("basic");
  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (updatedProfile) => {
    setProfileData(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-7xl py-6">
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
                    <Button 
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
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
        
        {/* Profile edit form */}
        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileEditForm 
                profileData={profileData} 
                onSave={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        ) : (
          // Profile content with sidebar
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow">
              <div className="p-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeCategory === category.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content area */}
            <div className="flex-1">
              {activeCategory === "basic" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{profileData.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Occupation</span>
                        <span className="text-sm text-muted-foreground">{profileData.personal.occupation}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Education</span>
                        <span className="text-sm text-muted-foreground">{profileData.personal.education}</span>
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
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeCategory === "deen" && (
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
              )}
              
              {activeCategory === "location" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location & Ethnicity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Location</span>
                        <span className="text-sm text-muted-foreground">{profileData.location}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Ethnicity</span>
                        <span className="text-sm text-muted-foreground">{profileData.personal.ethnicity}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Languages</span>
                        <span className="text-sm text-muted-foreground">{profileData.personal.languages.join(", ")}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Willing to Relocate</span>
                        <span className="text-sm text-muted-foreground">{profileData.personal.relocate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeCategory === "appearance" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Height</span>
                        <span className="text-sm text-muted-foreground">{profileData.appearance.height}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Build</span>
                        <span className="text-sm text-muted-foreground">{profileData.appearance.build}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Hijab Style</span>
                        <span className="text-sm text-muted-foreground">{profileData.appearance.hijabStyle}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeCategory === "lifestyle" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lifestyle & Traits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Smoking</span>
                        <span className="text-sm text-muted-foreground">{profileData.lifestyle.smoke}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Drinking</span>
                        <span className="text-sm text-muted-foreground">{profileData.lifestyle.drink}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Diet</span>
                        <span className="text-sm text-muted-foreground">{profileData.lifestyle.diet}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Exercise</span>
                        <span className="text-sm text-muted-foreground">{profileData.lifestyle.exercise}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeCategory === "interests" && (
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
              )}
              
              {activeCategory === "matching" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matching Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      This section lets you specify your preferences for finding a compatible match.
                    </p>
                    <div className="bg-primary/5 p-4 rounded-md">
                      <p className="text-sm text-center">
                        Edit your profile to update matching preferences
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
