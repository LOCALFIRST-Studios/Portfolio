import { Link } from "react-router-dom";
import Container from "../../components/Container";
import Seo from "../../components/Seo";
import { addOns, includedEverywhere, pricingNotes, pricingTiers } from "../../data/pricing";
import { faqs } from "../../data/services";

export default function Pricing() {
  return (
    <>
      <Seo
        title="Services & Pricing"
        description="Transparent pricing for small local-business websites. Starter, Professional and Custom plans."
        path="/pricing"
      />
      <section className="py-24">
        <Container>
          <p className="text-sm uppercase tracking-[0.22em] text-accent">Services & pricing</p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">How much it costs, and what you get.</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Clear plans for local businesses. Domain and hosting are separate. Search rankings are not
            guaranteed.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container className="grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.id}
              className={`rounded-2xl border p-8 ${tier.recommended ? "border-accent" : "border-line"}`}
            >
              {tier.recommended && <p className="text-xs uppercase tracking-[0.18em] text-accent">Recommended</p>}
              <h2 className="mt-2 text-3xl">{tier.name}</h2>
              <p className="mt-3 font-display text-4xl">{tier.price}</p>
              <p className="mt-3 text-muted">{tier.blurb}</p>
              <ul className="mt-8 space-y-2 text-sm text-muted">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link to="/contact" className="mt-8 inline-block text-sm text-accent">
                Start with {tier.name}
              </Link>
            </article>
          ))}
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl">Feature comparison</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-3 font-medium">Included</th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.id} className="py-3 font-medium">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Pages / sections", "3–4", "6–8", "Scoped"],
                  ["Custom UI", "Clean layout", "Premium custom", "Custom"],
                  ["WhatsApp / contact", "Yes", "Yes", "Yes"],
                  ["Basic SEO setup", "Yes", "Yes", "As scoped"],
                  ["Source code", "On request", "Yes", "Yes"],
                  ["Revisions", "1", "2", "As scoped"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-line">
                    {row.map((cell) => (
                      <td key={cell} className="py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">In every website</h2>
            <ul className="mt-6 space-y-3 text-muted">
              {includedEverywhere.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl">Optional add-ons</h2>
            <ul className="mt-6 space-y-4">
              {addOns.map((item) => (
                <li key={item.name}>
                  <p>{item.name}</p>
                  <p className="text-sm text-muted">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-2xl">Domain and hosting</h2>
            <p className="mt-3 text-muted">
              Domain and hosting are separate. You keep ownership. We can help you buy and connect them.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Revisions</h2>
            <p className="mt-3 text-muted">
              A revision is a round of changes after you review a design or build. Extra rounds can be added.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Support</h2>
            <p className="mt-3 text-muted">
              Professional includes 15-day bug support after launch. New features are quoted separately.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl">FAQ</h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-2 text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <Link to="/contact" className="mt-10 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg">
            Start a Project
          </Link>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          {pricingNotes.map((note) => (
            <p key={note} className="text-sm text-muted">
              {note}
            </p>
          ))}
        </Container>
      </section>
    </>
  );
}
