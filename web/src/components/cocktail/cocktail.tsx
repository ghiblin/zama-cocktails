import { useAuth } from "@/hooks/use-auth";
import { CocktailForm } from "./cocktail.form";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { CocktailList } from "./cocktail.list";

type View = "Search" | "Create";

export function Cocktails() {
  const { state } = useAuth();
  const [view, setView] = useState<View>("Search");

  if (state._tag !== "ValidKey") {
    return null;
  }

  return (
    <>
      {state.key.type === "write" && view !== "Create" ? (
        <Button onClick={() => setView("Create")} className="mb-4">
          <PlusIcon className="w-4 h-4" />
        </Button>
      ) : null}
      {view === "Create" ? (
        <CocktailForm cancel={() => setView("Search")} />
      ) : (
        <CocktailList />
      )}
    </>
  );
}
