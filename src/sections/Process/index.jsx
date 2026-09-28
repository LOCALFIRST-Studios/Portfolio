import { processSteps } from "../../data/services";

export default function Process() {
  return (
    <section className="py-24">
      <div className="container-site">
        <h2 data-reveal className="text-3xl md:text-5xl">
          How a project works
        </h2>
        <ol className="mt-12 grid gap-0">
          {processSteps.map((step, index) => (
            <li key={step.number} data-reveal className="grid grid-cols-[4rem_1fr] gap-4 border-t border-line py-6">
              <span className="text-accent">{step.number}</span>
              <span className="text-2xl md:text-3xl">
                {step.title}
                {index < processSteps.length - 1 ? "" : ""}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
