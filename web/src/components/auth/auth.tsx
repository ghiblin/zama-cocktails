import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "./auth.form";
import { AuthFailed } from "./auth.failed";
import { AuthSuccess } from "./auth.success";

type AuthProps = {
  className?: string;
};

export function Auth({ className }: AuthProps) {
  const { state, checkKey } = useAuth();

  if (state._tag === "Null") {
    return (
      <AuthForm
        checkKey={checkKey}
        loading={state.fetching}
        className={className}
      />
    );
  }

  if (state._tag === "Error") {
    return <AuthFailed message={state.message} className={className} />;
  }

  return <AuthSuccess className={className} />;
}
