
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileInfo from "@/components/ProfileInfo";
import ProfilePhotos from "@/components/ProfilePhotos";

const Profile = () => {
  // In a real app, this would come from an API or context
  const profileData = {
    name: "Sarah",
    age: 28,
    location: "New York, NY",
    photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
    bio: "Passionate about art, travel, and good conversations. Looking for someone who enjoys exploring new places and trying new things. Big fan of indie music and film festivals.",
    interests: ["Travel", "Art", "Photography", "Cooking", "Hiking", "Music"],
    lookingFor: "Relationship",
    occupation: "UX Designer",
    education: "Master's in Design",
    photos: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400"
    ],
    isOwnProfile: false
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container max-w-3xl py-6">
        <div className="space-y-6">
          <ProfileHeader
            name={profileData.name}
            age={profileData.age}
            location={profileData.location}
            photoUrl={profileData.photoUrl}
            isOwnProfile={profileData.isOwnProfile}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProfileInfo
                bio={profileData.bio}
                interests={profileData.interests}
                lookingFor={profileData.lookingFor}
                occupation={profileData.occupation}
                education={profileData.education}
              />
            </div>
            <div>
              <ProfilePhotos
                photos={profileData.photos}
                editable={profileData.isOwnProfile}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
