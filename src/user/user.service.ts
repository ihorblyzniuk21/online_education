import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { TokenService } from '@app/token/token.service';
import { TokenEntity } from '@app/token/token.entity';
import { GenerateTokenInterface } from '@app/token/types/generateToken.interface';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async registration(user: CreateUserDto): Promise<UserResponseInterface> {
    const userByEmail = await this.getUserByEmail(user);

    if (userByEmail) {
      throw new HttpException(
        'email has already been taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, user);

    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;
    const tokens = await this.tokenService.generateTokens({ ...savedUser });
    await this.tokenService.saveToken({ ...savedUser }, tokens.refreshToken);

    return this.buildUserResponse(savedUser, tokens);
  }

  async login(user: LoginUserDto): Promise<UserResponseInterface> {
    const userByEmail = await this.getUserByEmail(user);
    if (!userByEmail) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }
    const isPassEquals = await compare(user.password, userByEmail.password);
    if (!isPassEquals) {
      throw new HttpException(
        'Wrong email or password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete userByEmail.password;
    const tokens = await this.tokenService.generateTokens({ ...userByEmail });
    await this.tokenService.saveToken({ ...userByEmail }, tokens.refreshToken);

    return this.buildUserResponse(userByEmail, tokens);
  }

  async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  async getUserByEmail(user) {
    if (!user) {
      throw new HttpException(
        'data is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.userRepository.findOne({
      where: { email: user.email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'dateOfBirth',
        'image',
        'password',
      ],
    });
  }

  buildUserResponse(
    user: UserEntity,
    tokens: GenerateTokenInterface,
  ): UserResponseInterface {
    return {
      user,
      tokens,
    };
  }
}
