import { z } from "zod";
import { Entity } from "./entity";
import { Either, left, right } from "@/utils/either";

const schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  ingredients: z.array(z.string()),
});

export type CocktailProps = z.infer<typeof schema>;
export type NewCocktailProps = Omit<CocktailProps, "id">;
export class Cocktail
  extends Entity<CocktailProps>
  implements Readonly<CocktailProps>
{
  static parse(data: unknown): Either<string, Cocktail> {
    const result = schema.safeParse(data);
    if (!result.success) {
      return left("Validation failed");
    }
    return right(new Cocktail(result.data));
  }

  get id() {
    return this.get("id");
  }

  get name() {
    return this.get("name");
  }

  get ingredients() {
    return this.get("ingredients");
  }
}
