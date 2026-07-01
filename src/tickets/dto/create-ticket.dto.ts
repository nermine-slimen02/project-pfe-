import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export class CreateTicketDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsOptional()
	@IsString()
	@IsIn(TICKET_STATUSES)
	status?: TicketStatus;

	@IsOptional()
	@IsString()
	@IsIn(TICKET_PRIORITIES)
	priority?: TicketPriority;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
