import { AuthContext } from "@/components/context/auth.context";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);
