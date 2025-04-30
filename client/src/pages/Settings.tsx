import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import InvitationService, { Invitation } from '@/services/invitation.service';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    title: 'Sales Director',
    company: 'Acme Inc.',
    bio: 'Sales professional with 10+ years of experience in B2B software sales.'
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailLeadUpdate: true,
    emailTaskReminders: true,
    emailReports: true,
    pushNewLead: true,
    pushLeadUpdate: false,
    pushTaskReminders: true,
    pushReports: false
  });
  
  // Integration settings
  const [integrations, setIntegrations] = useState({
    google: true,
    office365: false,
    slack: true,
    zoom: false,
    hubspot: false,
    salesforce: false
  });
  
  // Team settings
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'member' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'member' }
  ]);
  
  // New team member form
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  // New state variables for invitations
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    role: 'agent'
  });
  const [isInviting, setIsInviting] = useState(false);
  
  useEffect(() => {
    if (isAdmin()) {
      fetchInvitations();
    }
  }, []);
  
  const fetchInvitations = async () => {
    try {
      const invitations = await InvitationService.getInvitations();
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      toast({
        title: "Failed to load invitations",
        description: "There was an error loading the invitations.",
        variant: "destructive",
      });
    }
  };
  
  const sendInvitation = async () => {
    if (!newInvitation.email || !newInvitation.role) {
      toast({
        title: "Missing information",
        description: "Please enter an email and select a role.",
        variant: "destructive"
      });
      return;
    }
    
    setIsInviting(true);
    
    try {
      const result = await InvitationService.createInvitation(newInvitation);
      const invitationLink = `${window.location.origin}/signup?token=${result.token}`;
      await navigator.clipboard.writeText(invitationLink);
      
      toast({
        title: "Invitation sent!",
        description: "The invitation link has been copied to your clipboard.",
      });
      
      setNewInvitation({ email: '', role: 'agent' });
      fetchInvitations();
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation.",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };
  
  const copyInvitationLink = (token: string) => {
    const invitationLink = `${window.location.origin}/signup?token=${token}`;
    navigator.clipboard.writeText(invitationLink);
    
    toast({
      title: "Link copied!",
      description: "The invitation link has been copied to your clipboard.",
    });
  };
  
  const resendInvitation = async (id: string) => {
    try {
      await InvitationService.resendInvitation(id);
      
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent successfully.",
      });
      
      fetchInvitations();
    } catch (error) {
      toast({
        title: "Failed to resend invitation",
        description: "There was an error resending the invitation.",
        variant: "destructive"
      });
    }
  };
  
  const deleteInvitation = async (id: string) => {
    try {
      await InvitationService.deleteInvitation(id);
      
      toast({
        title: "Invitation deleted",
        description: "The invitation has been deleted successfully.",
      });
      
      setPendingInvitations(pendingInvitations.filter(inv => inv.id !== id));
    } catch (error) {
      toast({
        title: "Failed to delete invitation",
        description: "There was an error deleting the invitation.",
        variant: "destructive"
      });
    }
  };

  // Handle profile update
  const updateProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
  };
  
  // Handle notification settings update
  const updateNotifications = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };
  
  // Handle integration toggle
  const toggleIntegration = (key: keyof typeof integrations) => {
    const updatedIntegrations = {...integrations, [key]: !integrations[key]};
    setIntegrations(updatedIntegrations);
    
    toast({
      title: updatedIntegrations[key] ? "Integration enabled" : "Integration disabled",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} integration has been ${updatedIntegrations[key] ? 'enabled' : 'disabled'}.`
    });
  };
  
  // Handle adding new team member
  const addTeamMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "Missing information",
        description: "Please enter a name and email for the new team member.",
        variant: "destructive"
      });
      return;
    }
    
    const newTeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role
    };
    
    setTeamMembers([...teamMembers, newTeamMember]);
    setNewMember({ name: '', email: '', role: 'member' });
    
    toast({
      title: "Team member added",
      description: `${newTeamMember.name} has been added to your team.`
    });
  };
  
  // Handle removing team member
  const removeTeamMember = (id: string) => {
    const memberToRemove = teamMembers.find(member => member.id === id);
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedMembers);
    
    toast({
      title: "Team member removed",
      description: `${memberToRemove?.name} has been removed from your team.`
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="team" disabled={!isAdmin()}>Team</TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and professional details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profile.name && (
                          <span className="text-3xl font-semibold text-gray-600">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                          <path d="m15 5 4 4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={profile.phone} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        value={profile.title} 
                        onChange={(e) => setProfile({...profile, title: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        value={profile.company} 
                        onChange={(e) => setProfile({...profile, company: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={updateProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Update your password and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Lead Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive an email when a new lead is created.</p>
                      </div>
                      <Switch 
                        checked={notifications.emailNewLead} 
                        onCheckedChange={(checked) => setNotifications({...notifications, emailNewLead: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lead Status Updates</p>
                        <p className="text-sm text-muted-foreground">Receive an email when a lead's status is updated.</p>
                      </div>
                      <Switch 
                        checked={notifications.emailLeadUpdate} 
                        onCheckedChange={(checked) => setNotifications({...notifications, emailLeadUpdate: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task Reminders</p>
                        <p className="text-sm text-muted-foreground">Receive email reminders for upcoming and overdue tasks.</p>
                      </div>
                      <Switch 
                        checked={notifications.emailTaskReminders} 
                        onCheckedChange={(checked) => setNotifications({...notifications, emailTaskReminders: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Receive weekly performance and activity reports.</p>
                      </div>
                      <Switch 
                        checked={notifications.emailReports} 
                        onCheckedChange={(checked) => setNotifications({...notifications, emailReports: checked})} 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Lead Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive a push notification when a new lead is created.</p>
                      </div>
                      <Switch 
                        checked={notifications.pushNewLead} 
                        onCheckedChange={(checked) => setNotifications({...notifications, pushNewLead: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lead Status Updates</p>
                        <p className="text-sm text-muted-foreground">Receive a push notification when a lead's status is updated.</p>
                      </div>
                      <Switch 
                        checked={notifications.pushLeadUpdate} 
                        onCheckedChange={(checked) => setNotifications({...notifications, pushLeadUpdate: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task Reminders</p>
                        <p className="text-sm text-muted-foreground">Receive push reminders for upcoming and overdue tasks.</p>
                      </div>
                      <Switch 
                        checked={notifications.pushTaskReminders} 
                        onCheckedChange={(checked) => setNotifications({...notifications, pushTaskReminders: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Receive weekly performance and activity reports.</p>
                      </div>
                      <Switch 
                        checked={notifications.pushReports} 
                        onCheckedChange={(checked) => setNotifications({...notifications, pushReports: checked})} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={updateNotifications}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Integration Settings */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect your account with other services and tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Google Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Google</h4>
                        <p className="text-sm text-muted-foreground">Connect your Google account to sync contacts and calendar.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.google} 
                      onCheckedChange={() => toggleIntegration('google')} 
                    />
                  </div>
                  
                  {/* Office 365 Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6.5v18zM13 3v18h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-6z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Office 365</h4>
                        <p className="text-sm text-muted-foreground">Connect Office 365 to sync emails and calendar events.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.office365} 
                      onCheckedChange={() => toggleIntegration('office365')} 
                    />
                  </div>
                  
                  {/* Slack Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications and updates in your Slack workspace.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.slack} 
                      onCheckedChange={() => toggleIntegration('slack')} 
                    />
                  </div>
                  
                  {/* Zoom Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 11.5c0 6.351-5.149 11.5-11.5 11.5S1 17.851 1 11.5 6.149 0 12.5 0 24 5.149 24 11.5zm-8.5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Zoom</h4>
                        <p className="text-sm text-muted-foreground">Schedule and join Zoom meetings directly from leads.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.zoom} 
                      onCheckedChange={() => toggleIntegration('zoom')} 
                    />
                  </div>
                  
                  {/* HubSpot Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.766 0H7.323C3.849 0 1.025 2.12.179 5.414c-.105.414.21.828.631.828h7.648c.421 0 .737-.414.632-.828-.421-1.242-1.579-2.12-2.947-2.12h-.316v.414c0 1.449 1.158 2.535 2.526 2.535.842 0 1.579-.414 2-.934C10.985 6.655 12.144 7.38 13.513 7.38h4.492c1.368 0 2.525-1.14 2.525-2.534V2.535C20.53 1.14 19.814 0 18.766 0zM7.85 4.845c0 .414-.316.828-.842.828-.526 0-.842-.414-.842-.828 0-.413.316-.827.842-.827.526 0 .842.414.842.827zm10.143 0c0 .414-.316.828-.842.828-.526 0-.842-.414-.842-.828 0-.413.316-.827.842-.827.526 0 .842.414.842.827zM24 7.38c0 .414-.316.828-.737.828h-7.648c-.421 0-.736-.414-.631-.828.421-1.242 1.578-2.12 2.947-2.12h.315v.414c0 1.449-1.157 2.535-2.525 2.535-.842 0-1.579-.414-2-.934-.633 1.346-1.79 2.07-3.159 2.07H5.06c-1.368 0-2.526-1.14-2.526-2.535V4.656c0-1.449.737-2.535 1.79-2.535h11.438c3.474 0 6.298 2.12 7.144 5.414.105.414.421.828.842.828.42 0 .736-.414.631-.828C23.369 3.12 20.105 0 16.105 0h-10.2C2.632 0 0 2.656 0 5.897v1.657c0 3.242 2.632 5.897 5.895 5.897h3.79c1.474 0 2.841-.62 3.789-1.552.947.932 2.316 1.552 3.79 1.552h.736c3.263 0 5.895-2.655 5.895-5.897V5.897c.105-3.241-2.526-5.897-5.79-5.897H15.79c-1.474 0-2.842.62-3.79 1.552C11.053.62 9.685 0 8.21 0h-.736C5.527 0 3.79 1.242 2.948 3.104h-.631C1.053 3.104 0 4.242 0 5.69v.828c0 1.449 1.053 2.586 2.316 2.586h.631C3.79 11.034 5.527 12.28 7.474 12.28h.738c1.474 0 2.842-.622 3.79-1.553.947.931 2.315 1.553 3.789 1.553h.736c3.263 0 5.895-2.656 5.895-5.897V5.725c0-.413.316-.827.736-.827.421 0 .842.414.842.827v.621c0 .414-.316.828-.736.828-.421 0-.737.414-.637.828.106.414.422.828.843.828.947 0 1.684-.827 1.684-1.863V5.725c0-1.035-.737-1.863-1.684-1.863-.947 0-1.684.828-1.684 1.863v.621c0 2.414-1.894 4.38-4.21 4.38h-.737c-1.157 0-2.21-.621-2.842-1.553-.526-.621-1.052-1.035-1.789-1.035s-1.263.414-1.79 1.035c-.631.932-1.684 1.553-2.842 1.553h-.736c-2.316 0-4.21-1.966-4.21-4.38V4.346c0-2.414 1.894-4.38 4.21-4.38h.736c1.158 0 2.21.621 2.842 1.552.526.62 1.053 1.035 1.79 1.035.736 0 1.263-.414 1.79-1.035.63-.93 1.684-1.552 2.84-1.552h3.159c2.315 0 4.21 1.966 4.21 4.38v1.035zm0 15.518v-5.896c0-3.242-2.631-5.898-5.894-5.898h-3.79c-1.473 0-2.84.621-3.789 1.553-.947-.932-2.316-1.553-3.79-1.553h-.735c-3.263 0-5.895 2.656-5.895 5.898v5.897c0 .413.316.827.736.827h22.42c.422 0 .737-.414.737-.828zm-1.474-.827H1.474v-5.07c0-2.413 1.895-4.38 4.21-4.38h.737c1.158 0 2.21.622 2.842 1.553.526.621 1.052 1.035 1.79 1.035.736 0 1.263-.414 1.79-1.035.63-.931 1.684-1.553 2.84-1.553h3.16c2.314 0 4.209 1.967 4.209 4.38v5.07z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">HubSpot</h4>
                        <p className="text-sm text-muted-foreground">Sync contacts and deals with your HubSpot account.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.hubspot} 
                      onCheckedChange={() => toggleIntegration('hubspot')} 
                    />
                  </div>
                  
                  {/* Salesforce Integration */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.324 16.412c.106-.268.106-.696-.106-.983-.106-.286-.425-.502-.743-.558 1.496-.177 2.982-1.01 2.982-2.772 0-1.01-.53-1.77-1.39-2.219.53-1.01-.089-1.99-.089-1.99s-.925-.179-1.938.724c-.671-.179-1.39-.268-2.13-.268-.636 0-1.273.09-1.885.268-.989-.902-1.938-.724-1.938-.724s-.618.98-.088 1.99c-.854.45-1.391 1.209-1.391 2.219 0 1.77 1.497 2.595 2.982 2.772-.318.09-.636.268-.742.558-.212.287-.212.715-.106.983-1.03.09-.742-.724-.742-.724-.265-.451-.636-.63-.954-.63 0 0-.318.268 0 .45.318.178.318.45.53.714 0 0 .318.63 1.273.63.954 0 1.484-.09 1.802-.178.282 1.034 1.201 1.77 2.095 1.77.9 0 1.696-.736 1.979-1.77.318.09.83.178 1.803.178.954 0 1.272-.63 1.272-.63.212-.264.212-.536.53-.714.317-.182 0-.45 0-.45-.318 0-.69.179-.954.63 0-.002-.318.813-.742.724h-.002zm-3.512.787c-.53 0-.954-.724-1.06-.983-.107-.268-.107-.536-.107-.815h2.343c0 .279 0 .547-.106.815-.107.259-.53.983-1.07.983zm.636-4.743c-.43 0-.954-.268-.954-.696 0-.45.424-.697.954-.697.53 0 .954.268.954.697 0 .428-.425.696-.954.696zm5.115-1.168c0 .696-.107 1.278-.425 1.78-1.06 1.687-4.043 1.48-6.505 1.48-2.46 0-5.444.207-6.505-1.48-.318-.502-.425-1.084-.425-1.78 0-1.126.425-2.236 1.39-3.13-.177-.63-.177-1.48-.177-2.235.106-.268.106-.536.213-.815-1.273.09-2.39-.45-2.39-.45v-.814s1.732-.268 2.672.268c-.106-.09-.106-.179-.212-.268-.071-.27-.177-.54-.177-.815 0-.277 0-.8.106-1.09.106-.177.213-.268.319-.268h.53s.212.902.53 1.347c.318-.724.954-1.48.954-1.48s.636.756.954 1.48c.318-.445.53-1.347.53-1.347h.53c.106 0 .213.09.319.268.106.29.106.813.106 1.09 0 .268-.106.53-.177.815-.106.09-.106.179-.212.268.954-.536 2.671-.268 2.671-.268v.815s-1.116.539-2.388.45c.106.27.106.535.212.814 0 .748 0 1.598-.177 2.235.965.894 1.39 1.994 1.39 3.13V11.288z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Salesforce</h4>
                        <p className="text-sm text-muted-foreground">Connect with Salesforce to sync your CRM data.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrations.salesforce} 
                      onCheckedChange={() => toggleIntegration('salesforce')} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
{/* Team Settings */}
<TabsContent value="team">
  {isAdmin() ? (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>
          Add and manage team members and their access levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Team Members */}
        <div>
          <h3 className="text-lg font-medium mb-4">Current Team Members</h3>
          {teamMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue={member.role}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
                
                {member.id !== '1' && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Invitations */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
          {pendingInvitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending invitations</p>
          ) : (
            pendingInvitations.map(invitation => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">{invitation.email}</h4>
                    <p className="text-sm text-muted-foreground">Role: {invitation.role} • Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyInvitationLink(invitation.token)}
                  >
                    Copy Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resendInvitation(invitation.id)}
                  >
                    Resend
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteInvitation(invitation.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invite New User Form */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Invite New Team Member</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input 
                id="invite-email"
                type="email"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                placeholder="colleague@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select 
                value={newInvitation.role} 
                onValueChange={(value) => setNewInvitation({...newInvitation, role: value})}
              >
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full"
                onClick={sendInvitation}
                disabled={!newInvitation.email || !newInvitation.role || isInviting}
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>
          You don't have permission to access team management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Only administrators can manage team members and invitations. Please contact your administrator if you need access.
        </p>
      </CardContent>
    </Card>
  )}
</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
