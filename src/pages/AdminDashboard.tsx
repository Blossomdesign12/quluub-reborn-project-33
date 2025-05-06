import { useState } from "react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Heart, 
  UserCheck, 
  UserX,
  MessageCircle,
  Search,
  UserCog,
  MailCheck,
  AlertTriangle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - In a real app, this would come from an API
const memberStats = {
  total: 1257,
  male: 614,
  female: 643,
  premium: 347,
  hidden: 58,
  newToday: 24
};

const matchStats = {
  total: 683,
  successRate: 37,
  avgMatchesPerUser: 3.2,
  pendingRequests: 146
};

const engagementStats = {
  activeUsers: 876,
  messagesExchanged: 12684,
  avgSessionTime: "14.3 min",
  videoCallsInitiated: 238
};

const mockUsers = [
  {
    id: "1",
    username: "Ahmad786",
    name: "Ahmad Ibrahim",
    gender: "Male",
    age: 28,
    location: "London, UK",
    status: "Premium",
    lastActive: "Today",
    joinDate: "2023-05-15",
    matchCount: 12,
    profileCompletion: 95
  },
  {
    id: "2",
    username: "Aisha_22",
    name: "Aisha Mohammed",
    gender: "Female",
    age: 26,
    location: "Birmingham, UK",
    status: "Free",
    lastActive: "Yesterday",
    joinDate: "2023-06-22",
    matchCount: 8,
    profileCompletion: 85
  },
  {
    id: "3",
    username: "Yusuf_K",
    name: "Yusuf Khan",
    gender: "Male",
    age: 32,
    location: "Manchester, UK",
    status: "Premium",
    lastActive: "3 days ago",
    joinDate: "2023-04-10",
    matchCount: 15,
    profileCompletion: 100
  },
  {
    id: "4",
    username: "Maryam123",
    name: "Maryam Ali",
    gender: "Female",
    age: 24,
    location: "Leeds, UK",
    status: "Free",
    lastActive: "1 week ago",
    joinDate: "2023-07-05",
    matchCount: 5,
    profileCompletion: 70
  },
  {
    id: "5",
    username: "ImranH",
    name: "Imran Hassan",
    gender: "Male",
    age: 30,
    location: "Bristol, UK",
    status: "Premium",
    lastActive: "2 days ago",
    joinDate: "2023-03-18",
    matchCount: 10,
    profileCompletion: 90
  }
];

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  
  const filteredUsers = mockUsers.filter(user => {
    // Search query filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
                         user.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Gender filter
    const matchesGender = genderFilter === "all" || 
                         user.gender.toLowerCase() === genderFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold text-primary">Quluub Admin</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Help
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container pt-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="overview" value={tabValue} onValueChange={setTabValue} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats at a glance */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="Total Members" 
                value={memberStats.total} 
                icon={<Users size={18} />} 
                trend={{ value: 4.2, positive: true }}
              />
              <StatsCard 
                title="Total Matches" 
                value={matchStats.total} 
                icon={<Heart size={18} />} 
                trend={{ value: 2.8, positive: true }}
              />
              <StatsCard 
                title="Premium Users" 
                value={memberStats.premium} 
                icon={<Star size={18} />} 
                trend={{ value: 5.1, positive: true }}
              />
              <StatsCard 
                title="Active Today" 
                value={memberStats.newToday} 
                icon={<UserCheck size={18} />} 
              />
            </section>
            
            {/* Gender distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard title="Member Distribution" icon={<Users size={18} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                      <span>Males</span>
                    </div>
                    <span className="font-medium">{memberStats.male}</span>
                  </div>
                  <Progress value={(memberStats.male / memberStats.total) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>
                      <span>Females</span>
                    </div>
                    <span className="font-medium">{memberStats.female}</span>
                  </div>
                  <Progress value={(memberStats.female / memberStats.total) * 100} className="h-2 bg-muted">
                    <div className="h-full bg-secondary" style={{ width: `${(memberStats.female / memberStats.total) * 100}%` }} />
                  </Progress>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Premium Users</span>
                    </div>
                    <span className="font-medium">{memberStats.premium}</span>
                  </div>
                  <Progress value={(memberStats.premium / memberStats.total) * 100} className="h-2 bg-muted">
                    <div className="h-full bg-green-500" style={{ width: `${(memberStats.premium / memberStats.total) * 100}%` }} />
                  </Progress>
                </div>
              </DashboardCard>
              
              <DashboardCard title="Matching Status" icon={<Heart size={18} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-600">{matchStats.successRate}%</span>
                  </div>
                  <Progress value={matchStats.successRate} className="h-2 bg-muted">
                    <div className="h-full bg-green-500" style={{ width: `${matchStats.successRate}%` }} />
                  </Progress>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span>Avg. Matches Per User</span>
                    <span className="font-medium">{matchStats.avgMatchesPerUser}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span>Pending Connection Requests</span>
                    <span className="font-medium">{matchStats.pendingRequests}</span>
                  </div>
                </div>
              </DashboardCard>
            </div>
            
            {/* Recent members */}
            <DashboardCard title="Recent Members" icon={<UserCheck size={18} />}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.slice(0, 5).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DashboardCard>
          </TabsContent>
          
          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder="Search members..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DashboardCard title="Member Management" icon={<UserCog size={18} />}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <span className={user.status === "Premium" ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs" : "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${user.profileCompletion}%` }} 
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DashboardCard>
          </TabsContent>
          
          {/* Other tabs - placeholder content */}
          <TabsContent value="matches">
            <DashboardCard title="Match Statistics" icon={<Heart size={18} />}>
              <p className="text-muted-foreground">Detailed match statistics and history will be displayed here.</p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="engagement">
            <DashboardCard title="User Engagement" icon={<MessageCircle size={18} />}>
              <p className="text-muted-foreground">User engagement metrics and analytics will be displayed here.</p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="reports">
            <DashboardCard title="Reported Profiles" icon={<AlertTriangle size={18} />}>
              <p className="text-muted-foreground">User reports and moderation tools will be displayed here.</p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="referrals">
            <DashboardCard title="Referral Program" icon={<MailCheck size={18} />}>
              <p className="text-muted-foreground">Referral statistics and management tools will be displayed here.</p>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
