// server/src/modules/files/files.controller.ts
import { Controller, Get, Post, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query, Res, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'The file has been successfully uploaded.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['avatar', 'lead', 'document'],
          default: 'document',
        },
        entityId: {
          type: 'string',
          nullable: true,
        },
        userId: {
          type: 'string',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string = 'document',
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.filesService.uploadFile(file, type, entityId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata by ID' })
  @ApiResponse({ status: 200, description: 'Return the file metadata.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiParam({ name: 'id', description: 'ID of the file' })
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({ status: 200, description: 'Return the file stream.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiParam({ name: 'id', description: 'ID of the file' })
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file = await this.filesService.findOne(id);
    const fileStream = createReadStream(join(process.cwd(), file.path));
    
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });
    
    return new StreamableFile(fileStream);
  }

  @Get('entity/:type/:entityId')
  @ApiOperation({ summary: 'Get files by entity' })
  @ApiResponse({ status: 200, description: 'Return files for the entity.' })
  @ApiParam({ name: 'type', description: 'Type of the entity (avatar, lead, document)' })
  @ApiParam({ name: 'entityId', description: 'ID of the entity' })
  findByEntity(@Param('type') type: string, @Param('entityId') entityId: string) {
    return this.filesService.findByEntity(type, entityId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'The file has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiParam({ name: 'id', description: 'ID of the file' })
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}