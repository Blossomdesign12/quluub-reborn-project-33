
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
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [heightRange, setHeightRange] = useState([150, 200]); // In cm
  const [weightRange, setWeightRange] = useState([30, 125]); // In kg
  const [isPro, setIsPro] = useState(false);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discover Your Match</h1>
          
          <div className="flex gap-2">
            <div className="relative w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search for potential spouses..." />
            </div>
          </div>
        </div>
        
        {/* Updated Filter Panel */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-2">
                Set your preferences and we will find her in shaa Allaah
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Nationality (as on passport)" />
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

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Country of residence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any country</SelectItem>
                    <SelectItem value="saudi">Saudi Arabia</SelectItem>
                    <SelectItem value="egypt">Egypt</SelectItem>
                    <SelectItem value="jordan">Jordan</SelectItem>
                    <SelectItem value="pakistan">Pakistan</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="malaysia">Malaysia</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Build" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="slim">Slim</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="curvy">Curvy</SelectItem>
                    <SelectItem value="plus">Plus size</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Genotype" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="aa">AA</SelectItem>
                    <SelectItem value="as">AS</SelectItem>
                    <SelectItem value="ss">SS</SelectItem>
                    <SelectItem value="ac">AC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Facial appearance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="very_attractive">Very attractive</SelectItem>
                    <SelectItem value="attractive">Attractive</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pattern of Salaah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="always">Always prays</SelectItem>
                    <SelectItem value="usually">Usually prays</SelectItem>
                    <SelectItem value="sometimes">Sometimes prays</SelectItem>
                    <SelectItem value="rarely">Rarely prays</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Age range</h3>
                  <Slider 
                    value={ageRange} 
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
                  <h3 className="text-sm font-medium">Height range</h3>
                  <Slider 
                    value={heightRange} 
                    min={120} 
                    max={215} 
                    step={1}
                    onValueChange={(value) => setHeightRange(value as number[])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.floor(heightRange[0]/30.48)}'{Math.round((heightRange[0]/2.54)%12)}"</span>
                    <span>{Math.floor(heightRange[1]/30.48)}'{Math.round((heightRange[1]/2.54)%12)}"</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Weight range</h3>
                  <Slider 
                    value={weightRange} 
                    min={30} 
                    max={125} 
                    step={1}
                    onValueChange={(value) => setWeightRange(value as number[])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{weightRange[0]}kg</span>
                    <span>{weightRange[1]}kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-blue-500 hover:bg-blue-600">Search</Button>
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
