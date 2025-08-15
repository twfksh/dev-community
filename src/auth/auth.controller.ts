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
    // const newUser = await this.usersService.create(signUpDto);
    // const { password, ...user } = newUser;
    // return {
    //   ...(await this.authService.signIn(user.email, password)),
    //   user,
    // };
    return await this.usersService.create(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
