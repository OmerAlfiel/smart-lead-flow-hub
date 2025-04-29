import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
};