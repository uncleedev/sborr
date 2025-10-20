import { isElectron } from "@/lib/platform";
import HomePage from "@/pages/home/Home";
import { Navigate } from "react-router-dom";

export default function InitialRoute() {
  return isElectron() ? <Navigate to="/auth/signin" /> : <HomePage />;
}
