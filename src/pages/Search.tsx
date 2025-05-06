
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";

const Search = () => {
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [location, setLocation] = useState("anywhere");
  
  // Mock search results - in a real app, would be filtered based on criteria
  const searchResults = [
    {
      id: "1",
      name: "Sarah",
      age: 28,
      location: "New York, NY",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 85
    },
    {
      id: "2",
      name: "Alex",
      age: 30,
      location: "Boston, MA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 78
    },
    {
      id: "3",
      name: "Jamie",
      age: 26,
      location: "Chicago, IL",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 92
    },
    {
      id: "4",
      name: "Taylor",
      age: 29,
      location: "Seattle, WA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 70
    },
    {
      id: "5",
      name: "Jordan",
      age: 31,
      location: "Denver, CO",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 81
    },
    {
      id: "6",
      name: "Casey",
      age: 27,
      location: "Austin, TX",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 88
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter sidebar */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Age Range</label>
                  <div className="mb-2">
                    <Slider 
                      defaultValue={[18, 40]} 
                      min={18} 
                      max={80} 
                      step={1}
                      onValueChange={(value) => setAgeRange(value as number[])}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{ageRange[0]}</span>
                    <span>{ageRange[1]}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select defaultValue="anywhere" onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                      <SelectItem value="nearby">Within 25 miles</SelectItem>
                      <SelectItem value="local">Within 50 miles</SelectItem>
                      <SelectItem value="regional">Within 100 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {["Travel", "Music", "Food", "Sports", "Art", "Books"].map((interest) => (
                      <Button 
                        key={interest} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Search results */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-6">Browse Matches</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <MatchCard 
                  key={result.id}
                  name={result.name}
                  age={result.age}
                  location={result.location}
                  photoUrl={result.photoUrl}
                  matchPercentage={result.matchPercentage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
