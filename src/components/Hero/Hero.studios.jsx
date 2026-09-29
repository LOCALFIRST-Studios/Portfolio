import { useEffect, useRef } from "react";
import { lazy, Suspense } from "react";
import MagneticButton from "../MagneticButton";
import ParticleField from "../ParticleField";
import { revealHeadline } from "../../animations/heroAnimations";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useThemeSite } from "../../hooks/useThemeSite";

const HeroScene = lazy(() => import("../3d/HeroScene"));

export default function HeroStudios() {
  const headline = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const site = useThemeSite();

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
    <section className="relative overflow-hidden py-36 md:py-48">
      {/* Editorial background pattern - subtler than current */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, var(--color-line) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {!reduced && !isMobile && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}
      
      <div className="container-site relative">
        {/* Accent kicker with Dancing Script */}
        <p className="font-accent text-lg text-accent md:text-xl">
          Independent creative studio
        </p>
        
        {/* Main headline - Playfair Display for editorial feel */}
        <h1
          ref={headline}
          className="font-display mt-8 max-w-4xl overflow-hidden text-5xl font-medium leading-[0.95] md:text-8xl"
        >
          WE CRAFT DIGITAL EXPERIENCES THAT CAPTIVATE.
        </h1>
        
        {/* Refined tagline */}
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl">
          {site.tagline}
        </p>
        
        {/* CTA buttons with more editorial styling */}
        <div className="mt-12 flex flex-wrap gap-6">
          <MagneticButton to="/work" className="px-8 py-4 text-lg">
            View Our Work
          </MagneticButton>
          <MagneticButton to="/contact" variant="ghost" className="px-8 py-4 text-lg">
            Start a Project
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}