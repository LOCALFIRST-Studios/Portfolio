import { Link } from "react-router-dom";
import { useRef } from "react";
import useReducedMotion from "../../hooks/useReducedMotion";

export default function MagneticButton({
  to,
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const styles =
    variant === "primary"
      ? "bg-accent text-bg hover:shadow-[0_0_32px_var(--color-accent-glow)]"
      : "border border-line-strong text-ink hover:border-accent hover:text-accent";

  function onMove(event) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  const shared = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    className: `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-[transform,box-shadow,color,background,border-color] duration-200 will-change-transform ${styles} ${className}`,
    ...props,
  };

  if (to) {
    return (
      <Link to={to} {...shared}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} {...shared}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} {...shared}>
      {children}
    </button>
  );
}
