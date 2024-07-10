import { z } from 'zod';
import { Entity } from '../../utils/entity';
import { Result } from '../../utils/result';

export const ApiKeyTypes = {
  Read: 'read',
  Write: 'write',
} as const;

export type ApiKeyType = (typeof ApiKeyTypes)[keyof typeof ApiKeyTypes];

const schema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(ApiKeyTypes),
  createdAt: z.date().optional(),
});

export type ApiKeyProps = z.infer<typeof schema>;
export type CreateApiKeyProps = Omit<ApiKeyProps, 'id' | 'createdAt'>;

export class ApiKey
  extends Entity<ApiKeyProps>
  implements Readonly<ApiKeyProps>
{
  static parse = (data: unknown): Result<ApiKey> => {
    const result = schema.safeParse(data);
    if (result.error) {
      return new Result<ApiKey>(null, result.error);
    }
    return new Result(new ApiKey(result.data), null);
  };

  get id() {
    return this.get('id');
  }

  get userId() {
    return this.get('userId');
  }

  get type() {
    return this.get('type');
  }
}
