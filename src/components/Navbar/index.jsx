import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../data/site";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background,border-color,backdrop-filter] duration-200 ${
        scrolled || open
          ? "border-line bg-[rgba(7,9,13,0.88)] backdrop-blur-xl"
          : "border-transparent bg-[rgba(7,9,13,0.35)] backdrop-blur-md"
      }`}
    >
      <div className="container-wide flex items-center justify-between py-4">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative transition-colors duration-200 hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 ${
                  isActive ? "text-ink after:scale-x-100" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className="rounded-full border border-line-strong px-4 py-2 text-ink transition-colors duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent"
          >
            Start a Project
          </NavLink>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full min-h-dvh border-t border-line bg-bg px-6 py-8 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-6 text-3xl font-display">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/contact" className="text-accent">
              Start a Project
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
