import DemoShell from "./DemoShell";

export default function CafeDemo() {
  return (
    <DemoShell title="Hearth Café" kicker="Café website" theme="bg-[#f4efe6] text-[#2a2118]">
      <section className="px-6 py-20 md:px-16">
        <h1 className="max-w-3xl font-display text-5xl md:text-7xl">Slow mornings. Honest food.</h1>
        <p className="mt-6 max-w-lg opacity-70">
          Coffee, plates and a room you want to stay in. Concept demo — not a real café.
        </p>
      </section>
      <section className="grid gap-6 px-6 pb-20 md:grid-cols-2 md:px-16">
        {[
          ["Breakfast", "Eggs, toast, fruit, filter coffee"],
          ["All day", "Sandwiches, soups, cakes"],
        ].map(([title, body]) => (
          <article key={title} className="rounded-3xl bg-white/70 p-8">
            <h2 className="text-2xl">{title}</h2>
            <p className="mt-2 opacity-70">{body}</p>
          </article>
        ))}
      </section>
    </DemoShell>
  );
}
