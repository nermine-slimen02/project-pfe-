import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import { COMMENT_TYPES } from './create-comment.dto';
import type { CommentType } from './create-comment.dto';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated content of the comment',
    example: 'This is an updated comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Updated type of comment (PUBLIC, PRIVATE, INTERNAL)',
    example: 'PRIVATE',
    enum: COMMENT_TYPES,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(COMMENT_TYPES)
  type?: CommentType;
}
