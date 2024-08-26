import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "./auth.form";
import { AuthFailed } from "./auth.failed";
import { AuthSuccess } from "./auth.success";

export function Auth() {
  const { state, checkKey } = useAuth();

  if (state._tag === "Null") {
    return <AuthForm checkKey={checkKey} loading={state.fetching} />;
  }

  if (state._tag === "Error") {
    return <AuthFailed message={state.message} />;
  }

  return <AuthSuccess />;
}
