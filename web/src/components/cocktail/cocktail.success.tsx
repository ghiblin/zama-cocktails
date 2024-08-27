import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { Cocktail } from "@/entities/cocktail";

type CocktailSuccessProps = {
  cocktail: Cocktail;
  className?: string;
};

export const CocktailSuccess = memo(function ({
  cocktail,
  className,
}: CocktailSuccessProps) {
  return (
    <Alert variant="default" className={className}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>New cocktail created</AlertTitle>
      <AlertDescription>
        You successfully created a "{cocktail.name}" Cocktail
      </AlertDescription>
    </Alert>
  );
});
