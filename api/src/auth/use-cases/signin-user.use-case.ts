import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GoogleRepository } from '../repositories/google.repository';
import { Result } from '../../utils/result';
import { CreateUserUseCase } from '../../user/use-cases';

@Injectable()
/**
 * The user signs in.
 * I receive the Google access token, so I need to retrieve the user's profile,
 * store it in the DB and generate a JWT for further authentication.
 */
export class SigninUserUseCase {
  constructor(
    private readonly googleRepository: GoogleRepository,
    private readonly createUser: CreateUserUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async run(accessToken: string): Promise<Result<string>> {
    // 1. Retrieve user profile
    const dto = await this.googleRepository.retrieveUserProfile(accessToken);
    if (dto.isErr()) {
      console.log(`Failed to retrieve user profile: ${dto.err.message}`);
      return new Result<string>(null, dto.err);
    }

    // 2. Store the user into DB
    const user = await this.createUser.run(dto.unwrap());
    if (user.isErr()) {
      return new Result<string>(null, user.err);
    }

    try {
      // 3. Create JWT
      const payload = { sub: user.unwrap().id, username: user.unwrap().email };
      const accessToken = await this.jwtService.signAsync(payload);

      return new Result(accessToken, null);
    } catch (error) {
      console.error(`Failed to sign jwt: ${error}`);
      return new Result<string>(null, new Error('Failed to sign jwt'));
    }
  }
}
