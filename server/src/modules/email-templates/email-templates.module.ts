// server/src/modules/email-templates/email-templates.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplate } from './entities/email-template.entity';
import { EmailTemplateRepository } from './repositories/email-template.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesService, EmailTemplateRepository],
  exports: [EmailTemplatesService],
})
export class EmailTemplatesModule {}