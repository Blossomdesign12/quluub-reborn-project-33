
import { useState, useEffect } from "react";
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
import { useBrowseUsers } from "@/hooks/useBrowseUsers";
import { relationshipService } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";

const Search = () => {
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [heightRange, setHeightRange] = useState([150, 200]); // In cm
  const [weightRange, setWeightRange] = useState([30, 125]); // In kg
  const [location, setLocation] = useState("anywhere");
  const [nationality, setNationality] = useState("any");
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [showHijabOnly, setShowHijabOnly] = useState(false);
  const [showBeardOnly, setShowBeardOnly] = useState(false);
  
  const { toast } = useToast();
  
  // Filter params for API
  const [filterParams, setFilterParams] = useState<{
    country?: string;
    nationality?: string;
  }>({});
  
  // Use the hook to fetch users
  const { users, isLoading, error } = useBrowseUsers(filterParams);
  
  // State to track which users have pending connection requests
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  
  // Calculate age from DOB
  const calculateAge = (dob: string | Date | undefined) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Extract tags/interests for display
  const extractTags = (user: User) => {
    const tags: string[] = [];
    
    if (user.workEducation) {
      const workParts = user.workEducation.split(' ');
      if (workParts.length > 0) tags.push(workParts[0]);
    }
    
    if (user.patternOfSalaah) tags.push(user.patternOfSalaah === 'always' ? 'Practicing' : 'Moderate');
    
    if (user.maritalStatus) tags.push(user.maritalStatus);
    
    if (user.traits) {
      try {
        const traitsArray = JSON.parse(user.traits);
        if (Array.isArray(traitsArray) && traitsArray.length > 0) {
          tags.push(traitsArray[0]);
        }
      } catch (e) {
        // If parsing fails, just use the string
        if (typeof user.traits === 'string') tags.push(user.traits);
      }
    }
    
    return tags.slice(0, 3); // Return up to 3 tags
  };
  
  const handleApplyFilters = () => {
    setIsApplyingFilters(true);
    
    const params: { country?: string; nationality?: string } = {};
    
    // Add country filter if selected
    if (location !== "anywhere") {
      // Convert location selection to country name
      // This would need a proper mapping in a real app
      params.country = location === "anywhere" ? undefined : location;
    }
    
    // Add nationality filter if selected
    if (nationality !== "any") {
      params.nationality = nationality;
    }
    
    setFilterParams(params);
    setIsApplyingFilters(false);
  };
  
  const handleSendInterest = async (userId: string) => {
    try {
      await relationshipService.sendRequest(userId);
      setPendingConnections(prev => [...prev, userId]);
      toast({
        title: "Interest Sent",
        description: "Your interest has been sent successfully.",
      });
    } catch (error) {
      console.error("Failed to send interest:", error);
      toast({
        title: "Error",
        description: "Failed to send interest. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePass = (userId: string) => {
    // In a real app, you might want to track passed users
    toast({
      title: "Passed",
      description: "You've passed on this profile.",
    });
  };

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
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Nationality</label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any nationality</SelectItem>
                      <SelectItem value="Nigerian">Nigerian</SelectItem>
                      <SelectItem value="Ghanaian">Ghanaian</SelectItem>
                      <SelectItem value="Saudi">Saudi</SelectItem>
                      <SelectItem value="Egyptian">Egyptian</SelectItem>
                      <SelectItem value="Jordanian">Jordanian</SelectItem>
                      <SelectItem value="Pakistani">Pakistani</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Malaysian">Malaysian</SelectItem>
                      <SelectItem value="Indonesian">Indonesian</SelectItem>
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
                      <SelectItem value="married">Married</SelectItem>
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
                  <Switch 
                    id="hijab" 
                    checked={showHijabOnly} 
                    onCheckedChange={setShowHijabOnly}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="beard" className="text-sm font-medium">Beard</Label>
                    <p className="text-xs text-muted-foreground">Show only brothers with beard</p>
                  </div>
                  <Switch 
                    id="beard" 
                    checked={showBeardOnly} 
                    onCheckedChange={setShowBeardOnly}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleApplyFilters}
                  disabled={isApplyingFilters}
                >
                  {isApplyingFilters ? 'Applying...' : 'Apply Filters'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Search results */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-6">Potential Spouses</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-red-500">Error loading users. Please try again.</p>
                </CardContent>
              </Card>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => {
                  const age = calculateAge(user.dob) || 0;
                  
                  // Apply client-side filtering based on age
                  if (age < ageRange[0] || age > ageRange[1]) {
                    return null;
                  }
                  
                  // Skip based on hijab/beard preferences if set
                  // This would need real data fields in the user object
                  
                  return (
                    <MatchCard 
                      key={user._id}
                      name={`${user.fname} ${user.lname}`}
                      age={age}
                      location={user.country || "Location not specified"}
                      photoUrl={user.profile_pic || ""}
                      matchPercentage={Math.floor(Math.random() * 30) + 70} // Placeholder for now
                      tags={extractTags(user)}
                      onLike={() => handleSendInterest(user._id!)}
                      onPass={() => handlePass(user._id!)}
                    />
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">No users match your current filters. Try adjusting your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
