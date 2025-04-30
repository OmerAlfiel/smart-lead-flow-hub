import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

const Invitations: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('agent');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has permission to access this page
  useEffect(() => {
    if (user && !isAuthorized()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Function to check if user is authorized
  const isAuthorized = () => {
    return user?.role === 'admin' || user?.role === 'manager';
  };

  // Function to check if user can create specific role
  const canCreateRole = (roleToCreate: string) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'manager' && roleToCreate === 'agent') return true;
    return false;
  };

  // Fetch invitations on component mount
  useEffect(() => {
    const checkPermissionAndFetchData = async () => {
      try {
        // First, verify permissions on the server
        await api.get('/auth/check-permission?resource=invitations');
        
        // If the above doesn't throw an error, user has permission
        if (isAuthorized()) {
          fetchInvitations();
        }
      } catch (error) {
        // Server rejected the permission check
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        window.location.href = '/dashboard';
      }
    };
    
    if (user) {
      checkPermissionAndFetchData();
    }
  }, [user]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/invitations');
      setInvitations(response.data);
    } catch (error: any) {
      toast({
        title: "Error fetching invitations",
        description: error.message || "Could not fetch invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!canCreateRole(role)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to create this role",
          variant: "destructive",
        });
        return;
      }
      
      await api.post('/invitations', { email, role });
      
      toast({
        title: "Invitation created",
        description: `Invitation sent to ${email}`,
      });
      
      // Reset form and refresh invitations list
      setEmail('');
      setRole('agent');
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error creating invitation",
        description: error.response?.data?.message || "Could not create invitation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async (id: string) => {
    try {
      await api.post(`/invitations/${id}/resend`);
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent successfully",
      });
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error resending invitation",
        description: error.response?.data?.message || "Could not resend invitation",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/invitations/${id}`);
      toast({
        title: "Invitation deleted",
        description: "The invitation has been deleted successfully",
      });
      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error deleting invitation",
        description: error.response?.data?.message || "Could not delete invitation",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/signup?token=${token}`);
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Invitations</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Invitation</CardTitle>
          <CardDescription>
            Send an invitation to a new user to join the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} disabled={user?.role === 'manager'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  {user?.role === 'admin' && (
                    <>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {user?.role === 'manager' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Managers can only create invitations for agents
                </p>
              )}
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Invitations</CardTitle>
          <CardDescription>
            Manage existing invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading invitations...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-4">No active invitations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell>{invitation.used ? 'Used' : 'Pending'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(invitation.token)}
                        disabled={invitation.used}
                      >
                        Copy Link
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleResend(invitation.id)}
                        disabled={invitation.used}
                      >
                        Resend
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(invitation.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Invitations;