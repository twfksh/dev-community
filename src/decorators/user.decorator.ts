import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthPayload } from 'src/types/auth-payload';

export const User = createParamDecorator(
  (data: keyof AuthPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthPayload }>();
    return data ? req.user?.[data] : req.user;
  },
);
