import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router";
import {
  Navigation24Filled,
  Dismiss24Filled,
} from "@fluentui/react-icons";
import { incrementLogoClicks } from "~/lib/easter-eggs";
import { ServerStatus } from "~/components/ServerStatus";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/play", label: "Play" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogoClick = useCallback(() => {
    const clicks = incrementLogoClicks();
    if (clicks >= 5) {
      window.dispatchEvent(new CustomEvent("logo-click-easter-egg"));
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-primary-dark)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={handleLogoClick}
        >
          <img
            src="/logo.png"
            alt="WeSurvival"
            className="h-10 w-10 rounded-lg group-hover:scale-110 transition-transform duration-200"
          />
          <span className="font-pixel text-xl text-[var(--color-accent)] group-hover:text-[var(--color-accent-bright)] transition-colors">
            WeSurvival
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Server status + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <ServerStatus variant="navbar" />
          <button
            className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Dismiss24Filled /> : <Navigation24Filled />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-64 border-b border-[var(--color-primary-dark)]" : "max-h-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-[var(--color-surface)]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-light)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
