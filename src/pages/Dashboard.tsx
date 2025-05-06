
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile completion */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} />
                <p className="text-sm text-muted-foreground mt-2">
                  Add 2 more photos to complete your profile
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basic Info</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bio</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Photos</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      4/6
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Interests</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Profile Views</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Likes Received</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Matches</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Messages Sent</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Messages Received</span>
                  <span className="font-medium">28</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent visitors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=44&h=44" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Alex J.</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=44&h=44" />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Taylor M.</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=44&h=44" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Jordan D.</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=44&h=44" />
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Casey S.</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
