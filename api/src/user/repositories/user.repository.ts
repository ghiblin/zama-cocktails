import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '../../utils/result';
import { CreateUserProps, User, UserProps } from '../domain/user.entity';

export const USER_ADAPTER = 'user-adapter';
export interface IUserAdapter {
  createUser(dto: CreateUserProps): Promise<Result<UserProps>>;
  findUserByEmail(email: string): Promise<Result<UserProps>>;
  findUserById(id: string): Promise<Result<UserProps>>;
}

@Injectable()
export class UserRepository {
  #logger = new Logger(UserRepository.name);

  constructor(@Inject(USER_ADAPTER) private readonly adapter: IUserAdapter) {
    this.#logger.debug(`new instance: ${this.adapter}`);
  }

  async createUser(dto: CreateUserProps): Promise<Result<User>> {
    const result = await this.adapter.createUser(dto);
    if (result.isErr()) {
      this.#logger.warn(`Failed to create user: ${result.err.message}`);
      return new Result<User>(null, result.err);
    }

    return User.parse(result.unwrap());
  }

  async findUserByEmail(email: string): Promise<Result<User>> {
    const result = await this.adapter.findUserByEmail(email);
    if (result.isErr()) {
      this.#logger.warn(`Failed to find user by emai: ${result.err.message}`);
      return new Result<User>(null, result.err);
    }

    return User.parse(result.unwrap());
  }

  async findUserById(id: string): Promise<Result<User>> {
    const result = await this.adapter.findUserById(id);
    if (result.isErr()) {
      this.#logger.warn(`Failed to find user by id: ${result.err.message}`);
      return new Result<User>(null, result.err);
    }

    return User.parse(result.unwrap());
  }
}
