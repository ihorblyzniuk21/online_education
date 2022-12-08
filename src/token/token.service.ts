import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '@app/token/token.entity';
import { DeleteResult, Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { TokenDto } from '@app/token/dto/token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  //TODO add .env
  generateTokens(payload): TokenDto {
    const accessToken = sign(payload, 'SECRET_A', {
      expiresIn: '30m',
    });
    const refreshToken = sign(payload, 'SECRET_R', {
      expiresIn: '10d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      where: { user: userId },
    });
    if (tokenData) {
      Object.assign(tokenData, refreshToken);
      return tokenData;
    }
    const newToken = new TokenEntity();
    Object.assign(newToken, { refreshToken, user: userId });
    console.log(newToken);
    return await this.tokenRepository.save(newToken);
  }

  async findToken(refreshToken) {
    return await this.tokenRepository.findOne({
      where: { refreshToken },
    });
  }

  async removeToken(refreshToken: string): Promise<DeleteResult> {
    const token = await this.findToken(refreshToken);
    if (!token) {
      throw new HttpException('token doesnt exists', HttpStatus.NOT_FOUND);
    }
    return await this.tokenRepository.delete({ refreshToken });
  }
}
