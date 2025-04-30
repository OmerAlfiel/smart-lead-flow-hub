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

export interface IntegrationSettingsData {
  id?: string;
  google: boolean;
  googleConfig?: Record<string, any>;
  office365: boolean;
  office365Config?: Record<string, any>;
  slack: boolean;
  slackConfig?: Record<string, any>;
  zoom: boolean;
  zoomConfig?: Record<string, any>;
  hubspot: boolean;
  hubspotConfig?: Record<string, any>;
  salesforce: boolean;
  salesforceConfig?: Record<string, any>;
}

export interface AppSettingsData {
  id?: string;
  companyName: string;
  companyLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  enableRegistration: boolean;
  invitationExpiryDays: number;
  customFields?: Record<string, any>;
}

const SettingsService = {
  // User Settings
  getUserSettings: async (): Promise<UserSettingsData> => {
    const response = await api.get('/settings/user');
    return response.data;
  },
  
  updateUserSettings: async (data: UserSettingsData): Promise<UserSettingsData> => {
    const response = await api.patch('/settings/user', data);
    return response.data;
  },
  
  // Notification Settings
  getNotificationSettings: async (): Promise<NotificationSettingsData> => {
    const response = await api.get('/settings/notifications');
    return response.data;
  },
  
  updateNotificationSettings: async (data: NotificationSettingsData): Promise<NotificationSettingsData> => {
    const response = await api.patch('/settings/notifications', data);
    return response.data;
  },
  
  // Integration Settings
  getIntegrationSettings: async (): Promise<IntegrationSettingsData> => {
    const response = await api.get('/settings/integrations');
    return response.data;
  },
  
  updateIntegrationSettings: async (data: IntegrationSettingsData): Promise<IntegrationSettingsData> => {
    const response = await api.patch('/settings/integrations', data);
    return response.data;
  },
  
  // App Settings
  getAppSettings: async (): Promise<AppSettingsData> => {
    const response = await api.get('/settings/app');
    return response.data;
  },
  
  updateAppSettings: async (data: AppSettingsData): Promise<AppSettingsData> => {
    const response = await api.patch('/settings/app', data);
    return response.data;
  }
};

export default SettingsService;