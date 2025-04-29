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

  async findAll(query?: { email?: string; role?: string }): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (query?.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    }
    
    if (query?.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
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
    const user = await this.findOne(id);
    await this.usersRepository.softRemove(user);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.searchUsers(query);
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepository.findByRole(role);
  }
}