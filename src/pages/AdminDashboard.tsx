import { useState } from "react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatsCard } from "@/components/ui/stats-card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Heart, 
  UserCheck, 
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
import { useAdminData } from "@/hooks/useAdminData";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { stats, users, loading, error } = useAdminData();
  const [tabValue, setTabValue] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  
  // Calculate age from DOB
  const calculateAge = (dob: Date | string | undefined) => {
    if (!dob) return 'N/A';
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search query filter
    const matchesSearch = user.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.country?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || 
                         user.plan?.toLowerCase() === statusFilter.toLowerCase();
    
    // Gender filter
    const matchesGender = genderFilter === "all" || 
                         user.gender?.toLowerCase() === genderFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="bg-white border-b">
          <div className="container flex h-16 items-center">
            <h1 className="text-xl font-bold text-primary">Quluub Admin</h1>
          </div>
        </div>
        <div className="container pt-6 flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="bg-white border-b">
          <div className="container flex h-16 items-center">
            <h1 className="text-xl font-bold text-primary">Quluub Admin</h1>
          </div>
        </div>
        <div className="container pt-6">
          <div className="text-center text-red-600">
            <p>Error loading admin data: {error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                value={stats?.totalMembers || 0} 
                icon={<Users size={18} />} 
                trend={{ value: 4.2, positive: true }}
              />
              <StatsCard 
                title="Total Matches" 
                value={stats?.totalMatches || 0} 
                icon={<Heart size={18} />} 
                trend={{ value: 2.8, positive: true }}
              />
              <StatsCard 
                title="Premium Users" 
                value={stats?.premiumMembers || 0} 
                icon={<Star size={18} />} 
                trend={{ value: 5.1, positive: true }}
              />
              <StatsCard 
                title="Active Today" 
                value={stats?.activeToday || 0} 
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
                    <span className="font-medium">{stats?.maleMembers || 0}</span>
                  </div>
                  <Progress value={stats?.totalMembers ? (stats.maleMembers / stats.totalMembers) * 100 : 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>
                      <span>Females</span>
                    </div>
                    <span className="font-medium">{stats?.femaleMembers || 0}</span>
                  </div>
                  <Progress value={stats?.totalMembers ? (stats.femaleMembers / stats.totalMembers) * 100 : 0} className="h-2 bg-muted">
                    <div className="h-full bg-secondary" style={{ width: `${stats?.totalMembers ? (stats.femaleMembers / stats.totalMembers) * 100 : 0}%` }} />
                  </Progress>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Premium Users</span>
                    </div>
                    <span className="font-medium">{stats?.premiumMembers || 0}</span>
                  </div>
                  <Progress value={stats?.totalMembers ? (stats.premiumMembers / stats.totalMembers) * 100 : 0} className="h-2 bg-muted">
                    <div className="h-full bg-green-500" style={{ width: `${stats?.totalMembers ? (stats.premiumMembers / stats.totalMembers) * 100 : 0}%` }} />
                  </Progress>
                </div>
              </DashboardCard>
              
              <DashboardCard title="Matching Status" icon={<Heart size={18} />}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <span className="font-medium text-green-600">{stats?.successRate || 0}%</span>
                  </div>
                  <Progress value={stats?.successRate || 0} className="h-2 bg-muted">
                    <div className="h-full bg-green-500" style={{ width: `${stats?.successRate || 0}%` }} />
                  </Progress>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span>Avg. Matches Per User</span>
                    <span className="font-medium">{stats?.avgMatchesPerUser || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span>Pending Connection Requests</span>
                    <span className="font-medium">{stats?.pendingRequests || 0}</span>
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
                    {users.slice(0, 5).map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{calculateAge(user.dob)}</TableCell>
                        <TableCell>{user.country || 'N/A'}</TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
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
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
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
                      <TableHead>Plan</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.username || 'N/A'}</TableCell>
                        <TableCell>{`${user.fname || ''} ${user.lname || ''}`.trim() || 'N/A'}</TableCell>
                        <TableCell>{user.gender || 'N/A'}</TableCell>
                        <TableCell>{calculateAge(user.dob)}</TableCell>
                        <TableCell>{user.country || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={
                            user.plan === "premium" || user.plan === "pro" 
                              ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs" 
                              : "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          }>
                            {user.plan || 'freemium'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.lastSeen 
                            ? formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <span className={
                            user.status === "active" 
                              ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs" 
                              : "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          }>
                            {user.status || 'inactive'}
                          </span>
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
