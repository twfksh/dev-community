import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../dtos/auth-payload.dto';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import extractTokenFromHeader from '../auth.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

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

    const payload = await this.jwtService
      .verifyAsync<AuthPayload>(token)
      .catch(() => {
        throw new UnauthorizedException(
          'Invalid credentials. Token is invalid or expired.',
        );
      });

    req['user'] = payload;

    return true;
  }
}
