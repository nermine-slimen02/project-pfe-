import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Get audit history for a ticket' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID to query audit logs for' })
  @ApiResponse({ status: 200, description: 'Audit history retrieved successfully.', type: [AuditLogResponseDto] })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  findByTicketId(@Param('ticketId', new ParseUUIDPipe()) ticketId: string) {
    return this.auditLogsService.findByTicketId(ticketId);
  }
}
