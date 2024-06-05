import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  SignIn(@Body() signInDto: Record<string, any>) {
    // TODO: see validation chapter -> (Record)
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
