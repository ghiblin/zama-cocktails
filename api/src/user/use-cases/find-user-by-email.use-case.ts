import { UserRepository } from '../repositories/user.repository';
import { Result } from '../../utils/result';
import { User } from '../domain/user.entity';
import { Inject, Logger } from '@nestjs/common';

export class FindUserByEmailUseCase {
  #logger = new Logger(FindUserByEmailUseCase.name);

  @Inject(UserRepository)
  private readonly userRepo: UserRepository;

  async run(email: string): Promise<Result<User>> {
    this.#logger.debug(`email: ${email}`);
    this.#logger.debug(`userRepo: ${this.userRepo}`);
    const values = await this.userRepo.findUserByEmail(email);
    if (values.isErr()) {
      this.#logger.log(`failed: ${values.err.message}`);
      return new Result<User>(null, values.err);
    }
    return User.parse(values.unwrap());
  }
}
