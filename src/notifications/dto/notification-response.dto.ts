import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ example: 'd3c8bf57-3d7e-4bcc-9a25-c743f4c1d90f' })
  id: string;

  @ApiProperty({ example: 'Your ticket has been updated.' })
  message: string;

  @ApiProperty({ example: 'INFO' })
  type: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', required: false })
  ticketId?: string;

  @ApiProperty({ example: '2026-07-23T12:34:56.000Z' })
  createdAt: Date;
}
