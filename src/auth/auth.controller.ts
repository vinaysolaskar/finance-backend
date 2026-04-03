import { Post, Body, Controller } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
