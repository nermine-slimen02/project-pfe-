import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        type: data.type ?? 'PUBLIC',
        ticketId: data.ticketId,
        userId: data.userId,
      },
      include: {
        user: true,
        ticket: true,
      },
    });
  }

  async findAll() {
    return this.prisma.comment.findMany({
      include: {
        user: true,
        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByTicket(ticketId: string) {
    return this.prisma.comment.findMany({
      where: {
        ticketId,
      },
      include: {
        user: true,
        ticket: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
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

    return comment;
  }

  async update(id: string, data: UpdateCommentDto) {
    const comment = await this.findOne(id);

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
    await this.findOne(id);

    return this.prisma.comment.delete({
      where: { id },
      include: {
        user: true,
        ticket: true,
      },
    });
  }
}
