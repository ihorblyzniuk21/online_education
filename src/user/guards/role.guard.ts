import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@app/user/decorators/role-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }
      const request = context
        .switchToHttp()
        .getRequest<ExpressRequestInterface>();

      if (!request.user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      return request.user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );
    } catch (e) {
      throw new HttpException('You do not have access', HttpStatus.FORBIDDEN);
    }
  }
}
