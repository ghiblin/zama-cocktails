import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CreateApiKeyUseCase } from './uses-cases';
import { API_KEY_ADAPTER, ApiKeyRepository } from './repositories';
import { ApiKeysController, DbApiKeyAdapter } from './adapter';
import UserModule from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { FindApiKeyByIdUseCase } from './uses-cases/find-api-key-by-id.use-case';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [DrizzleModule, AuthModule, UserModule],
  controllers: [ApiKeysController],
  providers: [
    CreateApiKeyUseCase,
    FindApiKeyByIdUseCase,
    ApiKeyRepository,
    {
      provide: API_KEY_ADAPTER,
      useClass: DbApiKeyAdapter,
    },
    ApiKeyGuard,
  ],
  exports: [ApiKeyGuard, FindApiKeyByIdUseCase],
})
export class ApiKeysModule {}
