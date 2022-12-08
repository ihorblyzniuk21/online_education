import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { TokenService } from '@app/token/token.service';
import { TokenEntity } from '@app/token/token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly tokenService: TokenService,
  ) {}

  async registration(user: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

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

    delete newUser.password;
    return newUser;
  }
}
