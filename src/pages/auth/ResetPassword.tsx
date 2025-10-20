import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Forgot Password</h2>
        <p className="text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </header>

      <form className="space-y-6"></form>

      <footer className="flex flex-col items-center gap-2 text-sm">
        <Link
          to="/auth/forgot-password"
          className="text-secondary hover:underline"
        >
          Forgot your password?
        </Link>
      </footer>
    </div>
  );
}
