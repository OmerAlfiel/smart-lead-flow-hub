// server/src/modules/files/repositories/file.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository extends Repository<File> {
  constructor(private dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }

  async findByEntity(type: string, entityId: string): Promise<File[]> {
    return this.createQueryBuilder('file')
      .where('file.type = :type', { type })
      .andWhere('file.entityId = :entityId', { entityId })
      .orderBy('file.createdAt', 'DESC')
      .getMany();
  }
}