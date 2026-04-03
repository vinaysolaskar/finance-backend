import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @MinLength(6)
    confirmPassword!: string;
}