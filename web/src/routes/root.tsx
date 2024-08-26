import { AuthProvider } from "@/components/context/auth.context";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <AuthProvider>
      <main className="container mx-auto">
        <Outlet />
      </main>
    </AuthProvider>
  );
}
