import { UserRepository } from '../repositories/user.repository';
import { Result } from '../../utils/result';
import { User } from '../domain/user.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FindUserByIdlUseCase {
  #logger = new Logger(FindUserByIdlUseCase.name);

  @Inject()
  private readonly userRepo: UserRepository;

  async run(id: string): Promise<Result<User>> {
    this.#logger.verbose(`id: ${id}`);
    const values = await this.userRepo.findUserById(id);
    if (values.isErr()) {
      this.#logger.warn(`Failed: ${values.err.message}`);
      return new Result<User>(null, values.err);
    }
    return User.parse(values.unwrap());
  }
}
