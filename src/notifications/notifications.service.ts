import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return JSON.stringify(error);
  }

  private isPrismaRelationError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const code = (error as { code?: string }).code;
    return code === 'P2003' || code === 'P2016' || code === 'P2025';
  }

  private getNotificationInclude() {
    return {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      ticket: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    };
  }

  async create(data: CreateNotificationDto) {
  try {
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new BadRequestException(
        `User with ID ${data.userId} not found`,
      );
    }

    if (data.ticketId) {
      const ticketExists = await this.prisma.ticket.findUnique({
        where: { id: data.ticketId },
      });

      if (!ticketExists) {
        throw new BadRequestException(
          `Ticket with ID ${data.ticketId} not found`,
        );
      }
    }

    return await this.prisma.notification.create({
      data: {
        message: data.message,
        type: data.type ?? 'INFO',
        userId: data.userId,
        ticketId: data.ticketId ?? null,
      },
      include: {
        user: true,
        ticket: true,
      },
    });
  } catch (error) {
    this.logger.error(
      `Failed to create notification: ${this.getErrorMessage(error)}`,
      error instanceof Error ? error.stack : undefined,
    );

    if (error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(
      `Failed to create notification: ${this.getErrorMessage(error)}`,
    );
  }
}

  async findAll() {
    try {
      return await this.prisma.notification.findMany({
        include: this.getNotificationInclude(),
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch notifications: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to fetch notifications: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async findByUser(userId: string) {
    try {
      return await this.prisma.notification.findMany({
        where: {
          userId,
        },
        include: this.getNotificationInclude(),
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch user notifications: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to fetch user notifications: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
        include: this.getNotificationInclude(),
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch notification: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to fetch notification: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async markAsRead(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
        },
        include: this.getNotificationInclude(),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to mark notification as read: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to mark notification as read: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async getUnreadCount(userId: string) {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      return { userId, unreadCount: count };
    } catch (error) {
      this.logger.error(
        `Failed to get unread count: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to get unread count: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async update(id: string, data: UpdateNotificationDto) {
    try {
      const notification = await this.findOne(id);

      return await this.prisma.notification.update({
        where: { id },
        data: {
          message: data.message ?? notification.message,
          type: data.type ?? notification.type,
          isRead: data.isRead ?? notification.isRead,
        },
        include: this.getNotificationInclude(),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update notification: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to update notification: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.notification.delete({
        where: { id },
        include: this.getNotificationInclude(),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete notification: ${this.getErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        `Failed to delete notification: ${this.getErrorMessage(error)}`,
      );
    }
  }
}
