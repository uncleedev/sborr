import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { formatDateWithOrdinal } from "@/lib/utils";
import { Camera, Calendar, UserPen } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { PasswordInput } from "@/components/shared/password-input";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    loggedOnUser,
    handleEditUser,
    handleUploadAvatar,
    handleDeleteAvatar,
  } = useUser();
  const { session } = useAuth();
  const newPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (loggedOnUser) {
      setForm({
        firstname: loggedOnUser.firstname || "",
        lastname: loggedOnUser.lastname || "",
        bio: loggedOnUser.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [loggedOnUser]);

  useEffect(() => {
    if (editMode && newPasswordRef.current) {
      newPasswordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [editMode]);

  const initials =
    (loggedOnUser?.firstname?.charAt(0) || "") +
    (loggedOnUser?.lastname?.charAt(0) || "");

  const lastLogin = session?.user?.last_sign_in_at
    ? formatDateWithOrdinal(session.user.last_sign_in_at)
    : "—";
  const memberSince = loggedOnUser?.created_at
    ? formatDateWithOrdinal(loggedOnUser.created_at)
    : "—";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let updatedSomething = false;

      if (loggedOnUser?.id) {
        const updated = await handleEditUser(loggedOnUser.id, {
          firstname: form.firstname,
          lastname: form.lastname,
          bio: form.bio,
        });
        if (!updated) throw new Error("Failed to update profile.");
        updatedSomething = true;
      }

      if (form.newPassword) {
        if (!form.currentPassword)
          throw new Error("Please provide your current password.");
        if (form.newPassword !== form.confirmPassword)
          throw new Error("Passwords do not match.");

        await authService.updatePassword(
          form.currentPassword,
          form.newPassword
        );
        updatedSomething = true;
      }

      if (updatedSomething) {
        toast.success("Profile updated successfully!");
      }

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setEditMode(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <div className="flex items-center gap-2">
            {editMode && (
              <Button type="submit" form="profileForm" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
            <Button
              onClick={() => setEditMode(!editMode)}
              type="button"
              variant={"outline"}
            >
              <UserPen className="w-4 h-4" />
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </header>

        <form id="profileForm" onSubmit={onSubmit}>
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Basic Information */}
              <Card className="p-6">
                <h4 className="font-semibold text-lg mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      First Name
                    </label>
                    {editMode ? (
                      <input
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-teal-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">
                        {loggedOnUser?.firstname || "—"}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Last Name
                    </label>
                    {editMode ? (
                      <input
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-teal-500"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">
                        {loggedOnUser?.lastname || "—"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 font-medium flex items-center gap-1">
                      Email Address
                    </label>
                    <p className="mt-1 text-sm font-medium">
                      {loggedOnUser?.email || "—"}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <label className="text-sm text-gray-600 font-medium">
                    Bio
                  </label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      disabled={loading}
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:ring-teal-500"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium whitespace-pre-wrap">
                      {loggedOnUser?.bio || "—"}
                    </p>
                  )}
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-6">
                <h4 className="font-semibold text-lg mb-4">
                  Security Settings
                </h4>
                {editMode ? (
                  <div className="grid gap-3">
                    <PasswordInput
                      name="currentPassword"
                      placeholder="Enter current password"
                      value={form.currentPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <PasswordInput
                      name="newPassword"
                      placeholder="Enter new password"
                      ref={newPasswordRef}
                      value={form.newPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <PasswordInput
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Passwords are hidden for your security. Click “Edit Profile”
                    to change.
                  </p>
                )}
              </Card>
            </div>

            {/* Right Column */}
            <div className="col-span-1 flex flex-col gap-6">
              {/* Profile Picture */}
              <Card className="p-6 text-center">
                <h4 className="font-semibold text-lg mb-4">Profile Picture</h4>

                <div className="relative w-32 h-32 mx-auto mb-4">
                  {loggedOnUser?.avatar_url ? (
                    <img
                      src={loggedOnUser.avatar_url}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded-full object-cover border shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      {initials || "?"}
                    </div>
                  )}

                  {editMode && (
                    <>
                      {/* Upload Button */}
                      <label
                        htmlFor="avatarUpload"
                        className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100 transition"
                      >
                        <Camera className="w-4 h-4 text-gray-700" />
                        <input
                          id="avatarUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !loggedOnUser?.id) return;

                            try {
                              await handleUploadAvatar(loggedOnUser.id, file);
                            } catch (err: any) {
                              toast.error(
                                err.message || "Failed to upload avatar"
                              );
                            }
                          }}
                        />
                      </label>

                      {/* Delete Button */}
                      {loggedOnUser?.avatar_url && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-red-600"
                          onClick={async () => {
                            if (!loggedOnUser?.id) return;
                            try {
                              await handleDeleteAvatar(
                                loggedOnUser.id,
                                loggedOnUser.avatar_path
                              );
                            } catch (err: any) {
                              toast.error(
                                err.message || "Failed to delete avatar"
                              );
                            }
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </>
                  )}
                </div>

                <p className="font-medium">
                  {loggedOnUser?.firstname} {loggedOnUser?.lastname}
                </p>
                <p className="text-sm text-gray-600">
                  {loggedOnUser?.role || "—"}
                </p>
              </Card>

              {/* Account Info */}
              <Card className="p-6">
                <h4 className="font-semibold text-lg mb-4">
                  Account Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Member since
                    </label>
                    <p className="text-sm font-medium mt-1">{memberSince}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Last login
                    </label>
                    <p className="text-sm font-medium mt-1">{lastLogin}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
