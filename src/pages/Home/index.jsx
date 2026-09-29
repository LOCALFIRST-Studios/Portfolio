import { useEffect, useRef } from "react";
import Seo from "../../components/Seo";
import Hero from "../../sections/Hero";
import FeaturedWork from "../../sections/FeaturedWork";
import Services from "../../sections/Services";
import Stats from "../../sections/Stats";
import Marquee from "../../sections/Marquee";
import PricingPreview from "../../sections/PricingPreview";
import Process from "../../sections/Process";
import WhyUs from "../../sections/WhyUs";
import CTA from "../../sections/CTA";
import { revealSections } from "../../animations/scrollAnimations";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function Home() {
  const root = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!root.current) return undefined;
    const tweens = revealSections(root.current, reduced);
    return () => tweens.forEach((t) => t.kill());
  }, [reduced]);

  return (
    <div ref={root}>
      <Seo
        title="Local First Studios"
        description="Premium websites for gyms, salons, cafés, PGs and ambitious local businesses."
        path="/"
      />
      <Hero />
      <FeaturedWork />
      <Services />
      <Stats />
      <Marquee />
      <PricingPreview />
      <Process />
      <WhyUs />
      <CTA />
    </div>
  );
}
