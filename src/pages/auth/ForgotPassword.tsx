import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { handleForgotPassword } = useAuth();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    const success = await handleForgotPassword(data.email);

    if (success) reset();
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Forgot Password</h2>
        <p className="text-muted-foreground">
          Enter your email and we’ll send you instructions to reset your
          password.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input {...register("email")} placeholder="juan@motalban.gov.ph" />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {" "}
          {isSubmitting ? "Submit..." : "Submit"}
        </Button>
      </form>

      <footer className="flex flex-col items-center gap-2 text-sm">
        <Link to="/auth/signin" className="text-secondary hover:underline">
          Back to signin
        </Link>
      </footer>
    </div>
  );
}
