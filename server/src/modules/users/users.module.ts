import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserSettings } from './entities/user-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSettings])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}