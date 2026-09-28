import MagneticButton from "../../components/MagneticButton";
import { pricingNotes, pricingTiers } from "../../data/pricing";

export default function PricingPreview() {
  return (
    <section className="py-24">
      <div className="container-site">
        <h2 data-reveal className="text-3xl md:text-5xl">
          Pricing that is easy to understand
        </h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.id}
              data-reveal
              className={`rounded-3xl border p-8 ${
                tier.recommended ? "border-accent bg-accent-soft/40 shadow-[0_0_60px_var(--color-accent-glow)]" : "border-line bg-bg-elevated"
              }`}
            >
              {tier.recommended && (
                <p className="text-xs uppercase tracking-[0.18em] text-accent">Recommended</p>
              )}
              <h3 className="mt-2 text-2xl">{tier.name}</h3>
              <p className="mt-3 font-display text-4xl">{tier.price}</p>
              <p className="mt-3 text-sm text-muted">{tier.blurb}</p>
              <ul className="mt-8 space-y-2 text-sm text-muted">
                {tier.features.map((feature) => (
                  <li key={feature} className="border-t border-line pt-2">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {pricingNotes.map((note) => (
          <p key={note} className="mt-4 text-sm text-muted">
            {note}
          </p>
        ))}
        <div className="mt-10">
          <MagneticButton to="/pricing" variant="ghost">
            View Full Pricing
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
