import { HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { ExistingUserDTO } from 'src/user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | null> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) throw new NotFoundException('Email exist');

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(name, email, hashedPassword);

    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) {
      return null;
    }

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) {
      return null;
    }

    return this.userService._getUserDetails(user);
  }

  async login(existingUser: ExistingUserDTO) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      return null;
    }

    const jwt = await this.jwtService.signAsync({ user });
    console.log(jwt);

    return {
      ...user,
      token: jwt,
    };
  }
  // async login(
  //   existingUser: ExistingUserDTO,
  // ): Promise<{ token: string } | null> {
  //   const { email, password } = existingUser;
  //   const user = await this.validateUser(email, password);

  //   if (!user) {
  //     return null;
  //   }

  //   const jwt = await this.jwtService.signAsync({ user });

  //   return { token: jwt };
  // }
}
