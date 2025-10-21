import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../shared/logo";

export default function Header() {
  const navs = [
    { name: "councilors", path: "/councilors" },
    { name: "legislative", path: "/legislatives" },
    { name: "about", path: "/about" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-primary shadow-md  w-full z-50">
      <div className="screen h-16 flex items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link to={"/"} className="flex flex-col">
          <Logo size="4xl" />
          <p className="text-[10px] font-medium text-muted-foreground hidden lg:block">
            Municipality of Montalban
          </p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navs.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="hover:text-secondary text-white transition-colors"
            >
              <h4 className="capitalize font-medium">{item.name}</h4>
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-primary shadow-md">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {navs.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="capitalize font-medium text-white hover:text-teal-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
