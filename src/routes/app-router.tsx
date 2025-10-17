import { isElectron } from "@/lib/platform";
import { HashRouter, BrowserRouter } from "react-router-dom";

export const AppRouter = isElectron() ? HashRouter : BrowserRouter;
