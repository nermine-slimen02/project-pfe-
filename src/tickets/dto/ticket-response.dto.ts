import { ApiProperty } from '@nestjs/swagger';

export class TicketResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: 'Bug dans l affichage de la page' })
  title: string;

  @ApiProperty({ example: 'La page ne charge pas correctement le tableau de bord.' })
  description: string;

  @ApiProperty({ example: 'OPEN' })
  status: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;

  @ApiProperty({ example: true })
  isLate: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003', required: false })
  assignedToId?: string;

  @ApiProperty({ example: '2026-07-23T12:34:56.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-23T12:34:56.000Z' })
  updatedAt: Date;
}
