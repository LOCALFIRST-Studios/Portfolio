import { useEffect, useRef, useState } from "react";
import { SITE } from "../../data/site";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();
  const done = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("lf-preloader") === "1") {
      onDone();
      return undefined;
    }

    if (reduced) {
      sessionStorage.setItem("lf-preloader", "1");
      onDone();
      return undefined;
    }

    const start = performance.now();
    const duration = 900;
    let frame;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(t * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!done.current) {
        done.current = true;
        sessionStorage.setItem("lf-preloader", "1");
        setTimeout(onDone, 180);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone, reduced]);

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-bg px-8 py-10"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <p className="font-display text-sm tracking-[0.28em] uppercase">{SITE.name}</p>
      <div>
        <p className="text-xs tracking-[0.3em] text-muted">LOADING</p>
        <p className="mt-4 font-display text-7xl tabular-nums text-accent">{progress}%</p>
      </div>
    </div>
  );
}
