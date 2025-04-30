import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Tasks from "@/pages/Tasks";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import InitialSetup from "@/components/admin/InitialSetup";
import api from "@/services/api";
import Invitations from "@/pages/Invitations";


const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [needsSetup, setNeedsSetup] = useState(false);
  
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await api.get('/auth/check-setup');
        setNeedsSetup(response.data.needsSetup);
      } catch (error) {
        console.error('Failed to check setup status:', error);
      }
    };
    
    checkSetup();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Initial setup route */}
      <Route 
        path="/setup" 
        element={needsSetup ? <InitialSetup /> : <Navigate to="/login" />} 
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/leads" element={user ? <Leads /> : <Navigate to="/login" />} />
      <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

      {/* Root route with conditional navigation */}
      <Route 
        path="/" 
        element={
          needsSetup ? <Navigate to="/setup" /> : 
          user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } 
      />
      <Route path="/invitations" element={user ? <Invitations /> : <Navigate to="/login" />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
