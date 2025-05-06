
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { Heart, Shield } from "@/components/Icons";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const handleLogin = (email: string, password: string) => {
    // In a real app, this would store the token in localStorage/cookies
    // and set the authenticated user in a global context
    console.log("Logging in with:", email, password);
    
    toast({
      title: "Login successful",
      description: "Welcome back to Quluub!",
    });
    
    navigate("/browse");
  };
  
  const handleSignup = (name: string, email: string, password: string) => {
    // In a real app, this would create a new user account
    console.log("Signing up with:", name, email, password);
    
    toast({
      title: "Account created successfully",
      description: "Welcome to Quluub!",
    });
    
    navigate("/browse");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row">
        {/* Brand section */}
        <div className="w-full md:w-1/2 bg-primary p-8 text-white rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <div className="h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Quluub</h1>
            <p className="text-lg md:text-xl mb-8">
              Find meaningful connections with people who share your values and interests.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Quality Matches</h3>
                  <p className="text-sm opacity-80">Our algorithm focuses on compatibility, not just appearances.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Safe Community</h3>
                  <p className="text-sm opacity-80">We prioritize your privacy and security above all else.</p>
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
