import { NavLink } from "react-router-dom";
import { NAV_LINKS, SITE } from "../../data/site";
import Container from "../Container";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-12">
      <Container wide className="grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display tracking-[0.2em] uppercase">{SITE.name}</p>
          <p className="mt-3 max-w-sm text-sm text-muted">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Navigate</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === "/"} className="text-sm hover:text-accent">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Start</p>
          <p className="mt-3 text-sm text-muted">
            Independent web studio. Not presented as a registered company.
          </p>
          <NavLink to="/contact" className="mt-4 inline-block text-sm text-accent">
            Start a Project
          </NavLink>
        </div>
      </Container>
    </footer>
  );
}
