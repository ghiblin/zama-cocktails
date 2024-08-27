import { useAuth } from "@/hooks/use-auth";
import { CocktailForm } from "./cocktail.form";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { CocktailList } from "./cocktail.list";
import { Cocktail } from "@/entities/cocktail";
import { CocktailSuccess } from "./cocktail.success";

type View = "Search" | "Create" | "CocktailCreated";

export function Cocktails() {
  const { state } = useAuth();
  const [view, setView] = useState<View>("Search");
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);

  const onDone = useMemo(
    () => (cocktail: Cocktail) => {
      setCocktail(cocktail);
      setView("CocktailCreated");
      setTimeout(() => {
        setView("Search");
      }, 10_000);
    },
    [setView, setCocktail]
  );

  if (state._tag !== "ValidKey") {
    return null;
  }

  return (
    <>
      {state.key.type === "write" && view !== "Create" ? (
        <Button
          onClick={() => setView("Create")}
          className="mb-4"
          aria-label="Create cocktail"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      ) : null}
      {view === "Create" && (
        <CocktailForm onCancel={() => setView("Search")} onDone={onDone} />
      )}
      {view === "Search" && <CocktailList />}
      {view === "CocktailCreated" && cocktail && (
        <CocktailSuccess cocktail={cocktail} />
      )}
    </>
  );
}
