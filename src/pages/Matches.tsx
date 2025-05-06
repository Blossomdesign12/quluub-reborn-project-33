
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";

const Matches = () => {
  // In a real app, this would come from an API
  const matches = [
    {
      id: "1",
      name: "Sarah",
      age: 28,
      location: "New York, NY",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchDate: "Today"
    },
    {
      id: "2",
      name: "Alex",
      age: 30,
      location: "Boston, MA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchDate: "Yesterday"
    },
    {
      id: "3",
      name: "Jamie",
      age: 26,
      location: "Chicago, IL",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchDate: "3 days ago"
    },
    {
      id: "4",
      name: "Taylor",
      age: 29,
      location: "Seattle, WA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchDate: "1 week ago"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
        
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
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-center text-muted-foreground">
                You don't have any matches yet. Start browsing to find your perfect match!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Matches;
