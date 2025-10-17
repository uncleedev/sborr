import { useState } from "react";
import { Card } from "../ui/card";
import Logo from "./logo";
import { Button } from "../ui/button";
import { Menu, XIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "@/constants/nav-links";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const activeIndex = NAV_LINKS.findIndex(
    (link) => location.pathname === link.path
  );

  return (
    <Card
      className={`hidden md:flex flex-col justify-between p-4 transition-[width] duration-300 ease-in-out ${
        isMenuOpen ? "w-[294px]" : "w-[68px]"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between pb-2 border-b-2">
          {isMenuOpen && (
            <header>
              <Logo />
              <p className="text-[10px] font-medium text-muted-foreground">
                Municipality of Montalban
              </p>
            </header>
          )}

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon /> : <Menu />}
          </Button>
        </div>

        <div className="flex flex-col gap-2 relative">
          {activeIndex !== -1 && (
            <div
              className="absolute left-0 w-full h-9 bg-primary rounded-md transition-transform duration-300 ease-out z-0"
              style={{
                transform: `translateY(${activeIndex * 44}px)`,
              }}
            />
          )}

          {NAV_LINKS.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Button
                key={index}
                onClick={() => navigate(link.path)}
                title={link.label}
                className={`w-full relative z-10 transition-colors duration-200 ${
                  isMenuOpen ? "justify-start" : "justify-center"
                } ${
                  isActive
                    ? "text-primary-foreground bg-transparent hover:bg-transparent"
                    : "bg-transparent hover:bg-accent"
                }`}
                variant="ghost"
              >
                <Icon className="size-6" />
                {isMenuOpen && <h4>{link.label}</h4>}
              </Button>
            );
          })}
        </div>
      </div>

      <footer>
        <span className="text-[10px] text-center text-muted-foreground font-medium">
          {isMenuOpen ? (
            <>
              <p>Copyright © 2025</p>
              <p>Developed by EDCB TECH</p>
            </>
          ) : (
            <p className="text-2xl font-semibold">©</p>
          )}
        </span>
      </footer>
    </Card>
  );
}
