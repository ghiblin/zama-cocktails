import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { FindApiKeyByIdUseCase } from '../uses-cases/find-api-key-by-id.use-case';
import { Reflector } from '@nestjs/core';
import { API_KEY_TYPES } from '../decorators/api-key-types.decorator';
import { ApiKeyType } from '../domain/api-key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly findApiKeyByIdUC: FindApiKeyByIdUseCase,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if there is a valid api key
    const request = context.switchToHttp().getRequest();
    const id = this.extractApiKeyIdFromHeader(request);
    if (!id) {
      throw new UnauthorizedException();
    }
    const result = await this.findApiKeyByIdUC.run(id);
    if (result.isErr()) {
      throw new UnauthorizedException();
    }
    const apiKey = result.unwrap();
    request['apikey'] = apiKey;

    // Check if the api key satisfy the right type
    const requiredTypes = this.reflector.getAllAndOverride<ApiKeyType[]>(
      API_KEY_TYPES,
      [context.getHandler(), context.getClass()],
    );
    return requiredTypes.some((type) => type === apiKey.type);
  }

  private extractApiKeyIdFromHeader(request: Request): string | undefined {
    const id = request.headers['x-api-key'];
    return Array.isArray(id) ? id[0] : id;
  }
}
