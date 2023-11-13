import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { AuthService } from './auth.service';
import { ExistingUserDTO } from 'src/user/dtos/existing-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() user: NewUserDTO,
    @Res() response,
  ): Promise<UserDetails | null> {
    try {
      const newUser = await this.authService.register(user);
      return response.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        newUser,
      });
    } catch (error) {
      return response.status(error.status).json(error.message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() user: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}
