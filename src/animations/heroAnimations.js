import gsap from "gsap";
import { MOTION } from "./motionConfig";

export function splitHeadline(node) {
  const text = node.textContent.trim();
  node.textContent = "";
  const chars = [];

  text.split(" ").forEach((word, index, words) => {
    const wordWrap = document.createElement("span");
    wordWrap.style.display = "inline-block";
    wordWrap.style.overflow = "hidden";
    wordWrap.style.whiteSpace = "nowrap";
    wordWrap.style.verticalAlign = "bottom";

    [...word].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity, filter";
      wordWrap.appendChild(span);
      chars.push(span);
    });

    node.appendChild(wordWrap);
    if (index < words.length - 1) {
      node.appendChild(document.createTextNode(" "));
    }
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
