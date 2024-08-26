import { memo } from "react";
import { Alert, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

type AuthSuccssProps = {
  className?: string;
};

export const AuthSuccess = memo(function ({ className }: AuthSuccssProps) {
  return (
    <Alert variant="default" className={className}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Valid API Key</AlertTitle>
    </Alert>
  );
});
