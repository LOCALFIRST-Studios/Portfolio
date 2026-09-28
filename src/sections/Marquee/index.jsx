import { marqueeItems } from "../../data/services";
import useReducedMotion from "../../hooks/useReducedMotion";

function Row({ reverse = false }) {
  const text = [...marqueeItems, ...marqueeItems, ...marqueeItems].join(" · ");
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${reverse ? "marquee-reverse" : "marquee"}`}>
      <p className="min-w-full px-4 text-sm uppercase tracking-[0.28em] text-muted">{text}</p>
      <p className="min-w-full px-4 text-sm uppercase tracking-[0.28em] text-muted" aria-hidden>
        {text}
      </p>
    </div>
  );
}

export default function Marquee() {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <section className="border-y border-line py-4 text-center text-sm uppercase tracking-[0.2em] text-muted">
        {marqueeItems.join(" · ")}
      </section>
    );
  }

  return (
    <section className="space-y-3 overflow-hidden border-y border-line py-5">
      <Row />
      <Row reverse />
    </section>
  );
}
