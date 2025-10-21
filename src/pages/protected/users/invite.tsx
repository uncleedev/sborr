import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";

const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  role: z.enum(["mayor", "vice_mayor", "councilor", "secretary", "others"], {
    message: "Please select a role",
  }),
  bio: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type UserForm = z.infer<typeof userSchema>;

export default function InviteUser() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserForm) => {
    try {
      const result = await authService.inviteUser(data);
      console.log("Invite result:", result);
      toast.success("Successfully invited user");
      reset();
    } catch (error: any) {
      console.error("Invite error:", error);
      toast.error(error.message || "Failed to invite user");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          <span className="font-medium ml-2">Invite User</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
            <DialogDescription>
              Create an account for a new user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label>First name</Label>
              <Input placeholder="Juan" {...register("firstname")} />
              {errors.firstname && (
                <p className="text-sm text-red-500">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input placeholder="Dela Cruz" {...register("lastname")} />
              {errors.lastname && (
                <p className="text-sm text-red-500">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                onValueChange={(value) =>
                  setValue("role", value as UserForm["role"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="mayor">Mayor</SelectItem>
                    <SelectItem value="vice_mayor">Vice Mayor</SelectItem>
                    <SelectItem value="councilor">Councilor</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Write a short bio..."
                {...register("bio")}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="juan@montalban.gov.ph"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <PasswordInput {...register("password")} placeholder="********" />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Inviting..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
