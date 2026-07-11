import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export const COMMENT_TYPES = ['PUBLIC', 'PRIVATE', 'INTERNAL'] as const;
export type CommentType = (typeof COMMENT_TYPES)[number];

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a comment on the ticket',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Type of comment (PUBLIC, PRIVATE, INTERNAL)',
    example: 'PUBLIC',
    enum: COMMENT_TYPES,
  })
  @IsOptional()
  @IsString()
  @IsIn(COMMENT_TYPES)
  type?: CommentType;

  @ApiProperty({
    description: 'ID of the ticket',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({
    description: 'ID of the user creating the comment',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
