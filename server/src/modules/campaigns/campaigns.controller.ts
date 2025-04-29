import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Campaign } from './entities/campaign.entity';

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns' })
  async findAll(@Query('status') status?: string): Promise<Campaign[]> {
    return this.campaignsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by id' })
  @ApiResponse({ status: 200, description: 'Return the campaign' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully' })
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}