
import { useState } from "react";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const Browse = () => {
  // In a real app, these would come from an API
  const initialProfiles = [
    {
      id: 1,
      name: "Nadia",
      age: 28,
      location: "New York, NY",
      bio: "Assalamualaikum! I'm a medical resident passionate about healthcare and community service. I enjoy reading, hiking, and exploring new cuisines. Looking for someone who values family and faith.",
      photoUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=1200",
      tags: ["Medical Professional", "Practicing", "Family-oriented", "Arab"],
      compatibility: 87
    },
    {
      id: 2,
      name: "Yusuf",
      age: 32,
      location: "Los Angeles, CA",
      bio: "Salam! Software engineer by profession, activist by passion. I love contributing to community projects, outdoor activities, and learning about Islamic history. Seeking someone who shares my values and ambitions.",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=1200",
      tags: ["Tech Professional", "Activist", "Practicing", "South Asian"],
      compatibility: 92
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [showFilters, setShowFilters] = useState(false);
  const [ageRange, setAgeRange] = useState([25, 35]);

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
        {/* Search and filter section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discover</h1>
          
          <div className="flex gap-2">
            <div className="relative w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by name, location..." />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Age Range</h3>
                  <Slider 
                    defaultValue={[25, 35]} 
                    min={18} 
                    max={60} 
                    step={1}
                    onValueChange={(value) => setAgeRange(value as number[])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ageRange[0]}</span>
                    <span>{ageRange[1]}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Ethnicity</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any ethnicity</SelectItem>
                      <SelectItem value="arab">Arab</SelectItem>
                      <SelectItem value="south_asian">South Asian</SelectItem>
                      <SelectItem value="southeast_asian">Southeast Asian</SelectItem>
                      <SelectItem value="african">African</SelectItem>
                      <SelectItem value="white">White/Caucasian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Religious Practice</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any level</SelectItem>
                      <SelectItem value="very_practicing">Very practicing</SelectItem>
                      <SelectItem value="practicing">Practicing</SelectItem>
                      <SelectItem value="moderately">Moderately practicing</SelectItem>
                      <SelectItem value="not_practicing">Not practicing but value Islam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Education</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any education</SelectItem>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Family Plans</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any plans</SelectItem>
                      <SelectItem value="want_children">Want children</SelectItem>
                      <SelectItem value="dont_want">Don't want children</SelectItem>
                      <SelectItem value="have_children">Have and want more</SelectItem>
                      <SelectItem value="have_dont_want">Have and don't want more</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="local-matches" className="text-sm font-medium">Local matches only</Label>
                    <p className="text-xs text-muted-foreground">Show profiles within 50 miles</p>
                  </div>
                  <Switch id="local-matches" />
                </div>
                
                <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="max-w-md mx-auto">
          {currentIndex < profiles.length ? (
            <MatchCard
              name={profiles[currentIndex].name}
              age={profiles[currentIndex].age}
              location={profiles[currentIndex].location}
              bio={profiles[currentIndex].bio}
              photoUrl={profiles[currentIndex].photoUrl}
              tags={profiles[currentIndex].tags}
              compatibility={profiles[currentIndex].compatibility}
              onLike={handleLike}
              onPass={handlePass}
            />
          ) : (
            <div className="text-center p-8 border rounded-lg bg-white">
              <h3 className="text-xl font-medium mb-2">No more profiles</h3>
              <p className="text-muted-foreground">
                We're finding more compatible matches for you. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
