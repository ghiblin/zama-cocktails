import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { FindUserByEmailUseCase } from '../../user/use-cases';
import type { IJwtPayload } from '../domain/jwt.payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly findUserByEmail: FindUserByEmailUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token);

      const { email } = payload;
      const user = await this.findUserByEmail.run(email);
      if (user.isErr()) {
        throw new ForbiddenException();
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = user.unwrap();
    } catch {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
