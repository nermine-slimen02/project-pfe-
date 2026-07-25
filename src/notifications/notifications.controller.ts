import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UsePipes,
  UseGuards,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: NotificationResponseDto,
  })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  @Roles('SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'All notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiParam({ name: 'userId', description: 'User ID to filter notifications' })
  @ApiResponse({
    status: 200,
    description: 'User notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  findByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @CurrentUser() currentUser,
  ) {
    if (currentUser.role === 'USER' && currentUser.id !== userId) {
      throw new ForbiddenException('Insufficient permissions to view this users notifications');
    }
    return this.notificationsService.findByUser(userId);
  }

  @Get('user/:userId/unread-count')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiParam({ name: 'userId', description: 'User ID to get unread notification count for' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        unreadCount: { type: 'number', example: 5 },
      },
    },
  })
  getUnreadCount(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @CurrentUser() currentUser,
  ) {
    if (currentUser.role === 'USER' && currentUser.id !== userId) {
      throw new ForbiddenException('Insufficient permissions to view this users unread count');
    }
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
    type: NotificationResponseDto,
  })
  async markAsRead(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser,
  ) {
    const notification = await this.notificationsService.findOne(id);
    if (currentUser.role === 'USER' && notification.userId !== currentUser.id) {
      throw new ForbiddenException('Insufficient permissions to mark this notification as read');
    }
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id')
  @Roles('SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: NotificationResponseDto,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationsService.remove(id);
  }
}
