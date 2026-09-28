import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "./motionConfig";

gsap.registerPlugin(ScrollTrigger);

export function revealSections(root, reduced) {
  if (reduced) return [];
  const items = root.querySelectorAll("[data-reveal]");
  return [...items].map((el) =>
    gsap.fromTo(
      el,
      { y: 28, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: MOTION.reveal.duration,
        ease: MOTION.reveal.ease,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      },
    ),
  );
}
