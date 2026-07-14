import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly auditLogsService: AuditLogsService,
	) {}

	private computeIsLate(status: string, slaDeadline?: Date | null): boolean {
		if (!slaDeadline) {
			return false;
		}

		return new Date() > slaDeadline && status !== 'RESOLVED';
	}

	async create(data: CreateTicketDto) {
		const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const isLate = this.computeIsLate(data.status ?? 'OPEN', slaDeadline);

		const createdTicket = await this.prisma.ticket.create({
			data: {
				title: data.title,
				description: data.description,
				status: data.status ?? 'OPEN',
				priority: data.priority ?? 'MEDIUM',
				slaDeadline,
				isLate,
				userId: data.userId,
			},
		});

		await this.auditLogsService.logAction({
			action: 'TICKET_CREATED',
			ticketId: createdTicket.id,
			userId: data.userId,
			oldValue: null,
			newValue: `Status: ${createdTicket.status}; Priority: ${createdTicket.priority}`,
		});

		return createdTicket;
	}

	async findAll() {
		const tickets = await this.prisma.ticket.findMany();

		return tickets.map((ticket) => ({
			...ticket,
			isLate: this.computeIsLate(ticket.status, ticket.slaDeadline),
		}));
	}

	async findOne(id: string) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id } });
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}

		return {
			...ticket,
			isLate: this.computeIsLate(ticket.status, ticket.slaDeadline),
		};
	}

	async update(id: string, data: UpdateTicketDto) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id } });
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}

		const nextSlaDeadline = data.slaDeadline
			? new Date(data.slaDeadline)
			: ticket.slaDeadline ?? undefined;

		const updatePayload = {
			...(data.title !== undefined && { title: data.title }),
			...(data.description !== undefined && { description: data.description }),
			...(data.status !== undefined && { status: data.status }),
			...(data.priority !== undefined && { priority: data.priority }),
			...(data.slaDeadline !== undefined && { slaDeadline: nextSlaDeadline }),
			...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
			isLate: this.computeIsLate(data.status ?? ticket.status, nextSlaDeadline),
		};

		const updatedTicket = await this.prisma.ticket.update({
			where: { id },
			data: updatePayload,
		});

		if (data.status !== undefined && data.status !== ticket.status) {
			await this.auditLogsService.logAction({
				action: 'TICKET_STATUS_CHANGED',
				ticketId: id,
				userId: ticket.userId,
				oldValue: ticket.status,
				newValue: data.status,
			});
		}

		if (data.assignedToId !== undefined && data.assignedToId !== ticket.assignedToId) {
			await this.auditLogsService.logAction({
				action: 'TICKET_ASSIGNED',
				ticketId: id,
				userId: ticket.userId,
				oldValue: ticket.assignedToId ?? null,
				newValue: data.assignedToId,
			});
		}

		if (
			(data.title !== undefined && data.title !== ticket.title) ||
			(data.description !== undefined && data.description !== ticket.description) ||
			(data.priority !== undefined && data.priority !== ticket.priority)
		) {
			await this.auditLogsService.logAction({
				action: 'TICKET_UPDATED',
				ticketId: id,
				userId: ticket.userId,
				oldValue: `title:${ticket.title}; description:${ticket.description}; priority:${ticket.priority}`,
				newValue: `title:${updatedTicket.title}; description:${updatedTicket.description}; priority:${updatedTicket.priority}`,
			});
		}

		return updatedTicket;
	}

	async assignTicket(ticketId: string, userId: string) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}

		const updatedTicket = await this.prisma.ticket.update({
			where: { id: ticketId },
			data: {
				assignedToId: userId,
			},
		});

		await this.auditLogsService.logAction({
			action: 'TICKET_ASSIGNED',
			ticketId,
			userId: ticket.userId,
			oldValue: ticket.assignedToId ?? null,
			newValue: userId,
		});

		return updatedTicket;
	}
}
