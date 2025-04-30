// server/src/modules/leads/leads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { LeadRepository } from './repositories/lead.repository';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, User]),
    UsersModule,
    NotesModule
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadRepository],
  exports: [LeadsService, LeadRepository],
})
export class LeadsModule {}