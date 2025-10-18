import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { User, UserRole, UserUpdate } from "@/types/user-type";
import { useUser } from "@/hooks/useUser";

const editUserSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["secretary", "councilor", "mayor", "vice_mayor", "others"]),
  bio: z.string().optional(),
});

export type EditUserForm = z.infer<typeof editUserSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditUser({ open, onClose, user }: Props) {
  const { handleEditUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "others",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        bio: user.bio,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditUserForm) => {
    const payload: UserUpdate = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      role: data.role,
      bio: data.bio,
    };

    const success = await handleEditUser(user!.id, payload);
    if (success) {
      reset();
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the information of this user.
            </DialogDescription>
          </DialogHeader>

          {/* First Name */}
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input {...register("firstname")} placeholder="Enter first name" />
            {errors.firstname && (
              <p className="text-sm text-red-500">{errors.firstname.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input {...register("lastname")} placeholder="Enter last name" />
            {errors.lastname && (
              <p className="text-sm text-red-500">{errors.lastname.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              defaultValue={user.role}
              onValueChange={(val) => setValue("role", val as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    "secretary",
                    "councilor",
                    "mayor",
                    "vice_mayor",
                    "others",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r
                        .replace("_", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
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
              {...register("bio")}
              placeholder="Enter a short biography"
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
