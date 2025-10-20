import { useEffect, useState } from "react";
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
import { Camera, Trash } from "lucide-react";

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
  const { handleEditUser, handleUploadAvatar, handleDeleteAvatar } = useUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  /* ---------- SET INITIAL FORM DATA ---------- */
  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        bio: user.bio,
      });
      setPreviewUrl(user.avatar_url || null);
    }
  }, [user, reset]);

  /* ---------- HANDLE IMAGE UPLOAD ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    await handleDeleteAvatar(user.id, user.avatar_path);
    setPreviewUrl(null);
    setAvatarFile(null);
  };

  /* ---------- HANDLE FORM SUBMIT ---------- */
  const onSubmit = async (data: EditUserForm) => {
    if (!user) return;

    const payload: UserUpdate = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      role: data.role,
      bio: data.bio,
    };

    const success = await handleEditUser(user.id, payload);
    if (success && avatarFile) {
      await handleUploadAvatar(user.id, avatarFile);
    }

    reset();
    setAvatarFile(null);
    onClose();
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
              Update the information and avatar of this user.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Avatar Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={
                  previewUrl ||
                  `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=random`
                }
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() =>
                  document.getElementById("editAvatarUpload")?.click()
                }
              >
                <Camera className="w-4 h-4" />
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -bottom-3 -left-3 rounded-full"
                  onClick={handleDelete}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              )}
            </div>

            <input
              id="editAvatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* ✅ First Name */}
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input {...register("firstname")} placeholder="Enter first name" />
            {errors.firstname && (
              <p className="text-sm text-red-500">{errors.firstname.message}</p>
            )}
          </div>

          {/* ✅ Last Name */}
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input {...register("lastname")} placeholder="Enter last name" />
            {errors.lastname && (
              <p className="text-sm text-red-500">{errors.lastname.message}</p>
            )}
          </div>

          {/* ✅ Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* ✅ Role */}
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

          {/* ✅ Bio */}
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              {...register("bio")}
              placeholder="Enter a short biography"
            />
          </div>

          {/* ✅ Footer */}
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
