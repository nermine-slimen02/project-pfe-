import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Body,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';
import { InterventionsService } from './interventions.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionResponseDto } from './dto/intervention-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Interventions')
@Controller('interventions')
export class InterventionsController {
	constructor(private readonly interventionsService: InterventionsService) {}

	@Post()
	@ApiOperation({ summary: 'Create an intervention' })
	@ApiBody({ type: CreateInterventionDto })
	@ApiCreatedResponse({ type: InterventionResponseDto, description: 'Intervention created successfully.' })
	@ApiBadRequestResponse({ description: 'Invalid intervention data.' })
	create(@Body() dto: CreateInterventionDto) {
		return this.interventionsService.create(dto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all interventions' })
	@ApiResponse({ status: 200, description: 'List of interventions.', type: [InterventionResponseDto] })
	findAll() {
		return this.interventionsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get an intervention by id' })
	@ApiParam({ name: 'id', description: 'Intervention ID' })
	@ApiResponse({ status: 200, description: 'Intervention found.', type: InterventionResponseDto })
	@ApiNotFoundResponse({ description: 'Intervention not found.' })
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.interventionsService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an intervention' })
	@ApiParam({ name: 'id', description: 'Intervention ID' })
	@ApiBody({ type: UpdateInterventionDto })
	@ApiResponse({ status: 200, description: 'Intervention updated.', type: InterventionResponseDto })
	@ApiNotFoundResponse({ description: 'Intervention not found.' })
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateInterventionDto,
	) {
		return this.interventionsService.update(id, dto);
	}

	@Patch(':id/start')
	@ApiOperation({ summary: 'Start an intervention' })
	@ApiParam({ name: 'id', description: 'Intervention ID' })
	@ApiResponse({ status: 200, description: 'Intervention started.', type: InterventionResponseDto })
	@ApiBadRequestResponse({ description: 'Intervention already started or status invalid.' })
	@ApiNotFoundResponse({ description: 'Intervention not found.' })
	start(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.interventionsService.start(id);
	}

	@Patch(':id/finish')
	@ApiOperation({ summary: 'Finish an intervention' })
	@ApiParam({ name: 'id', description: 'Intervention ID' })
	@ApiResponse({ status: 200, description: 'Intervention finished.', type: InterventionResponseDto })
	@ApiBadRequestResponse({ description: 'Intervention not started or already finished.' })
	@ApiNotFoundResponse({ description: 'Intervention not found.' })
	finish(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.interventionsService.finish(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete an intervention' })
	@ApiParam({ name: 'id', description: 'Intervention ID' })
	@ApiResponse({ status: 200, description: 'Intervention deleted.' })
	@ApiNotFoundResponse({ description: 'Intervention not found.' })
	remove(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.interventionsService.remove(id);
	}
}

