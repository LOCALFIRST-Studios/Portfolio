import gsap from "gsap";
import { MOTION } from "./motionConfig";

export function splitHeadline(node) {
  const text = node.textContent;
  node.textContent = "";
  const chars = [...text].map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity, filter";
    node.appendChild(span);
    return span;
  });
  return chars;
}

export function revealHeadline(node, reduced) {
  if (reduced) return undefined;
  const chars = splitHeadline(node);
  return gsap.from(chars, {
    yPercent: 110,
    opacity: 0,
    filter: "blur(8px)",
    duration: MOTION.hero.duration,
    ease: MOTION.hero.ease,
    stagger: 0.018,
  });
}
