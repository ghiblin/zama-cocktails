import { z } from 'zod';
import { Entity } from '../../utils/entity';
import { Result } from '../../utils/result';

const schema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
});

export type UserProps = z.infer<typeof schema>;
export type CreateUserProps = Omit<UserProps, 'id'>;

export class User extends Entity<UserProps> implements Readonly<UserProps> {
  static parse = (data: unknown): Result<User> => {
    const result = schema.safeParse(data);
    if (result.error) {
      return new Result<User>(null, result.error);
    }
    return new Result(new User(result.data), null);
  };

  get id() {
    return this.get('id');
  }

  get email() {
    return this.get('email');
  }

  get name() {
    return this.get('name');
  }

  get picture() {
    return this.get('picture');
  }
}
