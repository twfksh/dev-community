import { Request } from 'express';

export default function extractTokenFromHeader(
  req: Request,
): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
