import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Bell, Menu } from "lucide-react";
import Logo from "./logo";
import { NAV_LINKS } from "@/constants/nav-links";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ToggleMode from "./toggle-mode";
import CardProfile from "../cards/card-profile";

export default function Topbar() {
  const location = useLocation();
  const activePath = location.pathname.replace("/admin/", "");

  return (
    <Card className="w-full flex-row items-center justify-between p-4">
      <h3 className="hidden md:block text-muted-foreground">
        SBORR /{" "}
        <span className="text-foreground uppercase">{activePath.slice(1)}</span>
      </h3>

      {/* MOBILE LOGO */}
      <div className="block md:hidden">
        <Logo />
      </div>

      {/* DESKTOP CONTROLS */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex gap-1.5">
          <Button size={"icon"} variant={"ghost"} title="notifications">
            <Bell className="size-5" />
          </Button>
          <ToggleMode />
        </div>
        <CardProfile />
      </div>

      {/* MOBILE MENU TRIGGER */}
      <div className="block md:hidden">
        <SidebarMobile />
      </div>
    </Card>
  );
}

export const SidebarMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85%] max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
          <SheetDescription className="text-left text-sm text-muted-foreground">
            Municipality of Montalban
          </SheetDescription>
        </SheetHeader>

        {/* MOBILE NAVIGATION */}
        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {NAV_LINKS.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Button
                key={index}
                onClick={() => navigate(link.path)}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-transparent hover:bg-accent"
                }`}
                variant="ghost"
              >
                <Icon className="size-5" />
                <span>{link.label}</span>
              </Button>
            );
          })}
        </div>

        {/* MOBILE FOOTER */}
        <div className="mt-auto border-t bg-muted/30">
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Controls
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 h-9 w-9"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <ToggleMode />
              </div>
            </div>
          </div>

          <div className="p-4 pt-2">
            <CardProfile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
