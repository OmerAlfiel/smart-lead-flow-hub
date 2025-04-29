// server/src/modules/email-templates/repositories/email-template.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EmailTemplate, EmailTemplateType } from '../entities/email-template.entity';

@Injectable()
export class EmailTemplateRepository extends Repository<EmailTemplate> {
  constructor(private dataSource: DataSource) {
    super(EmailTemplate, dataSource.createEntityManager());
  }

  async findByType(type: EmailTemplateType): Promise<EmailTemplate[]> {
    return this.createQueryBuilder('template')
      .where('template.type = :type', { type })
      .andWhere('template.isActive = :isActive', { isActive: true })
      .orderBy('template.createdAt', 'DESC')
      .getMany();
  }

  async findActiveTemplates(): Promise<EmailTemplate[]> {
    return this.createQueryBuilder('template')
      .where('template.isActive = :isActive', { isActive: true })
      .orderBy('template.name', 'ASC')
      .getMany();
  }
}