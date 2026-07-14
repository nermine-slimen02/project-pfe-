import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty({ example: 'TICKET_CREATED' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ example: 'OPEN', required: false })
  @IsOptional()
  @IsString()
  oldValue?: string;

  @ApiProperty({ example: 'IN_PROGRESS', required: false })
  @IsOptional()
  @IsString()
  newValue?: string;

  @ApiProperty({ example: '6f7ccea5-4c26-4867-9145-72fef4e3a69f' })
  @IsUUID('4')
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ example: '626ca949-ce70-4736-9e4e-92e0fa6e2e38' })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;
}
