import { useState, useId } from "react";
import emailjs from "emailjs-com";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/shared/password-input";
import { OTPInput, SlotProps } from "input-otp";
import { MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Zod Schemas ---
const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const OtpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits.")
    .max(6, "OTP must be 6 digits."),
});

const ResetSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password too long."),
});

type EmailFormValues = z.infer<typeof EmailSchema>;
type OtpFormValues = z.infer<typeof OtpSchema>;
type ResetFormValues = z.infer<typeof ResetSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { newPassword: "" },
  });

  // --- Step 1: Send OTP ---
  const handleSendOtp = async (data: EmailFormValues) => {
    const { email } = data;
    setEmail(email);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    try {
      const { error } = await supabase
        .from("password_resets")
        .insert([{ email, otp: otpCode, expires_at: expiresAt }]);
      if (error) throw error;

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { email, message: otpCode },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStep("otp");
      toast.success("OTP sent! Please check your email.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again later.");
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (data: OtpFormValues) => {
    const { otp } = data;
    setOtp(otp);

    try {
      const { data: record, error } = await supabase
        .from("password_resets")
        .select("*")
        .eq("email", email)
        .eq("otp", otp)
        .eq("used", false)
        .single();

      if (error || !record) {
        toast.error("Invalid OTP or email.");
        return;
      }

      if (new Date() > new Date(record.expires_at)) {
        toast.error("OTP expired. Please request a new one.");
        return;
      }

      setStep("reset");
      toast.success("OTP verified! Enter your new password.");
    } catch (err) {
      console.error(err);
      toast.error("Error verifying OTP.");
    }
  };

  // --- Step 3: Reset Password ---
  const handleResetPassword = async (data: ResetFormValues) => {
    const { newPassword } = data;
    try {
      const { error } = await supabase.functions.invoke("reset-password", {
        body: { email, newPassword },
      });
      if (error) throw error;

      await supabase
        .from("password_resets")
        .update({ used: true })
        .eq("email", email)
        .eq("otp", otp);

      toast.success("Password successfully reset! Redirecting to login...");

      emailForm.reset();
      otpForm.reset();
      resetForm.reset();

      setTimeout(() => navigate("/auth/signin"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <header>
        <h2 className="text-xl font-semibold">
          {step === "email" && "Forgot Password"}
          {step === "otp" && "Verify OTP"}
          {step === "reset" && "Reset Password"}
        </h2>
        <p className="text-muted-foreground">
          {step === "email" &&
            "Enter your email to receive a 6-digit OTP code."}
          {step === "otp" && "Check your email and enter the OTP below."}
          {step === "reset" &&
            "Enter your new password to complete the reset process."}
        </p>
      </header>

      {/* Step 1: Email */}
      {step === "email" && (
        <form
          onSubmit={emailForm.handleSubmit(handleSendOtp)}
          className="space-y-6"
        >
          <div className="space-y-1 md:space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="juan@montalban.gov.ph"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={emailForm.formState.isSubmitting}
          >
            {emailForm.formState.isSubmitting ? "Sending..." : "Send OTP"}
          </Button>

          <footer className="flex flex-col items-center gap-2 text-sm">
            <Link to="/auth/signin" className="text-secondary hover:underline">
              Back to sign in
            </Link>
          </footer>
        </form>
      )}

      {/* Step 2: OTP */}
      {step === "otp" && (
        <form
          onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
          className="space-y-6"
        >
          <div className="space-y-1 md:space-y-2">
            <Label>OTP Code</Label>
            <CustomOtpInput
              value={otpForm.watch("otp")}
              onChange={(value) => otpForm.setValue("otp", value)}
            />
            {otpForm.formState.errors.otp && (
              <p className="text-red-500 text-sm">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={otpForm.formState.isSubmitting}
          >
            {otpForm.formState.isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>

          <footer className="flex flex-col items-center gap-2 text-sm">
            <button
              type="button"
              className="text-secondary hover:underline"
              onClick={() => setStep("email")}
            >
              Resend OTP
            </button>
            <Link to="/auth/signin" className="text-secondary hover:underline">
              Back to sign in
            </Link>
          </footer>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === "reset" && (
        <form
          onSubmit={resetForm.handleSubmit(handleResetPassword)}
          className="space-y-6"
        >
          <div className="space-y-1 md:space-y-2">
            <Label>New Password</Label>
            <PasswordInput
              placeholder="********"
              {...resetForm.register("newPassword")}
            />
            {resetForm.formState.errors.newPassword && (
              <p className="text-red-500 text-sm">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetForm.formState.isSubmitting}
          >
            {resetForm.formState.isSubmitting
              ? "Resetting..."
              : "Reset Password"}
          </Button>

          <footer className="flex flex-col items-center gap-2 text-sm">
            <Link to="/auth/signin" className="text-secondary hover:underline">
              Back to sign in
            </Link>
          </footer>
        </form>
      )}
    </div>
  );
}

// --- Custom OTPInput Component ---
function CustomOtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <OTPInput
      id={id}
      value={value}
      onChange={onChange}
      maxLength={6}
      containerClassName="flex w-full justify-between items-center gap-3"
      render={({ slots }) => (
        <div className="flex w-full items-center justify-between gap-3">
          {slots.slice(0, 3).map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
          <MinusIcon size={16} className="text-muted-foreground/80" />
          {slots.slice(3).map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  );
}

// --- Slot UI Component ---
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative flex-1 aspect-square flex items-center justify-center border border-input bg-background font-medium text-foreground rounded-md shadow-xs transition-all",
        { "border-ring ring-[3px] ring-ring/50": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
