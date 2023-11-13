import { UseGuards, Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDetails } from './user-details.interface';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    console.log(id);
    return this.userService.findById(id);
  }
}
