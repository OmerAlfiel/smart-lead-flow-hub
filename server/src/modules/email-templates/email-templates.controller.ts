// server/src/modules/email-templates/email-templates.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EmailTemplateType } from './entities/email-template.entity';

@ApiTags('email-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new email template' })
  @ApiResponse({ status: 201, description: 'The email template has been successfully created.' })
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailTemplatesService.create(createEmailTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all email templates' })
  @ApiResponse({ status: 200, description: 'Return all email templates.' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  findAll(@Query('active') active?: boolean) {
    if (active === true || active === 'true') {
      return this.emailTemplatesService.findAllActive();
    }
    return this.emailTemplatesService.findAll();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get email templates by type' })
  @ApiResponse({ status: 200, description: 'Return email templates of specified type.' })
  @ApiParam({ name: 'type', enum: EmailTemplateType, description: 'Type of email template' })
  findByType(@Param('type') type: EmailTemplateType) {
    return this.emailTemplatesService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an email template by ID' })
  @ApiResponse({ status: 200, description: 'Return the email template.' })
  @ApiResponse({ status: 404, description: 'Email template not found.' })
  @ApiParam({ name: 'id', description: 'ID of the email template' })
  findOne(@Param('id') id: string) {
    return this.emailTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an email template' })
  @ApiResponse({ status: 200, description: 'The email template has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Email template not found.' })
  @ApiParam({ name: 'id', description: 'ID of the email template' })
  update(@Param('id') id: string, @Body() updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return this.emailTemplatesService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an email template' })
  @ApiResponse({ status: 200, description: 'The email template has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Email template not found.' })
  @ApiParam({ name: 'id', description: 'ID of the email template' })
  remove(@Param('id') id: string) {
    return this.emailTemplatesService.remove(id);
  }

  @Post(':id/render')
  @ApiOperation({ summary: 'Render an email template with provided data' })
  @ApiResponse({ status: 200, description: 'Return the rendered email template.' })
  @ApiResponse({ status: 404, description: 'Email template not found.' })
  @ApiParam({ name: 'id', description: 'ID of the email template' })
  renderTemplate(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.emailTemplatesService.renderTemplate(id, data);
  }
}