// server/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, Query, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          }
        }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Setup initial admin account' })
  @ApiResponse({ status: 201, description: 'Admin account successfully created' })
  @Post('setup-admin')
  async setupAdmin(@Body() setupAdminDto: SetupAdminDto) {
    return this.authService.setupInitialAdmin(setupAdminDto);
  }

  @ApiOperation({ summary: 'Check if initial setup is needed' })
  @ApiResponse({ status: 200, description: 'Returns setup status' })
  @Get('check-setup')
  async checkSetup() {
    return this.authService.checkSetupStatus();
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Check if user has permission to access a resource' })
  @ApiResponse({ status: 200, description: 'User has permission' })
  @ApiResponse({ status: 403, description: 'User does not have permission' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check-permission')
  checkPermission(@Request() req, @Query('resource') resource: string) {
    // Check permissions based on user role and requested resource
    const { user } = req;
    
    // Handle invitations resource
    if (resource === 'invitations') {
      if (user.role === 'admin' || user.role === 'manager') {
        return { permitted: true };
      }
      throw new ForbiddenException('You do not have permission to access invitations');
    }
    
    // Add more resource checks as needed
    
    // Default deny for unknown resources
    throw new ForbiddenException('Unknown resource or insufficient permissions');
  }
}