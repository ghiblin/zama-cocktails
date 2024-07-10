import { SetMetadata } from '@nestjs/common';
import { ApiKeyType } from '../domain/api-key.entity';

export const API_KEY_TYPES = 'api-key-types-key';
export const ApiKeyTypes = (...types: ApiKeyType[]) =>
  SetMetadata(API_KEY_TYPES, types);
