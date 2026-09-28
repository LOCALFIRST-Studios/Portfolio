import Container from "../../components/Container";
import Seo from "../../components/Seo";
import { SITE } from "../../data/site";
import { processSteps } from "../../data/services";

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="An independent digital web studio helping local businesses build a stronger online presence."
        path="/about"
      />
      <section className="py-24">
        <Container>
          <p className="text-sm uppercase tracking-[0.22em] text-accent">About</p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">
            An independent digital web studio helping local businesses build a stronger online presence.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{SITE.positioning}</p>
        </Container>
      </section>

      <section className="pb-16">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">What we do</h2>
            <p className="mt-4 text-muted">
              We design and build websites for gyms, PGs, salons, cafés, restaurants and other local
              businesses. The work is mostly brochure and service sites, with custom features when they
              are actually needed.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Who we serve</h2>
            <p className="mt-4 text-muted">
              Owners who want a professional site, clear pricing, and an easy way for customers to call
              or message on WhatsApp. You do not need to know technical terms to work with us.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Design</h2>
            <p className="mt-4 text-muted">
              Dark or light depending on the brand, readable type, and layouts that feel considered rather
              than templated. Motion is used only when it helps hierarchy, feedback, or storytelling.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Development</h2>
            <p className="mt-4 text-muted">
              Fast pages, clean structure, and code you can keep. Professional and Custom plans include
              the complete source code.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Quality</h2>
            <p className="mt-4 text-muted">
              Mobile-first, accessible enough to use with a keyboard, and honest about what basic SEO
              setup can and cannot do.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Why local businesses</h2>
            <p className="mt-4 text-muted">
              Local businesses often need a better website more than they need a large agency. We keep
              the process short and the pricing visible.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl">Workflow</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {processSteps.map((step) => (
              <li key={step.number} className="rounded-2xl border border-line p-5">
                <p className="text-accent">{step.number}</p>
                <p className="mt-2">{step.title}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
