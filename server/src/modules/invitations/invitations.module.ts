// server/src/modules/invitations/invitations.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { Invitation } from './entities/invitation.entity';
import { AuthModule } from '../auth/auth.module';
import { InvitationRepository } from './repositories/invitation.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    forwardRef(() => AuthModule) // Use forwardRef to resolve circular dependency
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService, InvitationRepository],
  exports: [InvitationsService]
})
export class InvitationsModule {}