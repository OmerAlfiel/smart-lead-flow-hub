// server/src/modules/email-templates/email-templates.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate, EmailTemplateType } from './entities/email-template.entity';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { EmailTemplateRepository } from './repositories/email-template.repository';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplatesRepository: Repository<EmailTemplate>,
    private emailTemplateRepository: EmailTemplateRepository,
  ) {}

  async create(createEmailTemplateDto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    const template = this.emailTemplatesRepository.create(createEmailTemplateDto);
    return this.emailTemplatesRepository.save(template);
  }

  async findAll(): Promise<EmailTemplate[]> {
    return this.emailTemplatesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllActive(): Promise<EmailTemplate[]> {
    return this.emailTemplateRepository.findActiveTemplates();
  }

  async findByType(type: EmailTemplateType): Promise<EmailTemplate[]> {
    return this.emailTemplateRepository.findByType(type);
  }

  async findOne(id: string): Promise<EmailTemplate> {
    const template = await this.emailTemplatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Email template with ID ${id} not found`);
    }
    return template;
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    const template = await this.findOne(id);
    
    // Update template properties
    Object.assign(template, updateEmailTemplateDto);
    
    return this.emailTemplatesRepository.save(template);
  }

  async remove(id: string): Promise<void> {
    const template = await this.findOne(id);
    await this.emailTemplatesRepository.softRemove(template);
  }

  async renderTemplate(templateId: string, data: Record<string, any>): Promise<{ subject: string; content: string; htmlContent?: string }> {
    const template = await this.findOne(templateId);
    
    // Simple template rendering using variable replacement
    let renderedContent = template.content;
    let renderedHtmlContent = template.htmlContent;
    
    // Replace variables in the content
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      renderedContent = renderedContent.replace(regex, data[key]);
      
      if (renderedHtmlContent) {
        renderedHtmlContent = renderedHtmlContent.replace(regex, data[key]);
      }
    });
    
    return {
      subject: template.subject,
      content: renderedContent,
      htmlContent: renderedHtmlContent,
    };
  }
}