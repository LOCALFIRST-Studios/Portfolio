import { Link } from "react-router-dom";
import ProjectMock from "./ProjectMock";

export default function ProjectCard({ project, featured = false }) {
  return (
    <article className={`group ${featured ? "min-w-[min(80vw,36rem)]" : ""}`}>
      <ProjectMock id={project.id} />
      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-accent">
        Project {project.number} · {project.label}
      </p>
      <h3 className="mt-2 font-display text-3xl">{project.name}</h3>
      <p className="mt-1 text-sm text-muted">{project.category}</p>
      <p className="mt-3 max-w-md text-muted">{project.short}</p>
      <Link
        to={project.demo}
        className="mt-5 inline-flex text-sm text-accent transition-transform duration-200 group-hover:translate-x-1"
      >
        View project
      </Link>
    </article>
  );
}
