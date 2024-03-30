// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateUser } from 'src/dto/userValidate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() validateUser: ValidateUser): Promise<{ token: string } | null> {
    const token = await this.authService.authenticateUser(validateUser);
    return token ? { token } : null;
  }
}
