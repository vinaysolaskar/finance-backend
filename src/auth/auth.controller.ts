import { Post, Body, Controller } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Req } from '@nestjs/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('signup')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Validation error or user exists.' })
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }
    @Post('login')
    @Throttle({ default: { limit: 3, ttl: 60 } })
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    login(@Body() dto: LoginDto, @Req() req) {
        console.log('IP: ', req.ip)
        return this.authService.login(dto);
    }
}