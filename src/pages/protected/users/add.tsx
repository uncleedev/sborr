import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Camera } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/hooks/useUser";
import { UserCreate } from "@/types/user-type";

/* ✅ Validation Schema */
const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["mayor", "vice_mayor", "councilor", "secretary", "others"], {
    message: "Role is required",
  }),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

export default function AddUser() {
  const { handleAddUser } = useUser();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      role: "others",
      bio: "",
    },
  });

  /* ✅ File Upload + Preview */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* ✅ Submit Handler */
  const onSubmit = async (data: FormValues) => {
    const newUser: UserCreate = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      role: data.role,
      bio: data.bio || "",
    };

    const success = await handleAddUser(newUser, avatarFile ?? undefined);

    if (success) {
      reset();
      setAvatarFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className="font-semibold">Add User</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Add a new system user.</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* ✅ Avatar Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={previewUrl || "     "}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => document.getElementById("avatarUpload")?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* ✅ Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input {...register("firstname")} />
              {errors.firstname && (
                <span className="text-destructive text-sm">
                  {errors.firstname.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input {...register("lastname")} />
              {errors.lastname && (
                <span className="text-destructive text-sm">
                  {errors.lastname.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <span className="text-destructive text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
              {errors.role && (
                <span className="text-destructive text-sm">
                  {errors.role.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Write a short bio..."
                {...register("bio")}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
