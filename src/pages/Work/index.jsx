import { Link } from "react-router-dom";
import Container from "../../components/Container";
import Seo from "../../components/Seo";
import ProjectMock from "../../components/ProjectCard/ProjectMock";
import { projects } from "../../data/projects";

export default function Work() {
  return (
    <>
      <Seo
        title="Work"
        description="Concept and demo websites for gyms, cafés, salons and other local businesses."
        path="/work"
      />
      <section className="py-24">
        <Container>
          <p className="text-sm uppercase tracking-[0.22em] text-accent">Work</p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">Selected concept projects.</h1>
          <p className="mt-4 max-w-2xl text-muted">
            These are demo websites built to show design and development quality. They are not real
            client case studies.
          </p>
          <div className="mt-14 space-y-20">
            {projects.map((project) => (
              <article key={project.id} className="grid gap-10 border-t border-line pt-12 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">
                    {project.number} · {project.label}
                  </p>
                  <h2 className="mt-3 text-3xl">{project.name}</h2>
                  <p className="mt-2 text-sm text-muted">{project.category}</p>
                  <p className="mt-4">{project.short}</p>
                  <p className="mt-4 text-sm text-muted">
                    <strong className="text-ink">Goal.</strong> {project.goal}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    <strong className="text-ink">What we built.</strong> {project.built}
                  </p>
                  <ul className="mt-4 list-disc pl-5 text-sm text-muted">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted">Tech: {project.tech.join(", ")}</p>
                  <Link to={project.demo} className="mt-6 inline-block text-accent">
                    Live demo
                  </Link>
                </div>
                <ProjectMock id={project.id} />
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
