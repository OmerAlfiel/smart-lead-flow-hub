import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { ConfigureIntegrationDto } from './dto/configure-integration.dto';


@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available integrations' })
  @ApiResponse({ status: 200, description: 'Return all available integrations' })
  getAvailableIntegrations() {
    return this.integrationsService.getAvailableIntegrations();
  }

  @Post(':type/configure')
  @ApiOperation({ summary: 'Configure an integration' })
  @ApiResponse({ status: 200, description: 'Integration configured successfully' })
  configureIntegration(
    @Param('type') type: string,
    @Body() configureIntegrationDto: ConfigureIntegrationDto,
  ) {
    return this.integrationsService.configureIntegration(type, configureIntegrationDto);
  }

  @Post(':type/test')
  @ApiOperation({ summary: 'Test an integration connection' })
  @ApiResponse({ status: 200, description: 'Integration test result' })
  testIntegration(@Param('type') type: string) {
    return this.integrationsService.testIntegration(type);
  }

  @Post(':type/sync')
  @ApiOperation({ summary: 'Sync data with an integration' })
  @ApiResponse({ status: 200, description: 'Data synced successfully' })
  syncWithIntegration(@Param('type') type: string) {
    return this.integrationsService.syncWithIntegration(type);
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Remove an integration' })
  @ApiResponse({ status: 200, description: 'Integration removed successfully' })
  removeIntegration(@Param('type') type: string) {
    return this.integrationsService.removeIntegration(type);
  }
}