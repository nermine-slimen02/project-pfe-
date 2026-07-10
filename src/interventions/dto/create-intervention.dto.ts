import { IsDateString, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInterventionDto {
  @IsUUID()
  ticketId: string;

  @IsUUID()
  technicianId: string;

  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  rapport?: string;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsInt()
  tempsPasse?: number;

  @IsOptional()
  @IsString()
  actionsRealisees?: string;
}
