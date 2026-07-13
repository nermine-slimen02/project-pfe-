import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { NOTIFICATION_TYPES } from './create-notification.dto';
import type { NotificationType } from './create-notification.dto';

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'Updated notification message',
    example: 'Your ticket status has changed',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: 'Updated notification type (INFO, WARNING, ERROR, SUCCESS)',
    example: 'WARNING',
    enum: NOTIFICATION_TYPES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(NOTIFICATION_TYPES)
  type?: NotificationType;

  @ApiProperty({
    description: 'Mark notification as read/unread',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
