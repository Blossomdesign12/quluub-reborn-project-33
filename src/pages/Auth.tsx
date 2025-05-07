
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { Heart, Shield, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  
  // Get the return URL from location state or default to /browse
  const from = (location.state as { from?: string })?.from || "/browse";
  
  const handleLogin = async (usernameOrEmail: string, password: string) => {
    try {
      await login({ usernameOrEmail, password });
      
      toast({
        title: "Login successful",
        description: "Welcome back to Quluub!",
      });
      
      navigate(from);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };
  
  const handleSignup = async (name: string, email: string, password: string, gender: string) => {
    // Split name into first name and last name
    const nameParts = name.trim().split(/\s+/);
    const fname = nameParts[0];
    const lname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    
    try {
      await signup({
        username: email.split('@')[0], // Generate a username from email
        email,
        password,
        fname,
        lname,
        gender: gender === "male" ? "male" : "female",
      });
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Quluub!",
      });
      
      navigate("/browse");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Email may already be in use",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row">
        {/* Brand section */}
        <div className="w-full md:w-1/2 bg-primary p-8 text-white rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <div className="h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Quluub</h1>
            <p className="text-lg md:text-xl mb-8">
              Find your blessed match with faith at the center of your search.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Islamic Values</h3>
                  <p className="text-sm opacity-80">Our matching focuses on compatibility in faith and values.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Private & Secure</h3>
                  <p className="text-sm opacity-80">Your privacy and security are our top priorities.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Guided Communication</h3>
                  <p className="text-sm opacity-80">Our tools help you have meaningful conversations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form section */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
          {isLogin ? (
            <LoginForm 
              onLogin={handleLogin} 
              onSwitchToSignup={() => setIsLogin(false)} 
            />
          ) : (
            <SignupForm 
              onSignup={handleSignup} 
              onSwitchToLogin={() => setIsLogin(true)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
