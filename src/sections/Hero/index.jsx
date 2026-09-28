import { useEffect, useRef } from "react";
import { lazy, Suspense } from "react";
import MagneticButton from "../../components/MagneticButton";
import ParticleField from "../../components/ParticleField";
import { revealHeadline } from "../../animations/heroAnimations";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";

const HeroScene = lazy(() => import("../../components/3d/HeroScene"));

export default function Hero() {
  const headline = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    const node = headline.current;
    if (!node) return undefined;
    const original = node.dataset.original || node.textContent;
    node.dataset.original = original;
    node.textContent = original;
    const tween = revealHeadline(node, reduced);
    return () => {
      tween?.kill();
      node.textContent = original;
    };
  }, [reduced]);

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 hairline-grid opacity-30" />
      <ParticleField />
      {!reduced && !isMobile && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}
      <div className="container-site relative">
        <p className="text-sm uppercase tracking-[0.22em] text-accent">Independent web studio</p>
        <h1
          ref={headline}
          className="mt-6 max-w-5xl overflow-hidden text-4xl leading-[0.95] md:text-7xl"
        >
          WE BUILD DIGITAL EXPERIENCES THAT GET NOTICED.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Premium websites for gyms, salons, cafés, PGs and ambitious local businesses.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton to="/work">View Our Work</MagneticButton>
          <MagneticButton to="/contact" variant="ghost">
            Start a Project
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
