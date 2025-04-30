// server/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SetupAdminDto } from './dto/setup-admin.dto';
import { UsersService } from '../users/users.service';
import { InvitationsService } from '../invitations/invitations.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private invitationsService: InvitationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    let role = 'agent'; // Default role
    
    // If invitation token is provided, verify it and get the role
    if (registerDto.invitationToken) {
      try {
        const invitation = await this.invitationsService.findByToken(registerDto.invitationToken);
        
        // Verify that the email matches the invitation
        if (invitation.email.toLowerCase() !== registerDto.email.toLowerCase()) {
          throw new BadRequestException('Email does not match invitation');
        }
        
        // Set the role from the invitation
        role = invitation.role;
        
        // Mark the invitation as used
        await this.invitationsService.markAsUsed(registerDto.invitationToken);
      } catch (error) {
        throw new BadRequestException('Invalid or expired invitation token');
      }
    }
    
    // Create the user with the determined role
    const userData = { ...registerDto, role };
    const user = await this.usersService.create(userData as any);
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async setupInitialAdmin(setupAdminDto: SetupAdminDto) {
    const user = await this.usersService.createInitialAdmin(setupAdminDto);
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async checkSetupStatus() {
    const hasAdmin = await this.usersService.hasExistingAdmin();
    return { needsSetup: !hasAdmin };
  }
}