import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function PageTransition() {
  const overlay = useRef(null);
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !overlay.current) return;

    const el = overlay.current;
    const tl = gsap.timeline();
    tl.set(el, { clipPath: "inset(0 0 100% 0)", autoAlpha: 1 })
      .to(el, { clipPath: "inset(0 0 0% 0)", duration: 0.28, ease: "power2.inOut" })
      .to(el, { clipPath: "inset(100% 0 0% 0)", duration: 0.32, ease: "power2.inOut", delay: 0.04 })
      .set(el, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });

    return () => tl.kill();
  }, [pathname, reduced]);

  return (
    <div
      ref={overlay}
      className="pointer-events-none fixed inset-0 z-[70] bg-accent"
      style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      aria-hidden
    />
  );
}
