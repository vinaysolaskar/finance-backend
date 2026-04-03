import { Controller, Get, Post, Delete, Body, Param, Query, Req, UseGuards, ParseUUIDPipe, Patch } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/finance.dto';
import { UpdateFinanceDto } from './dto/finance.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guards';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Post()
    @Roles('ADMIN', 'ANALYST')
    @ApiOperation({ summary: 'Create a financial record' })
    create(@Req() req, @Body() dto: CreateFinanceDto) {
        console.log('userid: ', req.user.userId);
        return this.financeService.create(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get financial records with filters, search, pagination' })
    findAll(@Req() req, @Query() query) {
        return this.financeService.findAll(req.user.userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get single financial record by ID' })
    findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.financeService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'ANALYST')
    @ApiOperation({ summary: 'Update a financial record' })
    update(@Req() req, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFinanceDto) {
        return this.financeService.update(req.user.userId, id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Soft delete a financial record' })
    softDelete(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.financeService.softDelete(req.user.userId, id);
    }
}