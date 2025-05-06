
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Video, Phone } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
      compatibility: 87,
      connectionSent: false,
      connectionAccepted: false
    },
    {
      id: 2,
      name: "Yusuf",
      age: 32,
      location: "Los Angeles, CA",
      bio: "Salam! Software engineer by profession, activist by passion. I love contributing to community projects, outdoor activities, and learning about Islamic history. Seeking someone who shares my values and ambitions.",
      photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=1200",
      tags: ["Tech Professional", "Activist", "Practicing", "South Asian"],
      compatibility: 92,
      connectionSent: false,
      connectionAccepted: false
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [isPro, setIsPro] = useState(false); // In real app, would come from user subscription info
  const [showVideoCall, setShowVideoCall] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    const updatedProfiles = [...profiles];
    updatedProfiles[currentIndex].connectionSent = true;
    setProfiles(updatedProfiles);
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${profiles[currentIndex].name}.`,
    });
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePass = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // For demo purposes, simulate a connection acceptance
  const handleAcceptConnection = () => {
    const updatedProfiles = [...profiles];
    updatedProfiles[currentIndex].connectionAccepted = true;
    setProfiles(updatedProfiles);
    toast({
      title: "Connection Accepted",
      description: `${profiles[currentIndex].name} accepted your connection request. You can now message them!`,
    });
  };

  const handleStartVideoCall = () => {
    if (!isPro) {
      toast({
        title: "Pro Subscription Required",
        description: "Video calls are only available for Pro users. Please upgrade your subscription.",
        variant: "destructive"
      });
      return;
    }
    setShowVideoCall(true);
    toast({
      title: "Video Call Started",
      description: `Starting video call with ${profiles[currentIndex].name}.`,
    });
  };

  const handleEndVideoCall = () => {
    setShowVideoCall(false);
    toast({
      title: "Video Call Ended",
      description: `Your call with ${profiles[currentIndex].name} has ended.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-6">
        {/* Search and filter section - always visible now */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discover Your Match</h1>
          
          <div className="flex gap-2">
            <div className="relative w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search for potential spouses..." />
            </div>
          </div>
        </div>
        
        {/* Filters panel - always visible now */}
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
                    <SelectItem value="desi">Desi/South Asian</SelectItem>
                    <SelectItem value="african">African</SelectItem>
                    <SelectItem value="turkish">Turkish</SelectItem>
                    <SelectItem value="se_asian">Southeast Asian</SelectItem>
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
                    <SelectItem value="very">Very religious</SelectItem>
                    <SelectItem value="practicing">Practicing</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
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
                    <SelectItem value="islamic">Islamic Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Marriage Timeframe</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any timeframe</SelectItem>
                    <SelectItem value="ready">Ready now</SelectItem>
                    <SelectItem value="soon">Within 6 months</SelectItem>
                    <SelectItem value="year">Within a year</SelectItem>
                    <SelectItem value="future">In the future</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Prayer Habits</h3>
                <Select>
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
                  <Label htmlFor="local-matches" className="text-sm font-medium">Local matches only</Label>
                  <p className="text-xs text-muted-foreground">Show profiles within 50 miles</p>
                </div>
                <Switch id="local-matches" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="photos-only" className="text-sm font-medium">With photos only</Label>
                  <p className="text-xs text-muted-foreground">Only show profiles with photos</p>
                </div>
                <Switch id="photos-only" defaultChecked />
              </div>
              
              <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center">
          <div className="max-w-md mx-auto">
            {currentIndex < profiles.length ? (
              <div className="relative">
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

                {/* Pro/connection features */}
                <div className="mt-4 flex gap-2 justify-center">
                  {!profiles[currentIndex].connectionSent && (
                    <Button onClick={handleLike} className="bg-green-500 hover:bg-green-600">
                      Send Connection Request
                    </Button>
                  )}

                  {profiles[currentIndex].connectionSent && !profiles[currentIndex].connectionAccepted && (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-muted-foreground">Connection request sent</p>
                      {/* For demo purposes, add a button to simulate acceptance */}
                      <Button variant="outline" onClick={handleAcceptConnection}>
                        Simulate Request Acceptance
                      </Button>
                    </div>
                  )}

                  {profiles[currentIndex].connectionAccepted && (
                    <div className="flex gap-2">
                      <Button>
                        Message
                      </Button>
                      <Button 
                        onClick={handleStartVideoCall} 
                        className={`${isPro ? 'bg-primary' : 'bg-gray-400'} flex gap-1 items-center`}
                      >
                        <Video className="h-4 w-4" />
                        Video Call {!isPro && "(Pro Only)"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Toggle Pro User for demo purposes */}
                <div className="mt-6 flex items-center justify-center gap-2 border-t pt-4">
                  <Label htmlFor="pro-user" className="text-sm font-medium">
                    {isPro ? "Pro User" : "Regular User"}
                  </Label>
                  <Switch 
                    id="pro-user" 
                    checked={isPro}
                    onCheckedChange={setIsPro}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-white">
                <h3 className="text-xl font-medium mb-2">SubhanAllah! No more profiles</h3>
                <p className="text-muted-foreground">
                  We're finding more compatible matches for your halal journey. Check back soon, insha'Allah!
                </p>
              </div>
            )}
          </div>

          {/* Video call modal */}
          {showVideoCall && (
            <Sheet open={showVideoCall} onOpenChange={setShowVideoCall}>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="h-full flex flex-col">
                  <div className="flex-1 bg-black rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-white flex flex-col items-center">
                      <Video className="h-20 w-20 mb-2" />
                      <p className="text-xl">Video Call with {profiles[currentIndex].name}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-red-500 hover:bg-red-600 rounded-full"
                      onClick={handleEndVideoCall}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
