import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { LogOut, Settings, UserIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

export default function CardProfile() {
  const { handleSignout, session } = useAuth();
  const { loggedOnUser } = useUser();
  const navigate = useNavigate();

  const name = loggedOnUser
    ? `${loggedOnUser.firstname} ${loggedOnUser.lastname}`
    : "Loading...";

  const email = loggedOnUser?.email ?? session?.user?.email ?? "Unknown";
  const role = loggedOnUser?.role ?? "unknown";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="border-l px-3 flex items-center gap-3 rounded-none"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {loggedOnUser?.avatar_url ? (
              <img
                src={loggedOnUser.avatar_url}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="font-medium truncate max-w-[120px]">
              {loggedOnUser ? loggedOnUser.lastname : "User"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {role.replace("_", " ")}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {loggedOnUser?.avatar_url ? (
              <img
                src={loggedOnUser.avatar_url}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-medium truncate">{name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {email}
            </span>
          </div>
        </DropdownMenuLabel>

        <Separator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2 p-2.5 cursor-pointer"
            onClick={() => navigate("/protected/profile")}
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <Separator />

          <DropdownMenuItem
            className="flex items-center gap-2 p-2.5 cursor-pointer"
            onClick={() => navigate("/protected/settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <Separator />

          <DropdownMenuItem
            onClick={() => handleSignout()}
            className="flex items-center gap-2 p-2.5 cursor-pointer text-red-500"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
