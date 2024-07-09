import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserProps, User } from '../domain/user.entity';
import { Result } from '../../utils/result';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async run(dto: CreateUserProps): Promise<Result<User>> {
    return this.userRepo.createUser(dto);
  }
}
