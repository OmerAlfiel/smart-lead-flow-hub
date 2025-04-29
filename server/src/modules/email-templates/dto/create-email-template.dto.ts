// server/src/modules/email-templates/dto/create-email-template.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmailTemplateType } from '../entities/email-template.entity';

export class CreateEmailTemplateDto {
  @ApiProperty({ example: 'Welcome Email' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: EmailTemplateType, example: EmailTemplateType.NEW_LEAD })
  @IsNotEmpty()
  @IsEnum(EmailTemplateType)
  type: EmailTemplateType;

  @ApiProperty({ example: 'Welcome to our platform!' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Hello {{name}}, welcome to our platform!' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '<h1>Hello {{name}}</h1><p>Welcome to our platform!</p>', required: false })
  @IsOptional()
  @IsString()
  htmlContent?: string;

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'Template used for welcoming new users', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: { name: 'User name', company: 'Company name' },
    description: 'Variables that can be used in the template',
    required: false
  })
  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;
}