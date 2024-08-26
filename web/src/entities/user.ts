import { z } from "zod";
import { Entity } from "./entity";
import { Either, left, right } from "@/utils/either";

const schema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["read", "write"]),
});

export type UserProps = z.infer<typeof schema>;
export class User extends Entity<UserProps> implements Readonly<UserProps> {
  static parse(data: unknown): Either<string, User> {
    const result = schema.safeParse(data);
    if (!result.success) {
      return left("Validation failed");
    }
    return right(new User(result.data));
  }

  get id() {
    return this.get("id");
  }

  get type() {
    return this.get("type");
  }

  get userId() {
    return this.get("userId");
  }
}
