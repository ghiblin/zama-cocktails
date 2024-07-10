import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../repositories/api-key.repository';
import { Result } from '../../utils/result';
import { ApiKey, ApiKeyType } from '../domain/api-key.entity';

@Injectable()
export class CreateApiKeyUseCase {
  constructor(private readonly apiKeyRepo: ApiKeyRepository) {}

  async run(userId: string, type: ApiKeyType): Promise<Result<ApiKey>> {
    return this.apiKeyRepo.createApiKey({ userId, type });
  }
}
