import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { signInDto } from './dto/signInDto.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/users.schema';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(createUsrDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUsrDto.password, 10);
    createUsrDto.password = hash;
    return await this.usersService.create(createUsrDto);
  }

  async signIn(signInDto: signInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(signInDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
  async all(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  async findOne(email: string): Promise<User> {
    return await this.usersService.findOne(email);
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(email, updateUserDto);
  }

  async delete(email: string): Promise<void> {
    return await this.usersService.delete(email);
  }
}
