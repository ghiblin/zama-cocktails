import { z } from "zod";
import { Entity } from "./entity";
import { Either, left, right } from "@/utils/either";

const schema = z.object({
  id: z.string(),
  type: z.enum(["read", "write"]),
});

export type ApiKeyProps = z.infer<typeof schema>;
export class ApiKey
  extends Entity<ApiKeyProps>
  implements Readonly<ApiKeyProps>
{
  static parse(data: unknown): Either<string, ApiKey> {
    const result = schema.safeParse(data);
    if (!result.success) {
      return left("Validation failed");
    }
    return right(new ApiKey(result.data));
  }

  get id() {
    return this.get("id");
  }

  get type() {
    return this.get("type");
  }
}
