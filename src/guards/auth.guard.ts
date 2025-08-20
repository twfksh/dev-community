import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../types/auth-payload';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import extractTokenFromHeader from '../helpers/auth.helper';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(
        'Invalid credentials. Please provide a valid token.',
      );
    }

    const cachedRoles = await this.cacheManager.get<string[]>(`user_roles_${req['user'].sub}`);
    if (cachedRoles) {
      req['user'].roles = cachedRoles;
      return true;
    }

    const payload = await this.jwtService
      .verifyAsync<AuthPayload>(token)
      .catch(() => {
        throw new UnauthorizedException(
          'Invalid credentials. Token is invalid or expired.',
        );
      });

    await this.cacheManager.set(`user_roles_${req['user'].sub}`, payload.role);

    req['user'] = payload;

    return true;
  }
}
