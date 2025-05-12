
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Search, MessageCircle, Heart } from "lucide-react";
import ProfileImage from "./ProfileImage";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
    <header className="w-full border-b bg-white">
      <div className="container py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xl font-bold text-primary">
            Quluub
          </Link>
        </div>

        <nav>
          <ul className="flex items-center space-x-2">
            <li>
              <Button variant="ghost" asChild>
                <Link to="/browse">
                  <Search className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Discover</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <Button variant="ghost" asChild>
                <Link to="/matches">
                  <Heart className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Matches</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <Button variant="ghost" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">Messages</span>
                </Link>
              </Button>
            </li>
            
            <li>
              <NotificationBell />
            </li>
            
            <li className="ml-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <ProfileImage
                    src={user.profile_pic || ""}
                    alt={user.username}
                    fallback={user.fname?.charAt(0) || "U"}
                    size="sm"
                  />
                </Link>
              </Button>
            </li>
            
            <li>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
