import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { api } from "@/api";
import { Cocktail } from "@/entities/cocktail";
import { useMemo, useState } from "react";
import { match } from "@/utils/either";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z
    .string()
    .min(5, "The cocktail's name should be at least 5 chars long"),
  ingredients: z.array(
    z.object({
      name: z
        .string()
        .trim()
        .min(2, "An ingredient's name should be at least 2 chars long")
        .or(z.literal("")),
    })
  ),
});

type CocktailFormProps = {
  onCancel: () => void;
  onDone: (cocktail: Cocktail) => void;
};

export function CocktailForm({ onCancel, onDone }: CocktailFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      ingredients: [{ name: "" }],
    },
  });
  const { fields, append } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });
  const [error, setError] = useState<string | null>(null);

  const showError = useMemo(
    () => (error: string) => {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 10_000);
    },
    [setError]
  );

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log(`onSubmit: ${JSON.stringify(values)}`);
    const cocktail = await api.createCocktail({
      name: values.name,
      ingredients: values.ingredients.filter((i) => i.name).map((i) => i.name),
    });
    match({
      onLeft: showError,
      onRight: onDone,
    })(cocktail);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-[350px] mx-auto mt-4">
          <CardHeader>
            <CardTitle>New Cocktail</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Cocktail's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingredient"
                      {...form.register(
                        `ingredients.${field.value.length - 1}.name`
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (e.currentTarget.value.trim()) {
                            append({ name: "" });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <div className="flex flex-row flex-wrap gap-2">
                    {fields
                      .filter((i) => i.name.trim() !== "")
                      .map((ingredient) => (
                        <Badge key={ingredient.id} className="px-4">
                          {ingredient.name}
                        </Badge>
                      ))}
                  </div>
                </FormItem>
              )}
            />
            {error && (
              <p className={cn("text-sm font-medium text-destructive")}>
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="default" name="create" type="submit">
              Create
            </Button>
            <Button variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
