import { Inject, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../../../drizzle/schema';
import { ApiKeyProps, CreateApiKeyProps } from '../../domain/api-key.entity';
import { IApiKeyAdapter } from '../../repositories/api-key.repository';
import { Result } from '../../../utils/result';
import { PG_CONNECTION } from '../../../drizzle/constants';
import { eq } from 'drizzle-orm';

export class DbApiKeyAdapter implements IApiKeyAdapter {
  #logger = new Logger(DbApiKeyAdapter.name);

  constructor(
    @Inject(PG_CONNECTION) private readonly conn: NodePgDatabase<typeof schema>,
  ) {}

  async createApiKey({
    userId,
    type,
  }: CreateApiKeyProps): Promise<Result<ApiKeyProps, Error>> {
    try {
      const rows = await this.conn
        .insert(schema.apiKeys)
        .values({
          userId,
          type,
        })
        .returning({
          id: schema.apiKeys.id,
          createdAt: schema.apiKeys.createdAt,
        });

      if (rows.length === 1) {
        return new Result(
          {
            id: rows[0].id,
            userId,
            type,
            createdAt: rows[0].createdAt,
          },
          null,
        );
      }
    } catch (error) {
      this.#logger.warn(`Failed to create api key: ${error}`);
    }
    return new Result<ApiKeyProps>(null, new Error('Failed to create api key'));
  }

  async findApiKey(id: string): Promise<Result<ApiKeyProps, Error>> {
    try {
      const apiKey = await this.conn.query.apiKeys.findFirst({
        where: eq(schema.apiKeys.id, id),
      });
      if (!apiKey) {
        return new Result<ApiKeyProps>(
          null,
          new Error(`API Key ${id} not found`),
        );
      }
      return new Result(apiKey, null);
    } catch (error) {
      this.#logger.warn(`Failed to query api key: ${error}`);
      return new Result<ApiKeyProps>(
        null,
        new Error(`Failed to query api key by id`),
      );
    }
  }

  async findAllUserApiKeys(
    userId: string,
  ): Promise<Result<ApiKeyProps[], Error>> {
    try {
      const apiKeys = await this.conn.query.apiKeys.findMany({
        where: eq(schema.apiKeys.userId, userId),
      });
      return new Result(apiKeys, null);
    } catch (error) {
      this.#logger.warn(`Failed to query api key by user id ${userId}`);
      return new Result<ApiKeyProps[]>(
        null,
        new Error(`Failed to query api keys by user id`),
      );
    }
  }
}
