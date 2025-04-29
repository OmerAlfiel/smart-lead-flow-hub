// server/src/modules/integrations/repositories/integration.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Integration } from '../entity/integration.entity';


@Injectable()
export class IntegrationRepository extends Repository<Integration> {
  constructor(private dataSource: DataSource) {
    super(Integration, dataSource.createEntityManager());
  }

  async findByUser(userId: string): Promise<Integration[]> {
    return this.createQueryBuilder('integration')
      .leftJoinAndSelect('integration.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findByUserAndProvider(userId: string, provider: string): Promise<Integration> {
    return this.createQueryBuilder('integration')
      .leftJoinAndSelect('integration.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('integration.provider = :provider', { provider })
      .getOne();
  }

  async findActiveByUser(userId: string): Promise<Integration[]> {
    return this.createQueryBuilder('integration')
      .leftJoinAndSelect('integration.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('integration.isActive = :isActive', { isActive: true })
      .getMany();
  }
}