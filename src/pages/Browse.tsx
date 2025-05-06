
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";

const Browse = () => {
  // In a real app, these would come from an API
  const initialProfiles = [
    {
      id: 1,
      name: "Sarah",
      age: 28,
      location: "New York, NY",
      bio: "Passionate about art, travel, and good conversations. Looking for someone who enjoys exploring new places and trying new things.",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=1200",
    },
    {
      id: 2,
      name: "Michael",
      age: 32,
      location: "Los Angeles, CA",
      bio: "Software engineer by day, rock climber by weekend. Love dogs, hiking and a good IPA.",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=1200",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState(initialProfiles);

  const handleLike = () => {
    console.log("Liked profile:", profiles[currentIndex]);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePass = () => {
    console.log("Passed profile:", profiles[currentIndex]);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Discover</h1>
        
        <div className="max-w-md mx-auto">
          {currentIndex < profiles.length ? (
            <MatchCard
              name={profiles[currentIndex].name}
              age={profiles[currentIndex].age}
              location={profiles[currentIndex].location}
              bio={profiles[currentIndex].bio}
              photoUrl={profiles[currentIndex].photoUrl}
              onLike={handleLike}
              onPass={handlePass}
            />
          ) : (
            <div className="text-center p-8 border rounded-lg bg-white">
              <h3 className="text-xl font-medium mb-2">No more profiles</h3>
              <p className="text-muted-foreground">
                Check back later for more matches!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
