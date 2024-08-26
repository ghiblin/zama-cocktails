import { memo } from "react";
import { Alert, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

export const AuthSuccess = memo(function () {
  return (
    <Alert variant="default">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Valid API Key</AlertTitle>
    </Alert>
  );
});
