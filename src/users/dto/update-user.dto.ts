import { IsBoolean, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
    @ApiProperty({ enum: Role, description: 'The role of the user' })
    @IsEnum(Role)
    role!: Role;
}

export class UpdateStatusDto {
    @ApiProperty({ example: true, description: 'Whether the user is active' })
    @IsBoolean()
    isActive!: boolean;
}