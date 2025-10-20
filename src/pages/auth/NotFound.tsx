import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundAuth() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md space-y-6">
      <header>
        <h2 className="text-9xl font-extrabold text-center">404</h2>
        <p className="text-muted-foreground text-center">
          Page not found. Maybe you meant to sign in?
        </p>
      </header>

      <Button onClick={() => navigate("/auth/signin")} className="w-full">
        Go to Sign In
      </Button>
    </div>
  );
}
