import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '@app/token/token.entity';
import { DeleteResult, Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { GenerateTokenInterface } from '@app/token/types/generateToken.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}

  //TODO add .development.env
  generateTokens(payload): GenerateTokenInterface {
    const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, {
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

  async saveToken(user, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      where: { user: user },
    });

    if (tokenData) {
      Object.assign(tokenData, { refreshToken });
      return await this.tokenRepository.save(tokenData);
    }
    const newToken = new TokenEntity();
    Object.assign(newToken, { refreshToken, user: user.id });
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
