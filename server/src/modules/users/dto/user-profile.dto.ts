// server/src/modules/users/dto/user-profile.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserProfileDto {
  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: 'agent', enum: ['admin', 'manager', 'agent'] })
  role: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}