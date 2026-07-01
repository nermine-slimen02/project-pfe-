import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';
import type { TicketPriority, TicketStatus } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
	@IsOptional()
	@IsString()
	@IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
	status?: TicketStatus;

	@IsOptional()
	@IsString()
	@IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
	priority?: TicketPriority;

	@IsOptional()
	@IsString()
	slaDeadline?: string;

	@IsOptional()
	@IsString()
	assignedToId?: string;
}
