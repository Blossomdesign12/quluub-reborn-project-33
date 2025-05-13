
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Check, CheckCircle, BadgeDollarSign, Eye, EyeOff, Mail, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const [isPro, setIsPro] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  
  const handleUpgrade = () => {
    // In a real app, this would initiate a payment flow
    setIsPro(true);
    toast({
      title: "Plan upgraded",
      description: "You have successfully upgraded to the Pro plan.",
    });
  };

  const handleDowngrade = () => {
    // In a real app, this would cancel the subscription
    setIsPro(false);
    toast({
      title: "Plan downgraded",
      description: "You have been downgraded to the Free plan.",
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to change the password
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container py-6">
        {/* Email validation banner */}
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertDescription className="flex items-center gap-2">
            <span className="bg-yellow-400 text-white p-1 rounded-full">!</span>
            Please validate your email address to continue
            <Button variant="outline" size="sm" className="ml-auto bg-blue-600 text-white hover:bg-blue-700">
              Resend validation mail
            </Button>
          </AlertDescription>
        </Alert>
        
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5" />
                Manage My Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card className={`border ${!isPro ? 'border-primary shadow-md' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Freemium</span>
                      {!isPro && <Badge className="bg-green-500">Active</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-center">£0<span className="text-base font-normal text-muted-foreground">/month</span></div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Requests Sent Per Month:</span>
                        <span className="font-medium">2</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Requests Received Per Month:</span>
                        <span className="font-medium">Unlimited</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Message Allowance:</span>
                        <span className="font-medium">10</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Word Count Per Message:</span>
                        <span className="font-medium">20</span>
                      </li>
                    </ul>
                    {isPro && (
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={handleDowngrade}
                      >
                        Select Plan
                      </Button>
                    )}
                    {!isPro && (
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        disabled
                      >
                        Current Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Pro Plan */}
                <Card className={`border ${isPro ? 'border-primary shadow-md' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Premium</span>
                      {isPro && <Badge className="bg-green-500">Active</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-center">£2<span className="text-base font-normal text-muted-foreground"> (£5)/month</span></div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Requests Sent Per Month:</span>
                        <span className="font-medium">5</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Requests Received Per Month:</span>
                        <span className="font-medium">Unlimited</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Message Allowance:</span>
                        <span className="font-medium">10</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Word Count Per Message:</span>
                        <span className="font-medium">20</span>
                      </li>
                    </ul>
                    {!isPro ? (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90" 
                        onClick={handleUpgrade}
                      >
                        Select Plan
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled
                      >
                        Current Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change My Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Current password*" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="relative">
                  <Input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="New password*" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm password*" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handlePasswordChange}
                className="w-full md:w-auto md:ml-auto block"
              >
                Change password
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Toggle visibility</h3>
                  <Button variant="outline" className="w-full border-red-300 text-red-500 hover:bg-red-50">
                    Hide my profile
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Having any issues?</h3>
                  <Button variant="outline" className="w-full border-blue-300 text-blue-500 hover:bg-blue-50">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact us
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Please be sure!</h3>
                  <Button variant="outline" className="w-full border-red-300 text-red-500 hover:bg-red-50">
                    Delete my account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Settings;
