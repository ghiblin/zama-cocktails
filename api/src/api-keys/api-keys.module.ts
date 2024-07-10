import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CreateApiKeyUseCase } from './uses-cases';
import { API_KEY_ADAPTER, ApiKeyRepository } from './repositories';
import { ApiKeysController, DbApiKeyAdapter } from './adapter';
import UserModule from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DrizzleModule, AuthModule, UserModule],
  controllers: [ApiKeysController],
  providers: [
    CreateApiKeyUseCase,
    ApiKeyRepository,
    {
      provide: API_KEY_ADAPTER,
      useClass: DbApiKeyAdapter,
    },
  ],
  exports: [],
})
export class ApiKeysModule {}
