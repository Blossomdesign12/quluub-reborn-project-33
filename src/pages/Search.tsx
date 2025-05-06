
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
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [heightRange, setHeightRange] = useState([150, 200]); // In cm
  const [weightRange, setWeightRange] = useState([30, 125]); // In kg
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
      tags: ["Medical Professional", "Practicing", "Ready for Marriage"],
      connectionSent: false,
      connectionAccepted: false
    },
    {
      id: "2",
      name: "Yusuf",
      age: 30,
      location: "Chicago, IL",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 78,
      tags: ["Engineer", "Practicing", "Family-oriented"],
      connectionSent: true,
      connectionAccepted: true
    },
    {
      id: "3",
      name: "Fatima",
      age: 26,
      location: "Houston, TX",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 92,
      tags: ["Teacher", "Very Religious", "Arabic Speaker"],
      connectionSent: true,
      connectionAccepted: false
    },
    {
      id: "4",
      name: "Ahmad",
      age: 29,
      location: "Seattle, WA",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 70,
      tags: ["Business Owner", "Moderate", "Loves Travel"],
      connectionSent: false,
      connectionAccepted: false
    },
    {
      id: "5",
      name: "Zahra",
      age: 31,
      location: "Denver, CO",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 81,
      tags: ["Healthcare", "Hijabi", "Family First"],
      connectionSent: false,
      connectionAccepted: false
    },
    {
      id: "6",
      name: "Omar",
      age: 27,
      location: "Austin, TX",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400",
      matchPercentage: 88,
      tags: ["Tech Professional", "Practicing", "Arab"],
      connectionSent: false,
      connectionAccepted: false
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
                      value={ageRange}
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
                  <label className="text-sm font-medium mb-2 block">Height range</label>
                  <div className="mb-2">
                    <Slider 
                      value={heightRange} 
                      min={120} 
                      max={215} 
                      step={1}
                      onValueChange={(value) => setHeightRange(value as number[])}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.floor(heightRange[0]/30.48)}'{Math.round((heightRange[0]/2.54)%12)}"</span>
                    <span>{Math.floor(heightRange[1]/30.48)}'{Math.round((heightRange[1]/2.54)%12)}"</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Weight range</label>
                  <div className="mb-2">
                    <Slider 
                      value={weightRange} 
                      min={30} 
                      max={125} 
                      step={1}
                      onValueChange={(value) => setWeightRange(value as number[])}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{weightRange[0]}kg</span>
                    <span>{weightRange[1]}kg</span>
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
                  <label className="text-sm font-medium mb-2 block">Nationality</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any nationality</SelectItem>
                      <SelectItem value="saudi">Saudi</SelectItem>
                      <SelectItem value="egyptian">Egyptian</SelectItem>
                      <SelectItem value="jordanian">Jordanian</SelectItem>
                      <SelectItem value="pakistani">Pakistani</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="malaysian">Malaysian</SelectItem>
                      <SelectItem value="indonesian">Indonesian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Marital Status</label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any status</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Pattern of Salaah</label>
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
