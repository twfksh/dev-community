import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './dtos/auth-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthToken } from './dtos/auto-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(email: string, passwd: string): Promise<AuthToken> {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(passwd, user.password))) {
      throw new UnauthorizedException(
        'Invalid login credentials. Please enter a valid email and password.',
      );
    }

    const payload: AuthPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
