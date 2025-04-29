import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailIntegrationProvider } from './providers/email-integration.provider';
import { CrmIntegrationProvider } from './providers/crm-integration.provider';
import { ConfigureIntegrationDto } from './dto/configure-integration.dto';


@Injectable()
export class IntegrationsService {
  constructor(
    private emailIntegrationProvider: EmailIntegrationProvider,
    private crmIntegrationProvider: CrmIntegrationProvider,
  ) {}

  getAvailableIntegrations() {
    return [
      {
        type: 'email',
        name: 'Email Marketing',
        description: 'Integrate with email marketing platforms',
        providers: ['mailchimp', 'sendgrid', 'mailgun'],
        isConfigured: this.emailIntegrationProvider.isConfigured(),
      },
      {
        type: 'crm',
        name: 'CRM Systems',
        description: 'Integrate with CRM systems',
        providers: ['salesforce', 'hubspot', 'zoho'],
        isConfigured: this.crmIntegrationProvider.isConfigured(),
      },
    ];
  }

  configureIntegration(type: string, configureIntegrationDto: ConfigureIntegrationDto) {
    switch (type) {
      case 'email':
        return this.emailIntegrationProvider.configure(configureIntegrationDto);
      case 'crm':
        return this.crmIntegrationProvider.configure(configureIntegrationDto);
      default:
        throw new NotFoundException(`Integration type ${type} not found`);
    }
  }

  testIntegration(type: string) {
    switch (type) {
      case 'email':
        return this.emailIntegrationProvider.testConnection();
      case 'crm':
        return this.crmIntegrationProvider.testConnection();
      default:
        throw new NotFoundException(`Integration type ${type} not found`);
    }
  }

  syncWithIntegration(type: string) {
    switch (type) {
      case 'email':
        return this.emailIntegrationProvider.syncData();
      case 'crm':
        return this.crmIntegrationProvider.syncData();
      default:
        throw new NotFoundException(`Integration type ${type} not found`);
    }
  }

  removeIntegration(type: string) {
    switch (type) {
      case 'email':
        return this.emailIntegrationProvider.removeConfiguration();
      case 'crm':
        return this.crmIntegrationProvider.removeConfiguration();
      default:
        throw new NotFoundException(`Integration type ${type} not found`);
    }
  }
}