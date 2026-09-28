import { whyUs } from "../../data/services";

export default function WhyUs() {
  return (
    <section className="py-24">
      <div className="container-site">
        <h2 data-reveal className="text-3xl md:text-5xl">
          Why work with us
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {whyUs.map((item) => (
            <article key={item.title} data-reveal className="rounded-2xl border border-line p-6">
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
