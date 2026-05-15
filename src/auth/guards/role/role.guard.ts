import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/auth/decorators/roles/roles.decorator';
import { Role } from 'src/auth/decorators/roles/roles.enum';
import { Request } from 'express';

type JWTPayload = { sub: string; email: string; role: Role };

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) return true;

    const user = context.switchToHttp().getRequest<Request>()
      .user as JWTPayload;

    return requiredRole.includes(user?.role);
  }
}
