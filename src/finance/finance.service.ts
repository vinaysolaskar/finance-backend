import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto/finance.dto';
import { Type } from './transaction-type.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class FinanceService {
    constructor(
        private prisma: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }

    async create(userId: string, dto: CreateFinanceDto) {
        this.logger.info(`Creating finance record`, { userId, dto });
        const record = await this.prisma.financialRecord.create({
            data: { userId, ...dto, date: new Date(dto.date) },
        });
        this.logger.debug(`Created record`, { record });
        return record;
    }

    async findAll(userId: string, query: any) {
        const { page = 1, limit = 10, type, category, startDate, endDate, search, sortBy = 'date', sortOrder = 'desc' } = query;
        const pageNum = Math.max(Number(page), 1);
        const pageSize = Math.max(Number(limit), 1);

        const allowedSortFields = ['date', 'amount', 'category', 'type'];
        const orderByField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
        const orderDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

        const filters: any = { userId, isDeleted: false };
        if (type && Object.values(Type).includes(type)) filters.type = type as Type;
        if (category) filters.category = category;
        if (startDate || endDate) filters.date = {};
        if (startDate) filters.date.gte = new Date(startDate);
        if (endDate) filters.date.lte = new Date(endDate);
        if (search) filters.OR = [
            { category: { contains: search, mode: 'insensitive' } },
            { notes: { contains: search, mode: 'insensitive' } },
        ];

        this.logger.debug(`Fetching finance records`, { userId, filters, pageNum, pageSize, sortBy: orderByField, sortOrder: orderDirection });

        const skip = (pageNum - 1) * pageSize;
        const take = pageSize;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.financialRecord.findMany({ where: filters, skip, take, orderBy: { [orderByField]: orderDirection } }),
            this.prisma.financialRecord.count({ where: filters }),
        ]);

        return { data, meta: { total, page: pageNum, limit: pageSize } };
    }

    async findOne(userId: string, id: string) {
        this.logger.debug(`Fetching record`, { userId, recordId: id });
        return this.prisma.financialRecord.findFirst({ where: { id, userId, isDeleted: false } });
    }

    async update(userId: string, id: string, dto: UpdateFinanceDto) {
        const record = await this.prisma.financialRecord.findUnique({ where: { id } });
        if (!record || record.isDeleted) throw new NotFoundException('Record not found or access denied');

        const isChanged = Object.entries(dto).some(([key, value]) => {
            if (key === 'date' && value) return new Date(value).getTime() !== record.date.getTime();
            return value !== (record as any)[key];
        });

        if (!isChanged) {
            this.logger.debug(`No changes detected`, { userId, recordId: id });
            return { message: 'Nothing updated', updated: false };
        }

        this.logger.info(`Updating record`, { userId, recordId: id, dto });
        const updated = await this.prisma.financialRecord.update({ where: { id }, data: { ...dto, ...(dto.date && { date: new Date(dto.date) }) } });
        this.logger.debug(`Updated record`, { updated });
        return updated;
    }

    async softDelete(userId: string, id: string) {
        this.logger.info(`Soft deleting record`, { userId, recordId: id });
        return this.prisma.financialRecord.updateMany({ where: { id, userId, isDeleted: false }, data: { isDeleted: true } });
    }
}