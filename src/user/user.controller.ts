import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { DeleteResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  async registration(
    @Body('user') createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.registration(createUserDto);
    response.cookie('refreshToken', res.tokens.refreshToken);
    return res;
  }

  @Post('/login')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.login(loginUserDto);
    response.cookie('refreshToken', res.tokens.refreshToken);
    return res;
  }

  @Post('/logout')
  async logout(@Req() request: Request): Promise<DeleteResult> {
    return await this.userService.logout(request.cookies.refreshToken);
  }
}
