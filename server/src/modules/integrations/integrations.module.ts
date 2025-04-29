// server/src/modules/integrations/integrations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { EmailIntegrationProvider } from './providers/email-integration.provider';
import { CrmIntegrationProvider } from './providers/crm-integration.provider';
import { GoogleIntegrationProvider } from './providers/google-integration.provider';


import { HubspotIntegrationProvider } from './providers/hubspot-integration.provider';

import { Integration } from './entity/integration.entity';
import { IntegrationRepository } from './repository/integration.repository';
import { ZoomIntegrationProvider } from './providers/zoom-integration.provider';
import { Office365IntegrationProvider } from './providers/office365-integration.provider';
import { SlackIntegrationProvider } from './providers/slack-integration.provider';
import { SalesforceIntegrationProvider } from './providers/salesforce-integration.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    EmailIntegrationProvider,
    CrmIntegrationProvider,
    GoogleIntegrationProvider,
    HubspotIntegrationProvider,
    IntegrationRepository,
    ZoomIntegrationProvider,
    Office365IntegrationProvider,
    SlackIntegrationProvider,
    SalesforceIntegrationProvider,
  ],
  exports: [
    IntegrationsService,
    EmailIntegrationProvider,
    CrmIntegrationProvider,
    GoogleIntegrationProvider,
    HubspotIntegrationProvider,
    ZoomIntegrationProvider,
    Office365IntegrationProvider,
    SlackIntegrationProvider,
    SalesforceIntegrationProvider,
  ],
})
export class IntegrationsModule {}