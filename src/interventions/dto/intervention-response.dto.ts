import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InterventionResponseDto {
  @ApiProperty({
    description: 'Identifiant unique de l\'intervention.',
    example: 'b7a9f1c2-4e7b-4f90-8b57-99d4f0c5ec82',
  })
  id: string;

  @ApiProperty({
    description: 'Identifiant du ticket associé.',
    example: 'd4c8a2f1-3b5a-4f47-9a14-8d133e6f1c2b',
  })
  ticketId: string;

  @ApiProperty({
    description: 'Identifiant du technicien responsable.',
    example: 'c4f2a6b8-7d23-4e7f-a0b9-1c2d3e4f5a6b',
  })
  technicianId: string;

  @ApiPropertyOptional({
    description: 'Date et heure de début de l\'intervention.',
    example: '2026-07-07T08:30:00.000Z',
  })
  dateDebut?: Date | null;

  @ApiPropertyOptional({
    description: 'Date et heure de fin de l\'intervention.',
    example: '2026-07-07T10:15:00.000Z',
  })
  dateFin?: Date | null;

  @ApiPropertyOptional({
    description: 'Rapport rédigé par le technicien après l\'intervention.',
    example: 'Remplacement du composant défectueux, tests validés.',
  })
  rapport?: string | null;

  @ApiProperty({
    description: 'État actuel de l\'intervention (EN_ATTENTE, EN_COURS, TERMINEE).',
    example: 'EN_COURS',
  })
  statut: string;

  @ApiPropertyOptional({
    description: 'Durée totale de l\'intervention en minutes.',
    example: 105,
  })
  tempsPasse?: number | null;

  @ApiPropertyOptional({
    description: 'Actions effectuées pendant l\'intervention.',
    example: 'Vérification réseau, redémarrage du serveur.',
  })
  actionsRealisees?: string | null;

  @ApiProperty({
    description: 'Date de création de l\'intervention.',
    example: '2026-07-07T08:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification.',
    example: '2026-07-07T09:00:00.000Z',
  })
  updatedAt: Date;
}
