import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketResponseDto } from './dto/ticket-response.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({
    status: 201,
    description: 'Ticket created successfully',
    type: TicketResponseDto,
  })
  create(
    @Body() dto: CreateTicketDto,
    @CurrentUser() currentUser,
  ) {
    return this.ticketsService.create(dto, currentUser);
  }

  @Get()
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tickets visible to the current user' })
  @ApiResponse({
    status: 200,
    description: 'Tickets retrieved successfully',
    type: [TicketResponseDto],
  })
  findAll(@CurrentUser() currentUser) {
    return this.ticketsService.findAll(currentUser);
  }

  @Get(':id')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiOperation({ summary: 'Get a ticket by id' })
  @ApiResponse({
    status: 200,
    description: 'Ticket retrieved successfully',
    type: TicketResponseDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser,
  ) {
    return this.ticketsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles('USER', 'TECHNICIAN', 'SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully',
    type: TicketResponseDto,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() currentUser,
  ) {
    return this.ticketsService.update(id, dto, currentUser);
  }

  @Roles('SUPERVISOR', 'ADMIN')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiParam({ name: 'userId', description: 'Technician user ID to assign the ticket to' })
  @ApiOperation({ summary: 'Assign a ticket to a user' })
  @ApiResponse({
    status: 200,
    description: 'Ticket assigned successfully',
    type: TicketResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id/assign/:userId')
  assign(
    @Param('id') ticketId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser,
  ) {
    return this.ticketsService.assignTicket(ticketId, userId, currentUser);
  }
}