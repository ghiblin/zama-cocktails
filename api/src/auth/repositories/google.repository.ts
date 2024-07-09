import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../utils/result';
import { CreateUserProps } from '../../user/domain/user.entity';

export const GOOGLE_ADAPTER = 'google-adapter';
export interface IGoogleAdapter {
  getUserProfile(accessToken: string): Promise<Result<CreateUserProps>>;
}

@Injectable()
export class GoogleRepository {
  constructor(
    @Inject(GOOGLE_ADAPTER) private readonly adapter: IGoogleAdapter,
  ) {}

  async retrieveUserProfile(
    accessToken: string,
  ): Promise<Result<CreateUserProps>> {
    return this.adapter.getUserProfile(accessToken);
  }
}
