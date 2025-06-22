
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
  // Get the return URL from location state or default to /browse
  const from = (location.state as { from?: string })?.from || "/dashboard";
  
  const handleLogin = async (username: string, password: string) => {
    try {
      console.log("Login attempt with username:", username);
      await login({ username, password });
      
      toast({
        title: "Login successful",
        description: "Welcome back to Quluub!",
      });
      
      navigate(from);
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      
      throw error; // Re-throw to let the form component handle it
    }
  };
  
  const handleSignup = async (name: string, email: string, password: string, gender: string) => {
    // Split name into first name and last name
    const nameParts = name.trim().split(/\s+/);
    const fname = nameParts[0];
    const lname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    
    try {
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000); // Generate a more unique username
      
      await signup({
        username,
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
    } catch (error: any) {
      console.error("Signup error:", error);
      
      toast({
        title: "Signup failed",
        description: error?.response?.data?.message || "Email may already be in use",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
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
  );
};

export default Auth;
