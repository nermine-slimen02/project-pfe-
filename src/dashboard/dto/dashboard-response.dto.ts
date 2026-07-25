import { ApiProperty } from '@nestjs/swagger';

export class TicketGroupDto {
  @ApiProperty({ description: 'Group key', example: 'OPEN' })
  key: string;

  @ApiProperty({ description: 'Count of tickets in this group', example: 12 })
  count: number;
}

export class TechnicianTicketDto {
  @ApiProperty({ description: 'Technician user ID', example: '550e8400-e29b-41d4-a716-446655440001' })
  technicianId: string;

  @ApiProperty({ description: 'Technician email', example: 'tech@example.com' })
  technicianEmail: string;

  @ApiProperty({ description: 'Count of tickets assigned', example: 7 })
  count: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 120 })
  totalTickets: number;

  @ApiProperty({ example: 40 })
  openTickets: number;

  @ApiProperty({ example: 60 })
  resolvedTickets: number;

  @ApiProperty({ example: 15 })
  lateTickets: number;

  @ApiProperty({ example: 30 })
  criticalTickets: number;

  @ApiProperty({ type: [TicketGroupDto] })
  ticketsByStatus: TicketGroupDto[];

  @ApiProperty({ type: [TicketGroupDto] })
  ticketsByPriority: TicketGroupDto[];

  @ApiProperty({ type: [TechnicianTicketDto] })
  ticketsByTechnician: TechnicianTicketDto[];

  @ApiProperty({ description: 'Average resolution time in minutes', example: 135 })
  averageResolutionTime: number;
}
