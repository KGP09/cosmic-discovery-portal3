import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Satellite } from "lucide-react";

import { cn } from "../lib/utils";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import UserMenu from "./Auth/UserMenu";
import Button from "./ui/Button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || params.get("q") || "");
  }, [location.search]);

  const handleSearch = (query) => {
    if (location.pathname.includes("/planets")) {
      navigate(`/planets?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.includes("/missions")) {
      navigate(`/missions?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Planets", path: "/planets" },
    { name: "Missions", path: "/missions" },
    { name: "Space3D", path: "/space3D" },
    { name: "Solar System 3D", path: "/solar-system-3d" },
    { name: "Satellites", path: "/satellites", icon: <Satellite className="h-4 w-4" /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "backdrop-blur-md py-2 bg-background/80 shadow-sm" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Cosmic Explorer">
          <span className="text-2xl font-display tracking-tight text-white">CosmicExplorer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative text-lg font-light transition-colors hover:text-blue-900 flex items-center gap-1",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                location.pathname === link.path ? "text-blue-900 after:w-full" : "text-white"
              )}
            >
              {link.icon && link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar placeholder="Search planets & missions..." onSearch={handleSearch} className="hidden md:flex" />
          <ThemeToggle />
          <UserMenu />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 animate-fade-in" /> : <Menu className="h-5 w-5 animate-fade-in" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel animate-fade-up p-4 mt-2 mx-4 rounded-lg">
          <div className="mb-3">
            <SearchBar expanded placeholder="Search planets & missions..." onSearch={handleSearch} />
          </div>
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md transition-colors flex items-center gap-2",
                  location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.icon && link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
