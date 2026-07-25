import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private async getTicketsByGroup(groupByField: string) {
    const results = await this.prisma.ticket.groupBy({
      by: [groupByField as any],
      _count: {
        id: true,
      },
    });

    return results.map((row) => ({
      key: row[groupByField as keyof typeof row] as string,
      count: row._count.id,
    }));
  }

  async getStats(): Promise<DashboardStatsDto> {
    const totalTickets = await this.prisma.ticket.count();
    const openTickets = await this.prisma.ticket.count({ where: { status: 'OPEN' } });
    const resolvedTickets = await this.prisma.ticket.count({ where: { status: 'RESOLVED' } });
    const lateTickets = await this.prisma.ticket.count({ where: { isLate: true } });
    const criticalTickets = await this.prisma.ticket.count({ where: { priority: 'CRITICAL' } });

    const ticketsByStatus = await this.getTicketsByGroup('status');
    const ticketsByPriority = await this.getTicketsByGroup('priority');

    const ticketsByTechnician = await this.prisma.ticket.groupBy({
      by: ['assignedToId'],
      where: {
        assignedToId: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
    });

    const technicianCounts = await Promise.all(
      ticketsByTechnician.map(async (row) => {
        const user = await this.prisma.user.findUnique({
          where: { id: row.assignedToId as string },
          select: { id: true, email: true },
        });
        return {
          technicianId: row.assignedToId as string,
          technicianEmail: user?.email ?? 'Unknown',
          count: row._count.id,
        };
      }),
    );

    const resolvedTicketsList = await this.prisma.ticket.findMany({
      where: { status: 'RESOLVED' },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const averageResolutionTime = resolvedTicketsList.length
      ? resolvedTicketsList.reduce((acc, ticket) => acc + (ticket.updatedAt.getTime() - ticket.createdAt.getTime()), 0) /
        resolvedTicketsList.length /
        1000 /
        60
      : 0;

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      lateTickets,
      criticalTickets,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByTechnician: technicianCounts,
      averageResolutionTime,
    };
  }
}
