import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: 'This is a comment on the ticket' })
  content: string;

  @ApiProperty({ example: 'PUBLIC' })
  type: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  ticketId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;

  @ApiProperty({ example: '2026-07-23T12:34:56.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-23T12:34:56.000Z' })
  updatedAt: Date;
}
