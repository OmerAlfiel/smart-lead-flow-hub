import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDatabaseConfig } from '../config/test-database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(testDatabaseConfig),
  ],
})
export class TestDatabaseModule {}