
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, ChevronUp, ChevronDown } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import { userService, relationshipService } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";

const Browse = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [expandDetails, setExpandDetails] = useState(false);
  const { toast } = useToast();

  // Get current user
  const currentUser = users[currentIndex];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getBrowseUsers();
        console.log("Browse users:", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch browse users:", error);
        toast({
          title: "Error",
          description: "Failed to load potential matches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleLike = async () => {
    if (!currentUser || processingAction) return;
    
    try {
      setProcessingAction(true);
      await relationshipService.sendRequest(currentUser._id!);
      toast({
        title: "Success",
        description: "You have expressed interest in this person",
      });
      
      // Move to next user
      goToNextUser();
    } catch (error) {
      console.error("Failed to send like:", error);
      const errorMessage = (error as any)?.response?.data?.message || "Failed to express interest";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleSkip = () => {
    if (processingAction) return;
    goToNextUser();
  };

  const goToNextUser = () => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more users to browse
      toast({
        title: "No more profiles",
        description: "You've seen all available profiles",
      });
    }
    setExpandDetails(false);
  };

  // Calculate age from DOB
  const calculateAge = (dob: Date | string | undefined) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Find Your Match</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="max-w-xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  <ProfileImage
                    src=""
                    fallback={(currentUser?.fname?.charAt(0) || "") + (currentUser?.lname?.charAt(0) || "")}
                    size="xl"
                    className="h-32 w-32 text-3xl"
                  />
                </div>
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-bold">
                    {currentUser?.fname} {currentUser?.lname}, {calculateAge(currentUser?.dob)}
                  </h3>
                  <p>{currentUser?.country || "Location not specified"}</p>
                </div>
              </div>
              
              <CardContent className={`p-4 transition-all duration-300 ${expandDetails ? 'max-h-96 overflow-y-auto' : 'max-h-40 overflow-hidden'}`}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">About Me</h4>
                    <p className="text-sm text-muted-foreground">{currentUser?.summary || "No summary provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Basics</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Marital Status:</span> {currentUser?.maritalStatus || "Not specified"}
                      </div>
                      {currentUser?.noOfChildren && (
                        <div>
                          <span className="text-muted-foreground">Children:</span> {currentUser.noOfChildren}
                        </div>
                      )}
                      {currentUser?.nationality && (
                        <div>
                          <span className="text-muted-foreground">Nationality:</span> {currentUser.nationality}
                        </div>
                      )}
                      {currentUser?.ethnicity && (
                        <div>
                          <span className="text-muted-foreground">Ethnicity:</span> {currentUser.ethnicity}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentUser?.workEducation && (
                    <div>
                      <h4 className="font-medium">Work & Education</h4>
                      <p className="text-sm text-muted-foreground">{currentUser.workEducation}</p>
                    </div>
                  )}
                  
                  {currentUser?.patternOfSalaah && (
                    <div>
                      <h4 className="font-medium">Religious Practice</h4>
                      <p className="text-sm text-muted-foreground">Pattern of Salaah: {currentUser.patternOfSalaah}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <div className="p-4 border-t flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandDetails(!expandDetails)}
                  className="text-muted-foreground"
                >
                  {expandDetails ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                  {expandDetails ? "Show less" : "Show more"}
                </Button>
              </div>
              
              <div className="p-4 border-t flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={handleSkip}
                  disabled={processingAction}
                >
                  <X className="h-6 w-6 text-red-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={handleLike}
                  disabled={processingAction}
                >
                  <Heart className="h-6 w-6 text-green-500" />
                </Button>
              </div>
            </Card>
            
            <p className="text-center text-muted-foreground mt-4">
              {currentIndex + 1} of {users.length} profiles
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-center text-muted-foreground">
                No more profiles to browse. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Browse;
