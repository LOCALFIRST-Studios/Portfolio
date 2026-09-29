import { services } from "../../data/services";

export default function Services() {
  return (
    <section className="py-24">
      <div className="container-site">
        <h2 data-reveal className="text-3xl md:text-5xl">
          What we do
        </h2>
        <div className="mt-12 space-y-4">
          {services.map((service, index) => (
            <article
              key={service.number}
              className="sticky rounded-3xl border border-line bg-bg-elevated/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm theme-transition md:p-12"
              style={{ top: `${5.5 + index * 1.25}rem` }}
            >
              <p className="text-sm text-accent">{service.number}</p>
              <h3 className="mt-3 text-3xl uppercase md:text-5xl">{service.title}</h3>
              <p className="mt-4 max-w-xl text-muted">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
