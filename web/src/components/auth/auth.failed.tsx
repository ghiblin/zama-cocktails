import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CircleXIcon } from "lucide-react";

type AuthFailedProps = {
  message: string;
  className?: string;
};

export const AuthFailed = memo(function ({
  message,
  className,
}: AuthFailedProps) {
  return (
    <Alert variant="destructive" className={className}>
      <CircleXIcon className="h-4 w-4" />
      <AlertTitle>Invalid key</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
});
