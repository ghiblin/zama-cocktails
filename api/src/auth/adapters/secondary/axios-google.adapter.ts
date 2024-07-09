import { Injectable } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { CreateUserProps } from '../../../user/domain/user.entity';
import { Result } from '../../../utils/result';
import { IGoogleAdapter } from 'src/auth/repositories/google.repository';

type UserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

@Injectable()
export class AxiosGoogleAdapter implements IGoogleAdapter {
  async getUserProfile(accessToken: string): Promise<Result<CreateUserProps>> {
    try {
      const response = await axios.get<UserInfo>(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.data) {
        const { email, name, picture } = response.data;
        return new Result({ email, name, picture }, null);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.message);
      }
    }
    return new Result<CreateUserProps>(
      null,
      new Error('Failed to retrieve user profile'),
    );
  }
}
