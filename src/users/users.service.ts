import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRoleDto } from './dto/update-user.dto';
import { UpdateStatusDto } from './dto/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }

    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        this.logger.debug(`Fetching users`, { page, limit });

        const [data, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data,
            meta: { total, page, limit },
        };
    }

    async updateRole(adminId: string, userId: string, dto: UpdateRoleDto) {
        this.logger.info(`Updating user role`, {
            adminId,
            userId,
            role: dto.role,
        });

        if (adminId === userId) {
            throw new BadRequestException('You cannot change your own role');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { role: dto.role },
        });

        return {
            message: 'Role updated successfully',
            userId: updated.id,
            role: updated.role,
        };
    }

    async updateStatus(adminId: string, userId: string, dto: UpdateStatusDto) {
        this.logger.info(`Updating user status`, {
            adminId,
            userId,
            isActive: dto.isActive,
        });

        if (adminId === userId) {
            throw new BadRequestException('You cannot deactivate yourself');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: dto.isActive },
        });

        return {
            message: `User ${dto.isActive ? 'activated' : 'deactivated'}`,
            userId: updated.id,
            isActive: updated.isActive,
        };
    }
}