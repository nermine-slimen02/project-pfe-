import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly auditLogsService: AuditLogsService,
		private readonly notificationsService: NotificationsService,
	) {}

	private computeIsLate(status: string, slaDeadline?: Date | null): boolean {
		if (!slaDeadline) {
			return false;
		}

		return new Date() > slaDeadline && status !== 'RESOLVED';
	}

	private getTicketQueryScope(user: { id: string; role: string }) {
		if (user.role === 'USER') {
			return { userId: user.id };
		}

		if (user.role === 'TECHNICIAN') {
			return { assignedToId: user.id };
		}

		return {};
	}

	private async authorizeTicketAccess(ticket: any, user: { id: string; role: string }) {
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}

		const isOwner = ticket.userId === user.id;
		const isAssigned = ticket.assignedToId === user.id;
		const isManager = ['SUPERVISOR', 'ADMIN'].includes(user.role);

		if (!isOwner && !isAssigned && !isManager) {
			throw new ForbiddenException('Insufficient permissions to access this ticket');
		}
	}

	private async ensureTicketLateStatus(ticket: any) {
		const isLate = this.computeIsLate(ticket.status, ticket.slaDeadline);

		if (isLate && !ticket.isLate) {
			await this.prisma.ticket.update({
				where: { id: ticket.id },
				data: { isLate: true },
			});

			await this.notificationsService.create({
				userId: ticket.userId,
				ticketId: ticket.id,
				message: `Your ticket "${ticket.title}" is now late.`,
				type: 'WARNING',
			});
		}

		return isLate;
	}

	async create(data: CreateTicketDto, currentUser: { id: string; role: string }) {
		if (currentUser.role === 'USER' && data.userId !== currentUser.id) {
			throw new ForbiddenException('Users may only create tickets for themselves');
		}

		const slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const isLate = this.computeIsLate(data.status ?? 'OPEN', slaDeadline);

const ticketOwnerId = currentUser.role === 'USER' ? currentUser.id : data.userId ?? currentUser.id;

    const createdTicket = await this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'OPEN',
        priority: data.priority ?? 'MEDIUM',
        slaDeadline,
        isLate,
        userId: ticketOwnerId,
			},
		});

		await this.auditLogsService.logAction({
			action: 'TICKET_CREATED',
			ticketId: createdTicket.id,
			userId: currentUser.id,
			oldValue: null,
			newValue: `Status: ${createdTicket.status}; Priority: ${createdTicket.priority}`,
		});

		await this.notificationsService.create({
			userId: createdTicket.userId,
			ticketId: createdTicket.id,
			message: `Your ticket "${createdTicket.title}" has been created.`,
			type: 'SUCCESS',
		});

		return createdTicket;
	}

	async findAll(user: { id: string; role: string }) {
		const where = this.getTicketQueryScope(user);
		const tickets = await this.prisma.ticket.findMany({ where });

		return await Promise.all(
			tickets.map(async (ticket) => ({
				...ticket,
				isLate: await this.ensureTicketLateStatus(ticket),
			})),
		);
	}

	async findOne(id: string, user: { id: string; role: string }) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id } });
		await this.authorizeTicketAccess(ticket, user);

		return {
			...ticket,
			isLate: await this.ensureTicketLateStatus(ticket),
		};
	}

	async update(id: string, data: UpdateTicketDto, user: { id: string; role: string }) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id } });
		if (!ticket) {
			throw new NotFoundException('Ticket not found');
		}
		await this.authorizeTicketAccess(ticket, user);

		if (user.role === 'USER' && (data.assignedToId !== undefined || data.status !== undefined)) {
			throw new ForbiddenException('Users may not change ticket assignment or status');
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
				userId: user.id,
				oldValue: ticket.status,
				newValue: data.status,
			});

			if (data.status === 'RESOLVED') {
				await this.auditLogsService.logAction({
					action: 'TICKET_RESOLVED',
					ticketId: id,
					userId: user.id,
					oldValue: ticket.status,
					newValue: 'RESOLVED',
				});
			}

			const notificationMessage =
				data.status === 'RESOLVED'
					? `Your ticket "${updatedTicket.title}" has been resolved.`
					: `Status of ticket "${updatedTicket.title}" has changed to ${data.status}.`;

			await this.notificationsService.create({
				userId: updatedTicket.userId,
				ticketId: id,
				message: notificationMessage,
				type: data.status === 'RESOLVED' ? 'SUCCESS' : 'INFO',
			});

			if (updatedTicket.assignedToId && updatedTicket.assignedToId !== updatedTicket.userId) {
				await this.notificationsService.create({
					userId: updatedTicket.assignedToId,
					ticketId: id,
					message: `Ticket "${updatedTicket.title}" status is now ${data.status}.`,
					type: 'INFO',
				});
			}
		}

		if (data.assignedToId !== undefined && data.assignedToId !== ticket.assignedToId) {
			await this.auditLogsService.logAction({
				action: 'TICKET_ASSIGNED',
				ticketId: id,
				userId: user.id,
				oldValue: ticket.assignedToId ?? null,
				newValue: data.assignedToId,
			});

			await this.notificationsService.create({
				userId: data.assignedToId,
				ticketId: id,
				message: `Ticket "${updatedTicket.title}" has been assigned to you.`,
				type: 'INFO',
			});
		}

		return updatedTicket;
	}

	async assignTicket(ticketId: string, userId: string, currentUser: { id: string; role: string }) {
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
			userId: currentUser.id,
			oldValue: ticket.assignedToId ?? null,
			newValue: userId,
		});

		await this.notificationsService.create({
			userId,
			ticketId,
			message: `Ticket "${updatedTicket.title}" has been assigned to you.`,
			type: 'INFO',
		});

		return updatedTicket;
	}
}
