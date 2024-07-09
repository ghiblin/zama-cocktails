import { UserRepository } from '../repositories/user.repository';
import { Result } from '../../utils/result';
import { User } from '../domain/user.entity';

export class FindUserByIdlUseCase {
  constructor(private readonly userRepo: UserRepository) {}
  async run(id: string): Promise<Result<User>> {
    const values = await this.userRepo.findUserById(id);
    if (values.isErr()) {
      return new Result<User>(null, values.err);
    }
    return User.parse(values.unwrap());
  }
}
