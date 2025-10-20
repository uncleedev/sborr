import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { SigninFormValues, SigninSchema } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function SigninPage() {
  const { handleSignin } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninFormValues) => {
    const success = await handleSignin(data.email, data.password);

    if (success) reset();
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Sign in</h2>
        <p className="text-muted-foreground">
          Welcome back! Please sign in to continue.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1 md:space-y-2">
            <Label>Email</Label>
            <Input placeholder="juan@montalban.gov.ph" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label>Password</Label>
            <PasswordInput placeholder="********" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

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
