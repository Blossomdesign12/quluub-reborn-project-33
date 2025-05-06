
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";

const Matches = () => {
  // In a real app, this would come from an API
  const matches = [
    {
      id: "1",
      name: "Fatima",
      age: 28,
      location: "New York, NY",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchDate: "Today",
      tags: ["Doctor", "Practicing", "Arab"]
    },
    {
      id: "2",
      name: "Ahmad",
      age: 30,
      location: "Boston, MA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchDate: "Yesterday",
      tags: ["Engineer", "Very Religious", "Turkish"]
    },
    {
      id: "3",
      name: "Mariam",
      age: 26,
      location: "Chicago, IL",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchDate: "3 days ago",
      tags: ["Teacher", "Hijabi", "Desi"]
    },
    {
      id: "4",
      name: "Tariq",
      age: 29,
      location: "Seattle, WA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchDate: "1 week ago",
      tags: ["Business", "Practicing", "African"]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Your Potential Spouses</h1>
        
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard 
                key={match.id}
                name={match.name}
                age={match.age}
                location={match.location}
                photoUrl={match.photoUrl}
                matchDate={match.matchDate}
                tags={match.tags}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-center text-muted-foreground">
                SubhanAllah, you don't have any matches yet. Start browsing to find your halal match, insha'Allah!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Matches;
