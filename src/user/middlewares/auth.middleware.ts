import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UserService } from '@app/user/user.service';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.cookies.refreshToken) {
      req.user = null;
      next();
      return;
    }

    try {
      const decode = verify(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      const user = await this.userService.getUserByEmail(decode.email);
      req.user = user;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
