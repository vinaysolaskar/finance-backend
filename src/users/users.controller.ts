import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-user.dto';
import { UpdateStatusDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guards';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Get all users with pagination' })
    @ApiResponse({ status: 200, description: 'List of users with pagination.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
        return this.usersService.getAllUsers(Number(page), Number(limit));
    }

    @Patch(':id/role')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update a user\'s role' })
    @ApiResponse({ status: 200, description: 'User role updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    updateRole(
        @Param('id') userId: string,
        @Body() dto: UpdateRoleDto,
        @Req() req: any,
    ) {
        return this.usersService.updateRole(req.user.userId, userId, dto);
    }

    @Patch(':id/status')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update a user\'s active status' })
    @ApiResponse({ status: 200, description: 'User status updated successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    updateStatus(
        @Param('id') userId: string,
        @Body() dto: UpdateStatusDto,
        @Req() req: any,
    ) {
        return this.usersService.updateStatus(req.user.userId, userId, dto);
    }
}