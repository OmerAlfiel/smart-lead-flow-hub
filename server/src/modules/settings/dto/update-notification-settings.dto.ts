// server/src/modules/settings/dto/update-notification-settings.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsOptional()
  @IsBoolean()
  emailNewLead?: boolean;

  @IsOptional()
  @IsBoolean()
  emailLeadUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  emailTaskReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  emailReports?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNewLead?: boolean;

  @IsOptional()
  @IsBoolean()
  pushLeadUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  pushTaskReminders?: boolean;

  @IsOptional()
  @IsBoolean()
  pushReports?: boolean;
}