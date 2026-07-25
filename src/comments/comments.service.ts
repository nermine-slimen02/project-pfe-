import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(data: CreateCommentDto, currentUser: { id: string; role: string }) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: data.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const createdComment = await this.prisma.comment.create({
      data: {
        content: data.content,
        type: data.type ?? 'PUBLIC',
        ticketId: data.ticketId,
        userId: currentUser.id,
      },
      include: {
        user: true,
        ticket: true,
      },
    });

    if (createdComment.type === 'INTERNAL') {
      if (ticket.assignedToId) {
        await this.notificationsService.create({
          userId: ticket.assignedToId,
          ticketId: ticket.id,
          message: `Internal comment added to ticket "${ticket.title}".`,
          type: 'INFO',
        });
      }
    } else {
      await this.notificationsService.create({
        userId: ticket.userId,
        ticketId: ticket.id,
        message: `A new comment was added to your ticket "${ticket.title}".`,
        type: 'INFO',
      });
    }

    return createdComment;
  }

  async findAll(user: { id: string; role: string }) {
    const filter = user.role === 'USER' ? { type: { not: 'INTERNAL' } } : {};

    return this.prisma.comment.findMany({
      where: filter,
      include: {
        user: true,
        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTicket(ticketId: string, user: { id: string; role: string }) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const filter = user.role === 'USER'
      ? { ticketId, type: { not: 'INTERNAL' } }
      : { ticketId };

    return this.prisma.comment.findMany({
      where: filter,
      include: {
        user: true,
        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, user: { id: string; role: string }) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
        ticket: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (user.role === 'USER' && comment.type === 'INTERNAL') {
      throw new ForbiddenException('Insufficient permissions to view this comment');
    }

    return comment;
  }

  async update(id: string, data: UpdateCommentDto) {
    const comment = await this.findOne(id, { id: '', role: 'ADMIN' });

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: data.content ?? comment.content,
        type: data.type ?? comment.type,
      },
      include: {
        user: true,
        ticket: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id, { id: '', role: 'ADMIN' });

    return this.prisma.comment.delete({
      where: { id },
      include: {
        user: true,
        ticket: true,
      },
    });
  }
}
