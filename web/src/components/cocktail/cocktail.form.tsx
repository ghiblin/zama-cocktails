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

const schema = z.object({
  name: z
    .string()
    .min(5, "The cocktail's name should be at least 5 chars long"),
  ingredients: z.array(
    z.object({
      name: z
        .string()
        .min(2, "An ingredient's name should be at least 2 chars long"),
    })
  ),
});

type CocktailFormProps = {
  cancel: () => void;
};

export function CocktailForm({ cancel }: CocktailFormProps) {
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

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <Card className="w-[350px] mx-auto mt-4">
      <CardHeader>
        <CardTitle>New Cocktail</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          append({ name: "" });
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="default">Save</Button>
        <Button variant="destructive" onClick={cancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
