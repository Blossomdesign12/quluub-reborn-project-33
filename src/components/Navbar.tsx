
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  // This would use authentication in a real app
  const isLoggedIn = true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-primary">Quluub</span>
        </Link>
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/browse" className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
                <Search size={20} />
                <span>Browse</span>
              </Link>
              <Link to="/matches" className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
                <Heart size={20} />
                <span>Matches</span>
              </Link>
              <Link to="/messages" className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
                <MessageCircle size={20} />
                <span>Messages</span>
              </Link>
            </nav>
            
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=44&h=44" alt="Profile" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
