import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsString, IsOptional, IsDateString, Min, IsNotEmpty } from 'class-validator';
import { Type } from '../transaction-type.enum';

export class CreateFinanceDto {
    @ApiProperty({ example: 100.5 })
    @IsNumber()
    @Min(0)
    amount!: number;

    @ApiProperty({ enum: Type, example: Type.EXPENSE })
    @IsEnum(Type)
    type!: Type;

    @ApiProperty({ example: 'Food' })
    @IsString()
    @IsNotEmpty()
    category!: string;

    @ApiProperty({ example: '2026-04-01T12:00:00Z' })
    @IsDateString()
    date!: string;

    @ApiProperty({ example: 'Dinner at restaurant', required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateFinanceDto extends PartialType(CreateFinanceDto) { }