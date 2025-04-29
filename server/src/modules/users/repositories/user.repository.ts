import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.find({ where: { isActive: true } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.find({ where: { role } });
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.email LIKE :query', { query: `%${query}%` })
      .orWhere('user.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName LIKE :query', { query: `%${query}%` })
      .getMany();
  }
}