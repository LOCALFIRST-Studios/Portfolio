import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import ProjectCard from "../../components/ProjectCard";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedWork() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reduced || isMobile) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - section.offsetWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          end: () => `+=${distance() + 200}`,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <section ref={sectionRef} className="overflow-hidden py-24">
      <div className="container-wide">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Featured work</p>
        <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl">Concept projects, not invented clients.</h2>
      </div>
      <div
        ref={trackRef}
        className="mt-12 flex w-max gap-8 px-[var(--spacing-gutter)] md:flex-row md:flex-nowrap max-md:w-full max-md:flex-col"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} featured />
        ))}
      </div>
    </section>
  );
}
