import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({ example: '8d6dbf0c-5bcd-4f48-90e3-cb0f8f11d123' })
  id: string;

  @ApiProperty({ example: 'TICKET_CREATED' })
  action: string;

  @ApiProperty({ example: 'OPEN', required: false })
  oldValue?: string | null;

  @ApiProperty({ example: 'IN_PROGRESS', required: false })
  newValue?: string | null;

  @ApiProperty({ example: '6f7ccea5-4c26-4867-9145-72fef4e3a69f' })
  ticketId: string;

  @ApiProperty({ example: '626ca949-ce70-4736-9e4e-92e0fa6e2e38' })
  userId: string;

  @ApiProperty({ example: '2026-07-13T10:00:00.000Z' })
  createdAt: Date;
}
