import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { signInDto } from './dto/signInDto.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  signUp(@Body() createUsrDto: CreateUserDto) {
    return this.authService.signUp(createUsrDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  SignIn(@Body() signInDto: signInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('all-users')
  getUsers() {
    return this.authService.all();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.findOne(req.user.email);
  }

  @Patch('profile')
  updateProfile(@Request() req, @Body() updateUserDto) {
    return this.authService.update(req.user.email, updateUserDto);
  }

  @Delete('profile')
  deleteProfile(@Request() req) {
    return this.authService.delete(req.user.email);
  }
}
