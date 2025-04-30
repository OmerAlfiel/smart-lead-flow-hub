// server/src/modules/users/users.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userRepository: UserRepository,
  ) {}

  async hasExistingAdmin(): Promise<boolean> {
    const adminCount = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'admin' })
      .getCount();
    return adminCount > 0;
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.usersRepository.save(user);
  }

  async findAll(query?: { email?: string; role?: string }): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (query?.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    }
    
    if (query?.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }
    
    const users = await queryBuilder.getMany();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    const user = this.usersRepository.create(registerDto);
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // If email is being updated, check if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.findOne(id);
    
    // Verify current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await this.userRepository.searchUsers(query);
    return users;
  }

  async findByRole(role: string): Promise<User[]> {
    const users = await this.userRepository.findByRole(role);
    return users;
  }


async createInitialAdmin(setupAdminDto: any): Promise<User> {
  const admins = await this.findByRole('admin');
  if (admins.length > 0) {
    throw new ConflictException('Admin user already exists');
  }

  const user = this.usersRepository.create({
    ...setupAdminDto,
    firstName: setupAdminDto.firstName || 'Admin',
    lastName: setupAdminDto.lastName || 'User',
    role: 'admin',
    isActive: true
  });
  
  return (this.usersRepository.save(user) as unknown) as Promise<User>;
}
}