import { NavLink } from "react-router-dom";
import { SITE } from "../../data/site";

export default function Logo({ className = "" }) {
  return (
    <NavLink to="/" end className={`font-display text-sm tracking-[0.22em] uppercase ${className}`}>
      {SITE.name}
    </NavLink>
  );
}
