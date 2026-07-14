import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';

@Injectable()
export class InterventionsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly auditLogsService: AuditLogsService,
	) {}

	async create(data: CreateInterventionDto) {
		const ticket = await this.prisma.ticket.findUnique({ where: { id: data.ticketId } });
		if (!ticket) throw new NotFoundException('Ticket not found');

		const technician = await this.prisma.user.findUnique({ where: { id: data.technicianId } });
		if (!technician) throw new NotFoundException('Technician not found');

		const createdIntervention = await this.prisma.intervention.create({
			data: {
				ticketId: data.ticketId,
				technicianId: data.technicianId,
				dateDebut: data.dateDebut ? new Date(data.dateDebut) : undefined,
				dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
				rapport: data.rapport,
				statut: data.statut ?? 'EN_ATTENTE',
				tempsPasse: data.tempsPasse,
				actionsRealisees: data.actionsRealisees,
			},
		});

		await this.auditLogsService.logAction({
			action: 'INTERVENTION_ADDED',
			ticketId: data.ticketId,
			userId: data.technicianId,
			oldValue: null,
			newValue: `Statut: ${createdIntervention.statut}`,
		});

		return createdIntervention;
	}

	async findAll() {
		return this.prisma.intervention.findMany();
	}

	async findOne(id: string) {
		const intervention = await this.prisma.intervention.findUnique({ where: { id } });
		if (!intervention) throw new NotFoundException('Intervention not found');
		return intervention;
	}

	async update(id: string, data: UpdateInterventionDto) {
		const intervention = await this.prisma.intervention.findUnique({ where: { id } });
		if (!intervention) throw new NotFoundException('Intervention not found');

		const updatePayload: any = {
			...(data.ticketId !== undefined && { ticketId: data.ticketId }),
			...(data.technicianId !== undefined && { technicianId: data.technicianId }),
			...(data.dateDebut !== undefined && { dateDebut: data.dateDebut ? new Date(data.dateDebut) : null }),
			...(data.dateFin !== undefined && { dateFin: data.dateFin ? new Date(data.dateFin) : null }),
			...(data.rapport !== undefined && { rapport: data.rapport }),
			...(data.statut !== undefined && { statut: data.statut }),
			...(data.tempsPasse !== undefined && { tempsPasse: data.tempsPasse }),
			...(data.actionsRealisees !== undefined && { actionsRealisees: data.actionsRealisees }),
		};

		return this.prisma.intervention.update({ where: { id }, data: updatePayload });
	}

  async start(id: string) {
    const intervention = await this.prisma.intervention.findUnique({ where: { id } });
    if (!intervention) throw new NotFoundException('Intervention not found');
    if (intervention.statut !== 'EN_ATTENTE') {
      if (intervention.statut === 'EN_COURS') {
        throw new BadRequestException('Intervention is already started');
      }
      if (intervention.statut === 'TERMINEE') {
        throw new BadRequestException('Cannot start an intervention that is already finished');
      }
      throw new BadRequestException('Intervention must be in EN_ATTENTE status to start');
    }

    const ticket = await this.prisma.ticket.findUnique({ where: { id: intervention.ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const technician = await this.prisma.user.findUnique({ where: { id: intervention.technicianId } });
    if (!technician) throw new NotFoundException('Technician not found');

    const startedAt = new Date();

    const updatedIntervention = await this.prisma.intervention.update({
      where: { id },
      data: {
        dateDebut: startedAt,
        statut: 'EN_COURS',
      },
    });

    await this.prisma.ticket.update({
      where: { id: updatedIntervention.ticketId },
      data: { status: 'IN_PROGRESS' },
    });

    await this.auditLogsService.logAction({
      action: 'INTERVENTION_STARTED',
      ticketId: updatedIntervention.ticketId,
      userId: technician.id,
      oldValue: 'EN_ATTENTE',
      newValue: 'EN_COURS',
    });

    return updatedIntervention;
  }

  async finish(id: string) {
    const intervention = await this.prisma.intervention.findUnique({ where: { id } });
    if (!intervention) throw new NotFoundException('Intervention not found');
    if (intervention.statut !== 'EN_COURS') {
      if (intervention.statut === 'TERMINEE') {
        throw new BadRequestException('Intervention is already finished');
      }
      throw new BadRequestException('Intervention must be in EN_COURS status to finish');
    }

    const ticket = await this.prisma.ticket.findUnique({ where: { id: intervention.ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const technician = await this.prisma.user.findUnique({ where: { id: intervention.technicianId } });
    if (!technician) throw new NotFoundException('Technician not found');

    const finishedAt = new Date();
    const startedAt = intervention.dateDebut;
    if (!startedAt) {
      throw new BadRequestException('Intervention start date is missing');
    }

    const durationMinutes = Math.max(
      0,
      Math.round((finishedAt.getTime() - startedAt.getTime()) / 60000),
    );

    const updatedIntervention = await this.prisma.intervention.update({
      where: { id },
      data: {
        dateFin: finishedAt,
        statut: 'TERMINEE',
        tempsPasse: durationMinutes,
      },
    });

    await this.prisma.ticket.update({
      where: { id: updatedIntervention.ticketId },
      data: { status: 'RESOLVED' },
    });

    await this.auditLogsService.logAction({
      action: 'INTERVENTION_CLOSED',
      ticketId: updatedIntervention.ticketId,
      userId: technician.id,
      oldValue: 'EN_COURS',
      newValue: 'TERMINEE',
    });

    await this.auditLogsService.logAction({
      action: 'TICKET_RESOLVED',
      ticketId: updatedIntervention.ticketId,
      userId: technician.id,
      oldValue: ticket.status,
      newValue: 'RESOLVED',
    });

    return updatedIntervention;
  }

  async remove(id: string) {
    const intervention = await this.prisma.intervention.findUnique({ where: { id } });
    if (!intervention) throw new NotFoundException('Intervention not found');

    return this.prisma.intervention.delete({ where: { id } });
  }
}

