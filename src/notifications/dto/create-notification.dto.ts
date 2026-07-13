import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsUUID } from 'class-validator';

export const NOTIFICATION_TYPES = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification message content',
    example: 'Your ticket has been assigned',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Type of notification (INFO, WARNING, ERROR, SUCCESS)',
    example: 'INFO',
    enum: NOTIFICATION_TYPES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(NOTIFICATION_TYPES)
  type?: NotificationType;

  @ApiProperty({
    description: 'User ID who receives the notification',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Associated ticket ID (optional)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID('4')
  ticketId?: string;
}
