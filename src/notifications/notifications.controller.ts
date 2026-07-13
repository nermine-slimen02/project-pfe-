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
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'All notifications retrieved successfully',
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiResponse({
    status: 200,
    description: 'User notifications retrieved successfully',
  })
  findByUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
  })
  getUnreadCount(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
  })
  markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationsService.remove(id);
  }
}
