// server/src/modules/leads/leads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { LeadRepository } from './repositories/lead.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  controllers: [LeadsController],
  providers: [LeadsService, LeadRepository],
  exports: [LeadsService, LeadRepository],
})
export class LeadsModule {}