// server/src/modules/files/files.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileRepository } from './repository/file.repository';


@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private fileRepository: FileRepository,
  ) {}

  async uploadFile(file: Express.Multer.File, type: string, entityId?: string, userId?: string): Promise<File> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(process.cwd(), 'uploads', type);
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Create file record
    const fileEntity = this.filesRepository.create({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `uploads/${type}/${filename}`,
      type,
      entityId,
      uploadedById: userId,
    });
    
    return this.filesRepository.save(fileEntity);
  }

  async findOne(id: string): Promise<File> {
    const file = await this.filesRepository.findOne({ 
      where: { id },
      relations: ['uploadedBy'],
    });
    
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    
    return file;
  }

  async findByEntity(type: string, entityId: string): Promise<File[]> {
    return this.fileRepository.findByEntity(type, entityId);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    
    // Delete file from disk
    const filePath = path.join(process.cwd(), file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await this.filesRepository.remove(file);
  }
}