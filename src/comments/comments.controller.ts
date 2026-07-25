import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  create(@Body() dto: CreateCommentDto, @CurrentUser() currentUser) {
    return this.commentsService.create(dto, currentUser);
  }

  @Get()
  @Roles('TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'All comments retrieved successfully',
    type: [CommentResponseDto],
  })
  findAll(@CurrentUser() currentUser) {
    return this.commentsService.findAll(currentUser);
  }

  @Get('ticket/:ticketId')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comments for a ticket' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID to fetch comments for' })
  @ApiResponse({
    status: 200,
    description: 'Comments for ticket retrieved successfully',
    type: [CommentResponseDto],
  })
  findByTicket(
    @Param('ticketId', new ParseUUIDPipe()) ticketId: string,
    @CurrentUser() currentUser,
  ) {
    return this.commentsService.findByTicket(ticketId, currentUser);
  }

  @Get(':id')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment retrieved successfully',
    type: CommentResponseDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser,
  ) {
    return this.commentsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles('TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentsService.remove(id);
  }
}
