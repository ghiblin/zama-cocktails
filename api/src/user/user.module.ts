import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { USER_ADAPTER, UserRepository } from './repositories/user.repository';
import { DbUserAdapter } from './adapter/secondary/db-user.adapter';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdlUseCase,
} from './use-cases';

@Module({
  imports: [DrizzleModule],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdlUseCase,
    UserRepository,
    {
      provide: USER_ADAPTER,
      useClass: DbUserAdapter,
    },
  ],
  exports: [CreateUserUseCase, FindUserByEmailUseCase, FindUserByIdlUseCase],
})
export default class UserModule {}
