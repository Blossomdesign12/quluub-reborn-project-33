
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Fixed import path
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Search, MessageCircle, Heart } from "lucide-react";
import { useContext } from "react";
import ProfileImage from "./ProfileImage";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext) as { user: any, logout: () => void }; // Added type assertion
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  if (!user) return null;

  return (
    <header className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
      <div className="container py-2">
        <nav>
          <ul className="flex items-center justify-around">
            <li>
              <Button variant="ghost" asChild className="flex flex-col items-center px-2 h-auto">
                <Link to="/browse">
                  <Search className="h-5 w-5 mb-1" />
                  <span className="text-xs">Discover</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <Button variant="ghost" asChild className="flex flex-col items-center px-2 h-auto">
                <Link to="/matches">
                  <Heart className="h-5 w-5 mb-1" />
                  <span className="text-xs">Matches</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <Button variant="ghost" asChild className="flex flex-col items-center px-2 h-auto">
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Messages</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <div className="flex flex-col items-center px-2">
                <NotificationBell />
                <span className="text-xs mt-1">Alerts</span>
              </div>
            </li>
            
            <li>
              <Button variant="ghost" asChild className="flex flex-col items-center px-2 h-auto">
                <Link to="/profile">
                  <div className="flex items-center justify-center mb-1">
                    <ProfileImage
                      src={user.profile_pic || ""}
                      alt={user.username}
                      fallback={user.fname?.charAt(0) || "U"}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs">Profile</span>
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
