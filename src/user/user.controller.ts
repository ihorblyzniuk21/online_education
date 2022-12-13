import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { DeleteResult } from 'typeorm';
import { AuthValidationPipe } from '@app/pipes/authValidation.pipe';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { Roles } from '@app/user/decorators/role-auth.decorator';
import { roles } from '@app/helpers/constants';
import { RolesGuard } from '@app/user/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  async registration(
    @Body('user', new AuthValidationPipe()) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.registration(createUserDto);
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res;
  }

  @Post('/login')
  async login(
    @Body('user', new AuthValidationPipe()) loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.login(loginUserDto);
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res;
  }

  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<DeleteResult> {
    const res = await this.userService.logout(request.cookies.refreshToken);
    response.clearCookie('refreshToken');
    return res;
  }

  @Get('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserResponseInterface> {
    const res = await this.userService.refresh(
      request.cookies.refreshToken,
      response,
    );
    response.cookie('refreshToken', res.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res;
  }

  @Post('/test')
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  async updateUser() {
    return 'Working';
  }
}
