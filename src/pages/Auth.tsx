
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
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
      
      throw error;
    }
  };
  
  const handleSignup = async (name: string, email: string, password: string, gender: string) => {
    const nameParts = name.trim().split(/\s+/);
    const fname = nameParts[0];
    const lname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    
    try {
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
      
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

  const handleGoogleAuth = () => {
    // This would be implemented with Google OAuth
    toast({
      title: "Google Authentication",
      description: "Google login will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </div>

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
