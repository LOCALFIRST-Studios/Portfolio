import { NavLink } from "react-router-dom";
import { useThemeSite } from "../../hooks/useThemeSite";
import { useThemeClasses } from "../ThemeVariant";

export default function Logo({ className = "" }) {
  const site = useThemeSite();
  
  // Different typography styles for each theme
  const logoClasses = useThemeClasses(
    "font-display text-sm tracking-[0.22em] uppercase", // Night theme
    "font-display text-base tracking-[0.1em]"           // Day theme - more editorial
  );

  return (
    <NavLink to="/" end className={`${logoClasses} ${className}`}>
      {site.name}
    </NavLink>
  );
}
