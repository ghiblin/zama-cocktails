import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '../../utils/result';
import {
  ApiKey,
  ApiKeyProps,
  CreateApiKeyProps,
} from '../domain/api-key.entity';

export const API_KEY_ADAPTER = 'api-key-adapter';

export interface IApiKeyAdapter {
  createApiKey(dto: CreateApiKeyProps): Promise<Result<ApiKeyProps>>;
  findApiKey(id: string): Promise<Result<ApiKeyProps>>;
  findAllUserApiKeys(userId: string): Promise<Result<ApiKeyProps[]>>;
}

@Injectable()
export class ApiKeyRepository {
  #logger = new Logger(ApiKeyRepository.name);

  constructor(
    @Inject(API_KEY_ADAPTER) private readonly adapter: IApiKeyAdapter,
  ) {}

  async createApiKey(dto: CreateApiKeyProps): Promise<Result<ApiKey>> {
    const result = await this.adapter.createApiKey(dto);
    if (result.isErr()) {
      this.#logger.warn(`Failed to create api key: ${result.err.message}`);
      return new Result<ApiKey>(null, result.err);
    }

    return ApiKey.parse(result.unwrap());
  }

  async findApiKeyById(id: string): Promise<Result<ApiKey>> {
    const result = await this.adapter.findApiKey(id);
    if (result.isErr()) {
      this.#logger.warn(`Failed to find api key: ${result.err.message}`);
      return new Result<ApiKey>(null, result.err);
    }

    return ApiKey.parse(result.unwrap());
  }

  async findAllUserApiKeys(userId: string): Promise<Result<ApiKey>[]> {
    const result = await this.adapter.findAllUserApiKeys(userId);
    if (result.isErr()) {
      this.#logger.warn(`Failed to find all api keys: ${result.err.message}`);
      return [new Result<ApiKey>(null, result.err)];
    }

    return result.unwrap().map(ApiKey.parse);
  }
}
