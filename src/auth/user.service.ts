import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import Role from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserAndValidatePassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        'Error fetching user by username or validating password:',
        error,
      );
      throw error;
    }
  }

  async signUp(username: string, password: string, role: Role) {
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = await this.userRepository.create({
        username,
        password: hashedPassword,
        role: role,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }
}
