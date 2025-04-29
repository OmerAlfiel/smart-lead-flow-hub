// server/src/modules/files/files.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entities/file.entity';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileRepository } from './repository/file.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FileRepository],
  exports: [FilesService],
})
export class FilesModule {}