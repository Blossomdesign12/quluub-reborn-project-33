
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Matches from "./pages/Matches";
import Settings from "./pages/Settings";
import VideoCall from "./pages/VideoCall";

import Alerts from "./pages/Alerts";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/profile/:userId" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/browse" element={<PrivateRoute element={<Browse />} />} />
            <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/search" element={<PrivateRoute element={<Search />} />} />
            <Route path="/matches" element={<PrivateRoute element={<Matches />} />} />
            <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
            <Route path="/alerts" element={<PrivateRoute element={<Alerts />} />} />
            <Route path="/video-call" element={<PrivateRoute element={<VideoCall />} />} />

            <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
