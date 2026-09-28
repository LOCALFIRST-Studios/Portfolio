import DemoShell from "./DemoShell";

export default function SalonDemo() {
  return (
    <DemoShell title="Atelier Salon" kicker="Salon website" theme="bg-[#161218] text-[#f6efe8]">
      <section className="px-6 py-20 md:px-16">
        <h1 className="max-w-3xl font-display text-5xl md:text-7xl">Cut. Colour. Care.</h1>
        <p className="mt-6 max-w-lg text-white/60">
          A quiet, considered salon site. Concept demo — not a real salon.
        </p>
      </section>
      <section className="grid gap-4 px-6 pb-20 md:grid-cols-3 md:px-16">
        {[
          ["Cut", "From ₹700"],
          ["Colour", "Quoted in salon"],
          ["Care", "Treatments on request"],
        ].map(([title, price]) => (
          <article key={title} className="border-t border-white/15 pt-6">
            <h2 className="text-2xl">{title}</h2>
            <p className="mt-2 text-sm text-white/50">{price}</p>
          </article>
        ))}
      </section>
    </DemoShell>
  );
}
