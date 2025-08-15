import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dtos/signup.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async registerUser(@Body() signUpDto: SignUpDto) {
    const newUser = await this.usersService.create(signUpDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = newUser;
    return {
      ...(await this.authService.signIn(newUser.email, newUser.password)),
      user: safeUser,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
