import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'All comments retrieved successfully',
  })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Get all comments for a ticket' })
  @ApiResponse({
    status: 200,
    description: 'Comments for ticket retrieved successfully',
  })
  findByTicket(
    @Param('ticketId', new ParseUUIDPipe()) ticketId: string,
  ) {
    return this.commentsService.findByTicket(ticketId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.remove(id);
  }
}
