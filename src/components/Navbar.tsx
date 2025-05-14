
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Home, AlertCircle, MessageSquare, User, Settings } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useEffect, useState } from "react";
import { chatService } from "@/lib/api-client";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const count = await chatService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      };

      fetchUnreadCount();
      
      // Refresh every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle notification read
  const handleNotificationsRead = () => {
    // You could update notification state here if needed
  };

  // If not logged in, don't show navbar
  if (!user) return null;

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-30 px-4">
        <div className="container h-full mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            My App
          </Link>
          
          <div className="flex items-center gap-4">
            <NotificationBell onNotificationsRead={handleNotificationsRead} />
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-30 pb-safe">
        <div className="container mx-auto flex items-center justify-around">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink 
            to="/messages" 
            icon={MessageSquare} 
            label="Messages"
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <NavLink to="/alerts" icon={AlertCircle} label="Alerts" />
          <NavLink to="/profile" icon={User} label="Profile" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </div>
      </nav>
      
      {/* Add padding for the fixed elements */}
      <div className="h-16" />
      <div className="h-16 pb-safe mt-auto" />
    </>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const NavLink = ({ to, icon: Icon, label, badge }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-3 relative",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs mt-1">{label}</span>
      
      {badge && badge > 0 && (
        <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
};

export default Navbar;
