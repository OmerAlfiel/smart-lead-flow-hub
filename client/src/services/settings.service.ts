// client/src/services/settings.service.ts

import api from "./api";


export interface UserSettingsData {
  id?: string;
  phone?: string;
  title?: string;
  company?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  theme?: string;
}

export interface NotificationSettingsData {
  id?: string;
  emailNewLead: boolean;
  emailLeadUpdate: boolean;
  emailTaskReminders: boolean;
  emailReports: boolean;
  pushNewLead: boolean;
  pushLeadUpdate: boolean;
  pushTaskReminders: boolean;
  pushReports: boolean;
}

interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

interface Office365Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  tenantId: string;
}

interface SalesforceConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  instanceUrl: string;
  scope: string[];
}

export interface IntegrationSettingsData {
  id?: string;
  google: boolean;
  googleConfig?: GoogleConfig;
  office365: boolean;
  office365Config?: Office365Config;
  slack: boolean;
  slackConfig?: Record<string, unknown>;
  zoom: boolean;
  zoomConfig?: Record<string, unknown>;
  hubspot: boolean;
  hubspotConfig?: Record<string, unknown>;
  salesforce: boolean;
  salesforceConfig?: SalesforceConfig;
}

export interface AppSettingsData {
  id?: string;
  companyName: string;
  companyLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  enableRegistration: boolean;
  invitationExpiryDays: number;
  maxUsersPerTeam: number;
  defaultUserRole: string;
  retentionPeriod: number;
  customFields?: Record<string, string | number | boolean>;
}

const SettingsService = {
  // User Settings
  getUserSettings: async (): Promise<UserSettingsData & { name: string, email: string }> => {
    try {
      // Fetch user settings from the server
      const response = await api.get('/settings/user');
      const userSettingsData = response.data;
      
      // Fetch basic user info from the auth profile endpoint
      const userResponse = await api.get('/auth/profile');
      const userData = userResponse.data;
      
      // Combine the data to match what the client expects
      return {
        ...userSettingsData,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        // Map any other fields as needed
        phone: userData.phone || userSettingsData.phone || '',
        title: userData.title || userSettingsData.title || '',
        company: userData.company || userSettingsData.company || '',
        bio: userData.bio || userSettingsData.bio || ''
      };
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },
  
  updateUserSettings: async (data: UserSettingsData & { name?: string, email?: string }): Promise<UserSettingsData & { name: string, email: string }> => {
    try {
      // Get the current user ID from the auth context
      const currentUser = await api.get('/users/profile');
      const userId = currentUser.data.id;
      
      // Extract fields that should be updated in the user profile
      const userProfileData: any = {};
      if (data.name) {
        // Split the name into firstName and lastName
        const nameParts = data.name.split(' ');
        if (nameParts.length > 1) {
          userProfileData.firstName = nameParts[0];
          userProfileData.lastName = nameParts.slice(1).join(' ');
        } else {
          userProfileData.firstName = data.name;
          userProfileData.lastName = '';
        }
      }
      
      if (data.email) {
        userProfileData.email = data.email;
      }
      
      // Update user profile if needed
      if (Object.keys(userProfileData).length > 0) {
        await api.patch(`/users/${userId}`, userProfileData);
      }
      
      // Create a user settings object with the phone explicitly included
      const userSettingsData: any = {
        phone: data.phone,  // Explicitly include phone whether it's empty or not
        title: data.title,
        company: data.company,
        bio: data.bio,
        timezone: data.timezone,
        language: data.language,
        theme: data.theme
      };
      
      // Filter out undefined values (but keep empty strings)
      const filteredSettings = Object.fromEntries(
        Object.entries(userSettingsData).filter(([_, v]) => v !== undefined)
      );
      
      // Only make the API call if there are fields to update
      if (Object.keys(filteredSettings).length > 0) {
        console.log("Updating user settings with:", JSON.stringify(filteredSettings));
        await api.patch('/settings/user', filteredSettings);
      }
      
      // Return the combined updated data
      return await SettingsService.getUserSettings();
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },
  
  // Notification Settings
  getNotificationSettings: async (): Promise<NotificationSettingsData> => {
    try {
      const response = await api.get('/settings/notifications');
      return response.data;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw error;
    }
  },
  
  updateNotificationSettings: async (data: NotificationSettingsData): Promise<NotificationSettingsData> => {
    try {
      const response = await api.patch('/settings/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },
  
  // Integration Settings
  getIntegrationSettings: async (): Promise<IntegrationSettingsData> => {
    try {
      const response = await api.get('/settings/integrations');
      return response.data;
    } catch (error) {
      console.error('Error getting integration settings:', error);
      throw error;
    }
  },
  
  updateIntegrationSettings: async (data: IntegrationSettingsData): Promise<IntegrationSettingsData> => {
    try {
      const response = await api.patch('/settings/integrations', data);
      return response.data;
    } catch (error) {
      console.error('Error updating integration settings:', error);
      throw error;
    }
  },
  
  // App Settings
  getAppSettings: async (): Promise<AppSettingsData> => {
    try {
      const response = await api.get('/settings/app');
      return response.data;
    } catch (error) {
      console.error('Error getting app settings:', error);
      throw error;
    }
  },
  
  updateAppSettings: async (data: AppSettingsData): Promise<AppSettingsData> => {
    try {
      const response = await api.patch('/settings/app', data);
      return response.data;
    } catch (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
  },

  // Team Members
  getTeamMembers: async (): Promise<Array<{id: string, name: string, email: string, role: string}>> => {
    try {
      // Get the current team ID - for now we'll assume there's only one team
      // In a real app, you might need to fetch the current team ID from somewhere
      const teamsResponse = await api.get('/teams');
      const teams = teamsResponse.data;
      
      if (teams.length === 0) {
        return [];
      }
      
      // Use the first team's ID to fetch its members
      const teamId = teams[0].id;
      const response = await api.get(`/teams/${teamId}/members`);
      
      // Transform the data to match what the Settings component expects
      return response.data.map(member => ({
        id: member.id,
        name: `${member.user.firstName} ${member.user.lastName}`,
        email: member.user.email,
        role: member.role
      }));
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  },

  updateTeamMember: async (id: string, data: {role: string}): Promise<{id: string, name: string, email: string, role: string}> => {
    try {
      const response = await api.patch(`/teams/members/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  removeTeamMember: async (id: string): Promise<void> => {
    try {
      await api.delete(`/teams/members/${id}`);
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }
};

export default SettingsService;