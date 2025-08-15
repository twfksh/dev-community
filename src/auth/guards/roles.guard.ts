import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../dtos/auth-payload.dto';
import extractTokenFromHeader from '../auth.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(
        'Invalid credentials. Please provide a valid token.',
      );
    }

    const payload = await this.jwtService
      .verifyAsync<AuthPayload>(token)
      .catch(() => {
        throw new UnauthorizedException(
          'Invalid credentials. Token is invalid or expired.',
        );
      });

    req['user'] = payload;
    return requiredRoles.some((role) => payload.role?.includes(role));
  }
}
