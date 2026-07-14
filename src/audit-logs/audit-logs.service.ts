import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogInput {
  action: string;
  ticketId: string;
  userId: string;
  oldValue?: string | null;
  newValue?: string | null;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

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

  async logAction(input: CreateAuditLogInput) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          action: input.action,
          oldValue: input.oldValue ?? null,
          newValue: input.newValue ?? null,
          ticketId: input.ticketId,
          userId: input.userId,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${this.getErrorMessage(error)}`);
      throw new InternalServerErrorException(
        `Failed to create audit log: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async findByTicketId(ticketId: string) {
    try {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
      }

      const logs = await this.prisma.auditLog.findMany({
        where: { ticketId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return logs;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Failed to fetch audit logs: ${this.getErrorMessage(error)}`);
      throw new InternalServerErrorException(
        `Failed to get audit logs: ${this.getErrorMessage(error)}`,
      );
    }
  }
}