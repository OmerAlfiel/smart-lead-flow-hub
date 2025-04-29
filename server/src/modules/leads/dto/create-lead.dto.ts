import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Acme Inc.' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Interested in our enterprise plan' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'new', enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] })
  @IsOptional()
  @IsEnum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'])
  status?: string;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: { source: 'website', campaign: 'spring_promo' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}