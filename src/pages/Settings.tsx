
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    profileViews: false,
    appUpdates: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input defaultValue="Johnson" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea 
                    defaultValue="Passionate about art, travel, and good conversations. Looking for someone who enjoys exploring new places and trying new things."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Occupation</label>
                  <Input defaultValue="UX Designer" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <Input defaultValue="Master's in Design" />
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input defaultValue="New York" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">State/Province</label>
                  <Input defaultValue="NY" />
                </div>
                
                <Button>Update Location</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                  </div>
                  <div>
                    <Button variant="outline">Everyone</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activity Status</p>
                    <p className="text-sm text-muted-foreground">Show when you're active</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Read Receipts</p>
                    <p className="text-sm text-muted-foreground">Let others know when you've read messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blocked Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You haven't blocked any users yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Matches</p>
                    <p className="text-sm text-muted-foreground">Get notified when you have a new match</p>
                  </div>
                  <Switch 
                    checked={notifications.newMatches} 
                    onCheckedChange={(checked) => setNotifications({...notifications, newMatches: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                  </div>
                  <Switch 
                    checked={notifications.messages} 
                    onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Views</p>
                    <p className="text-sm text-muted-foreground">Get notified when someone views your profile</p>
                  </div>
                  <Switch 
                    checked={notifications.profileViews} 
                    onCheckedChange={(checked) => setNotifications({...notifications, profileViews: checked})} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">App Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                  </div>
                  <Switch 
                    checked={notifications.appUpdates} 
                    onCheckedChange={(checked) => setNotifications({...notifications, appUpdates: checked})} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="sarah@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Password</label>
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                
                <Button>Update Account</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-md">
                  <p className="font-medium text-primary">Premium Plan</p>
                  <p className="text-sm text-muted-foreground">Your subscription renews on May 12, 2025</p>
                </div>
                
                <Button variant="outline">Manage Subscription</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive">Deactivate Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
