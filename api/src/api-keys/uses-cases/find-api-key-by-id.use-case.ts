import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from '../repositories/api-key.repository';
import { Result } from '../../utils/result';
import { ApiKey } from '../domain/api-key.entity';

@Injectable()
export class FindApiKeyByIdUseCase {
  constructor(private readonly apiKeyRepo: ApiKeyRepository) {}

  async run(id: string): Promise<Result<ApiKey>> {
    return this.apiKeyRepo.findApiKeyById(id);
  }
}
