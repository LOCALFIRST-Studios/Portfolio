import { useEffect, useRef } from "react";
import useReducedMotion from "../hooks/useReducedMotion";
import useMediaQuery from "../hooks/useMediaQuery";

export default function ParticleField() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reduced || isMobile) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    let frame;
    let width = 0;
    let height = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const count = 42;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.4,
      s: Math.random() * 0.15 + 0.05,
    }));

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = event.clientY / window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += (mouse.x - 0.5) * 0.0008 * p.s;
        p.y += (mouse.y - 0.5) * 0.0008 * p.s + 0.00015;
        if (p.y > 1) p.y = 0;
        if (p.x > 1) p.x = 0;
        if (p.x < 0) p.x = 1;
        ctx.beginPath();
        ctx.fillStyle = "rgba(34, 211, 238, 0.35)";
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, isMobile]);

  if (reduced || isMobile) return null;
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
