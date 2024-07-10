import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { USER_ADAPTER, UserRepository } from './repositories/user.repository';
import { DbUserAdapter } from './adapter';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdlUseCase,
} from './use-cases';

@Module({
  imports: [DrizzleModule],
  providers: [
    {
      provide: USER_ADAPTER,
      useClass: DbUserAdapter,
    },
    UserRepository,
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdlUseCase,
  ],
  exports: [CreateUserUseCase, FindUserByEmailUseCase, FindUserByIdlUseCase],
})
export default class UserModule {}
