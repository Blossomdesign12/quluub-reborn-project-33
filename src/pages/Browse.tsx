
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, ChevronLeft, ChevronRight, Send, UserPlus } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import { userService, relationshipService } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Browse = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersPerPage] = useState(4); // Show 4 users per page
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await userService.getBrowseUsers({ showAll: true });
        console.log("Browse users:", fetchedUsers);
        if (fetchedUsers && fetchedUsers.length > 0) {
          setUsers(fetchedUsers);
          setTotalPages(Math.ceil(fetchedUsers.length / usersPerPage));
        } else {
          // If no users found, show toast
          toast({
            title: "No users found",
            description: "No potential matches were found at this time.",
            variant: "destructive",
          });
        }
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
  }, [toast, usersPerPage]);

  const handleLike = async (userId: string) => {
    if (processingAction) return;
    
    try {
      setProcessingAction(true);
      console.log("Sending request to user ID:", userId);
      await relationshipService.sendRequest(userId);
      setPendingConnections(prev => [...prev, userId]);
      toast({
        title: "Success",
        description: "You have expressed interest in this person",
      });
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

  const handleSkip = (userId: string) => {
    // In a real app, you might want to track skipped users
    toast({
      title: "Skipped",
      description: "You've skipped this profile",
    });
  };

  const handleMessage = (userId: string) => {
    navigate(`/messages?userId=${userId}`);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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

  // Format any JSON string fields
  const parseJsonField = (jsonString: string | null | undefined) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return jsonString;
    }
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {currentUsers.map(user => (
                <Card key={user._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <ProfileImage
                        src=""
                        alt={`${user.fname || ''} ${user.lname || ''}`}
                        fallback={(user.fname?.charAt(0) || "") + (user.lname?.charAt(0) || "")}
                        size="lg"
                        className="h-20 w-20 text-2xl"
                      />
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                      <h3 className="text-lg font-bold">
                        {user.fname} {user.lname}, {calculateAge(user.dob)}
                      </h3>
                      <p className="text-xs">{user.country || "Location not specified"}</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleSkip(user._id!)}
                        disabled={processingAction}
                      >
                        <X className="h-5 w-5 text-red-500" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleLike(user._id!)}
                        disabled={processingAction || pendingConnections.includes(user._id!)}
                      >
                        {pendingConnections.includes(user._id!) ? (
                          <UserPlus className="h-5 w-5 text-amber-500" />
                        ) : (
                          <Heart className="h-5 w-5 text-green-500" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={() => handleMessage(user._id!)}
                        disabled={processingAction}
                      >
                        <Send className="h-5 w-5 text-purple-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={goToPrevPage} disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={goToNextPage} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
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
