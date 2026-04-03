import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,) { }

    async signup(dto: SignupDto) {
        this.logger.info(`Signup attempt for email`, { email: dto.email });

        if (dto.password !== dto.confirmPassword) {
            this.logger.warn(`Passwords do not match`, { email: dto.email });
            throw new BadRequestException('Passwords do not match');
        }

        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) {
            this.logger.warn(`Signup failed: User already exists`, { email: dto.email });
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { email: dto.email, password: hashedPassword, role: 'VIEWER' },
        });

        const token = this.jwtService.sign({ userId: user.id, role: user.role });
        this.logger.info(`User created`, { userId: user.id });
        return { message: 'User created', userId: user.id, access_token: token };
    }

    async login(dto: LoginDto) {
        this.logger.info(`Login attempt`, { email: dto.email });

        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            this.logger.warn(`Login failed: Invalid credentials`, { email: dto.email });
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            this.logger.warn(`Login failed: Invalid password`, { email: dto.email });
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ userId: user.id, role: user.role });
        this.logger.info(`User logged in`, { userId: user.id });
        return { access_token: token };
    }
}