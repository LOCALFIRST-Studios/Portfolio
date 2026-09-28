import MagneticButton from "../../components/MagneticButton";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container-site">
        <div data-reveal className="rounded-3xl border border-line bg-bg-elevated p-10 md:p-16">
          <h2 className="max-w-3xl text-3xl md:text-6xl">Ready to start a project?</h2>
          <p className="mt-4 max-w-xl text-muted">
            Tell us what the business needs. We will come back with a clear scope.
          </p>
          <div className="mt-8">
            <MagneticButton to="/contact">Start a Project</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
