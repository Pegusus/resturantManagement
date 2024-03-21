import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Controller, Injectable, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import Role from './user.constants';

@Injectable()
@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
      }

      // Validating password before creating jwt token
      const user: User | null =
        await this.userService.getUserAndValidatePassword(username, password);

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // JWT sign in token create
      const token = jwt.sign(
        { id: user?.id, username: user?.username, role: user?.role },
        process.env.JWT_SECRET,
        { expiresIn: '12h' },
      );
      return res.json({ token });
    } catch (error) {
      console.error(error);
      throw new Error('Internal server error');
    }
  }

  @Post('/signup')
  async signUp(@Req() req: Request, @Res() res: Response) {
    try {
      const { username, password, role } = req.body;

      if (!username || !password || !role) {
        return res
          .status(400)
          .json({ message: 'Username, password, role are required' });
      }

      if (!Object.values(Role).includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const existingUser = await this.userService.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists, login' });
      }

      const newUser = await this.userService.signUp(username, password, role);

      // Returning JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '12h' },
      );
      return res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
