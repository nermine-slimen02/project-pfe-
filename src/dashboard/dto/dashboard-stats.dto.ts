import { ApiProperty } from '@nestjs/swagger';

export class TicketGroupCountDto {
  @ApiProperty({ description: 'Group key', example: 'OPEN' })
  key: string;

  @ApiProperty({ description: 'Count of tickets in this group', example: 12 })
  count: number;
}

export class TechnicianTicketCountDto {
  @ApiProperty({ description: 'Technician user ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  technicianId: string;

  @ApiProperty({ description: 'Technician email', example: 'tech@example.com' })
  technicianEmail: string;

  @ApiProperty({ description: 'Count of tickets assigned to the technician', example: 5 })
  count: number;
}

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of tickets', example: 123 })
  totalTickets: number;

  @ApiProperty({ description: 'Number of open tickets', example: 45 })
  openTickets: number;

  @ApiProperty({ description: 'Number of resolved tickets', example: 60 })
  resolvedTickets: number;

  @ApiProperty({ description: 'Number of late tickets', example: 18 })
  lateTickets: number;

  @ApiProperty({ description: 'Number of critical tickets', example: 20 })
  criticalTickets: number;

  @ApiProperty({ type: [TicketGroupCountDto] })
  ticketsByStatus: TicketGroupCountDto[];

  @ApiProperty({ type: [TicketGroupCountDto] })
  ticketsByPriority: TicketGroupCountDto[];

  @ApiProperty({ type: [TechnicianTicketCountDto] })
  ticketsByTechnician: TechnicianTicketCountDto[];

  @ApiProperty({ description: 'Average resolution time in minutes', example: 120 })
  averageResolutionTime: number;
}
