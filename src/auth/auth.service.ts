// auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidateUser } from 'src/dto/userValidate.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schema/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    ) {}

  async authenticateUser(validateUser: ValidateUser): Promise<string | null> {
    try { 
      const user = await this.validateUser(validateUser);
      const tokenPayload = { username: user.username, sub: user.id };
      return await this.jwtService.signAsync(tokenPayload,  {secret: process.env.JWT_SECRET, expiresIn: +process.env.EXPIRY_TIME});
    } catch(error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  async validateUser(validateUser: ValidateUser): Promise<User> {
    const username = validateUser.username;
    const user = await this.userService.findUserByUsername(username);
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const passwordIsValid = await bcrypt.compare(validateUser.password, user.password);
    if(!passwordIsValid && (validateUser.password != user.password)) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
    } catch(error) {
      throw new HttpException(error?.message, error?.status);
    }
  }
}
