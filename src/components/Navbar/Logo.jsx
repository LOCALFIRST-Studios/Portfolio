import { NavLink } from "react-router-dom";
import { useThemeClasses } from "../ThemeVariant";
import { SITE } from "../../data/site";

export default function Logo({ className = "" }) {
  // Different typography styles for each theme - same content, different styling
  const logoClasses = useThemeClasses(
    "font-display text-sm tracking-[0.22em] uppercase", // Night theme
    "font-display text-base tracking-[0.1em]"           // Day theme - more editorial
  );

  return (
    <NavLink to="/" end className={`${logoClasses} ${className}`}>
      {SITE.name}
    </NavLink>
  );
}
