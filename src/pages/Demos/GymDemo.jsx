import DemoShell from "./DemoShell";

export default function GymDemo() {
  return (
    <DemoShell title="Northline Gym" kicker="Gym website" theme="bg-[#0b0d10] text-zinc-100">
      <section className="px-6 py-20 md:px-16">
        <h1 className="max-w-3xl font-display text-5xl md:text-7xl">Train with intent.</h1>
        <p className="mt-6 max-w-lg text-zinc-400">
          Strength, conditioning and coaching in one place. Concept demo — not a real gym.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="#contact" className="rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-black">
            Join WhatsApp
          </a>
          <a href="#programs" className="rounded-full border border-white/20 px-5 py-3 text-sm">
            View programs
          </a>
        </div>
      </section>
      <section id="programs" className="grid gap-4 px-6 pb-20 md:grid-cols-3 md:px-16">
        {["Strength", "HIIT", "Coaching"].map((item) => (
          <article key={item} className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl">{item}</h2>
            <p className="mt-2 text-sm text-zinc-400">Sample program block for a local gym website.</p>
          </article>
        ))}
      </section>
      <section id="contact" className="px-6 pb-20 md:px-16">
        <h2 className="text-3xl">Visit or message</h2>
        <p className="mt-3 text-zinc-400">Maps and WhatsApp would sit here on a live client site.</p>
      </section>
    </DemoShell>
  );
}
