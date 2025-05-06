
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Check, CheckCircle, BadgeDollarSign } from "lucide-react";

const Settings = () => {
  const [isPro, setIsPro] = useState(false);
  
  const handleUpgrade = () => {
    // In a real app, this would initiate a payment flow
    setIsPro(true);
    console.log("User upgraded to Pro");
  };

  const handleDowngrade = () => {
    // In a real app, this would cancel the subscription
    setIsPro(false);
    console.log("User downgraded from Pro");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Subscription</span>
                {isPro && (
                  <Badge className="bg-primary">Pro</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card className={`border ${!isPro ? 'border-primary shadow-md' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Free Plan</span>
                      {!isPro && <CheckCircle className="h-5 w-5 text-primary" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/month</span></div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Browse potential matches</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Send connection requests</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Message with connections</span>
                      </li>
                      <li className="flex items-center text-muted-foreground">
                        <span className="h-4 w-4 mr-2">✕</span>
                        <span>Video calls</span>
                      </li>
                      <li className="flex items-center text-muted-foreground">
                        <span className="h-4 w-4 mr-2">✕</span>
                        <span>Advanced filters</span>
                      </li>
                    </ul>
                    {isPro && (
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={handleDowngrade}
                      >
                        Downgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>
                
                {/* Pro Plan */}
                <Card className={`border ${isPro ? 'border-primary shadow-md' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span>Pro Plan</span>
                        <BadgeDollarSign className="h-5 w-5 ml-2 text-amber-500" />
                      </div>
                      {isPro && <CheckCircle className="h-5 w-5 text-primary" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>All Free features</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Video calls with connections</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Advanced search filters</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>See who viewed your profile</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Priority in search results</span>
                      </li>
                    </ul>
                    {!isPro ? (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90" 
                        onClick={handleUpgrade}
                      >
                        Upgrade to Pro
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
              
              {isPro && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your Pro subscription renews on May 12, 2025</p>
                  <Button variant="outline" size="sm">Manage Billing</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Deactivate Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
