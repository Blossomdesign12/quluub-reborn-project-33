
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";

const Search = () => {
  const [ageRange, setAgeRange] = useState([21, 35]);
  const [location, setLocation] = useState("anywhere");
  
  // Mock search results - in a real app, would be filtered based on criteria
  const searchResults = [
    {
      id: "1",
      name: "Aisha",
      age: 28,
      location: "New York, NY",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 85,
      tags: ["Medical Professional", "Practicing", "Ready for Marriage"]
    },
    {
      id: "2",
      name: "Yusuf",
      age: 30,
      location: "Chicago, IL",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 78,
      tags: ["Engineer", "Practicing", "Family-oriented"]
    },
    {
      id: "3",
      name: "Fatima",
      age: 26,
      location: "Houston, TX",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 92,
      tags: ["Teacher", "Very Religious", "Arabic Speaker"]
    },
    {
      id: "4",
      name: "Ahmad",
      age: 29,
      location: "Seattle, WA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 70,
      tags: ["Business Owner", "Moderate", "Loves Travel"]
    },
    {
      id: "5",
      name: "Zahra",
      age: 31,
      location: "Denver, CO",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 81,
      tags: ["Healthcare", "Hijabi", "Family First"]
    },
    {
      id: "6",
      name: "Omar",
      age: 27,
      location: "Austin, TX",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 88,
      tags: ["Tech Professional", "Practicing", "Arab"]
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
                      defaultValue={[21, 35]} 
                      min={18} 
                      max={60} 
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
                  <label className="text-sm font-medium mb-2 block">Religious Practice</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any level</SelectItem>
                      <SelectItem value="very">Very religious</SelectItem>
                      <SelectItem value="practicing">Practicing</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Ethnicity</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any ethnicity</SelectItem>
                      <SelectItem value="arab">Arab</SelectItem>
                      <SelectItem value="desi">Desi/South Asian</SelectItem>
                      <SelectItem value="african">African</SelectItem>
                      <SelectItem value="turkish">Turkish</SelectItem>
                      <SelectItem value="se_asian">Southeast Asian</SelectItem>
                      <SelectItem value="white">White/Caucasian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Family Plans</label>
                  <div className="flex flex-wrap gap-2">
                    {["Want children", "Open to children", "Has children", "Don't want children"].map((plan) => (
                      <Button 
                        key={plan} 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                      >
                        {plan}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Prayer Habits</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any practice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any practice</SelectItem>
                      <SelectItem value="always">Always prays</SelectItem>
                      <SelectItem value="usually">Usually prays</SelectItem>
                      <SelectItem value="sometimes">Sometimes prays</SelectItem>
                      <SelectItem value="rarely">Rarely prays</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="hijab" className="text-sm font-medium">Hijab</Label>
                    <p className="text-xs text-muted-foreground">Show only sisters who wear hijab</p>
                  </div>
                  <Switch id="hijab" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="beard" className="text-sm font-medium">Beard</Label>
                    <p className="text-xs text-muted-foreground">Show only brothers with beard</p>
                  </div>
                  <Switch id="beard" />
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Search results */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-6">Potential Spouses</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <MatchCard 
                  key={result.id}
                  name={result.name}
                  age={result.age}
                  location={result.location}
                  photoUrl={result.photoUrl}
                  matchPercentage={result.matchPercentage}
                  tags={result.tags}
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
