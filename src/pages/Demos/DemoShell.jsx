import { Link } from "react-router-dom";

export default function DemoShell({ title, kicker, children, theme }) {
  return (
    <div className={`min-h-dvh ${theme}`}>
      <header className="flex items-center justify-between px-6 py-5">
        <p className="text-sm uppercase tracking-[0.18em]">{title}</p>
        <Link to="/work" className="text-sm opacity-70">
          Back to studio
        </Link>
      </header>
      <p className="px-6 text-xs uppercase tracking-[0.2em] opacity-60">{kicker} · Concept project</p>
      {children}
    </div>
  );
}
