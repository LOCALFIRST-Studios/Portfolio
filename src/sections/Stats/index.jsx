import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "../../data/services";
import useReducedMotion from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const nodes = root.current?.querySelectorAll("[data-count]");
    if (!nodes) return undefined;

    const tweens = [...nodes].map((el) => {
      const raw = el.dataset.count;
      if (raw === "∞") return undefined;
      if (reduced) {
        el.textContent = raw.includes("%") ? "100%" : raw;
        return undefined;
      }
      if (raw.includes("%")) {
        const obj = { val: 0 };
        return gsap.to(obj, {
          val: 100,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}%`;
          },
        });
      }
      if (raw.includes("–")) {
        const obj = { val: 7 };
        return gsap.to(obj, {
          val: 14,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}–14`;
          },
        });
      }
      return undefined;
    });

    return () => tweens.forEach((t) => t?.kill());
  }, [reduced]);

  return (
    <section ref={root} className="py-20">
      <div className="container-site grid gap-10 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} data-reveal>
            <p className="font-display text-5xl text-accent md:text-6xl" data-count={item.value}>
              {item.value}
            </p>
            <p className="mt-2 text-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
