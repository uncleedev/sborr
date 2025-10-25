// src/pages/auth/ResetPasswordPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ResetPasswordPage() {
  const { handleResetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultEmail = params.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; otp: string; newPassword: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = async (data: any) => {
    const success = await handleResetPassword(
      data.email,
      data.otp,
      data.newPassword
    );
    if (success) navigate("/auth/signin");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">Reset Password</h2>
      <p className="text-center text-muted-foreground">
        Enter the OTP sent to your email and set your new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input {...register("email")} readOnly />
        </div>

        <div>
          <Label>OTP</Label>
          <Input {...register("otp")} placeholder="123456" />
          {errors.otp && (
            <p className="text-red-500 text-sm">{errors.otp.message}</p>
          )}
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            {...register("newPassword")}
            type="password"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
