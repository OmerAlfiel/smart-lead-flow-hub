// server/src/modules/settings/dto/update-notification-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailNewLead?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailLeadUpdate?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailTaskReminders?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailReports?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  pushNewLead?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  pushLeadUpdate?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  pushTaskReminders?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  pushReports?: boolean;
}