import { marqueeItems } from "../../data/services";
import useReducedMotion from "../../hooks/useReducedMotion";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useTheme } from "../../contexts/ThemeContext";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Marquee() {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const glowRef = useRef(null);
  const separatorRefs = useRef([]);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isDayMode } = useTheme();

  // Theme-aware colors
  const colors = {
    default: isDayMode ? '#6b635c' : '#8b95a5',
    accent: isDayMode ? '#d97706' : '#22d3ee',
    glow: isDayMode ? 'rgba(217, 119, 6, 0.08)' : 'rgba(34, 211, 238, 0.12)',
    glowStrong: isDayMode ? 'rgba(217, 119, 6, 0.15)' : 'rgba(34, 211, 238, 0.25)'
  };

  useEffect(() => {
    if (reduced || isMobile || !containerRef.current) return;

    const container = containerRef.current;
    const items = itemRefs.current.filter(Boolean);
    const separators = separatorRefs.current.filter(Boolean);
    
    // Proximity wave effect on mouse move
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      
      items.forEach((item, index) => {
        if (!item) return;
        
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
        const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;
        
        const distance = Math.sqrt(
          Math.pow(pointerX - itemCenterX, 2) + 
          Math.pow(pointerY - itemCenterY, 2)
        );
        
        // Proximity effect calculation
        const maxDistance = 120;
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const effect = Math.max(0, 1 - normalizedDistance);
        
        // Magnetic attraction
        const magneticForce = effect * 0.3;
        const deltaX = (pointerX - itemCenterX) * magneticForce;
        const deltaY = (pointerY - itemCenterY) * magneticForce;
        
        // Wave animation values
        const moveY = -effect * 4;
        const scale = 1 + effect * 0.04;
        const blur = effect > 0.3 ? 0 : (1 - effect) * 2;
        
        gsap.to(item, {
          x: deltaX,
          y: moveY,
          scale: scale,
          filter: `blur(${blur}px)`,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true
        });
      });

      // Animate separators with proximity effect
      separators.forEach((separator, index) => {
        if (!separator) return;
        
        const sepRect = separator.getBoundingClientRect();
        const sepCenterX = sepRect.left + sepRect.width / 2 - rect.left;
        const sepCenterY = sepRect.top + sepRect.height / 2 - rect.top;
        
        const distance = Math.sqrt(
          Math.pow(pointerX - sepCenterX, 2) + 
          Math.pow(pointerY - sepCenterY, 2)
        );
        
        const effect = Math.max(0, 1 - distance / 80);
        const scale = 1 + effect * 0.5;
        
        gsap.to(separator, {
          scale: scale,
          color: effect > 0.3 ? colors.accent : colors.default,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true
        });
      });
    };

    const handlePointerLeave = () => {
      // Reset all items
      items.forEach(item => {
        if (item) {
          gsap.to(item, {
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: true
          });
        }
      });

      // Reset separators
      separators.forEach(separator => {
        if (separator) {
          gsap.to(separator, {
            scale: 1,
            color: colors.default,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true
          });
        }
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reduced, isMobile, colors]);

  // Individual item hover handlers
  const handleItemHover = (index) => {
    if (reduced || isMobile) return;
    
    setHoveredIndex(index);
    const item = itemRefs.current[index];
    if (!item) return;

    // Enhanced hover animation
    gsap.to(item, {
      scale: 1.05,
      color: colors.accent,
      textShadow: `0 0 20px ${colors.glowStrong}`,
      letterSpacing: "0.32em",
      duration: 0.3,
      ease: "power2.out",
      overwrite: false
    });

    // Glow backdrop animation
    if (glowRef.current) {
      const itemRect = item.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      gsap.set(glowRef.current, {
        left: itemRect.left - containerRect.left - 20,
        top: itemRect.top - containerRect.top - 10,
        width: itemRect.width + 40,
        height: itemRect.height + 20,
        background: `radial-gradient(ellipse, ${colors.glow} 0%, transparent 70%)`,
        display: 'block'
      });
      
      gsap.fromTo(glowRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  };

  const handleItemLeave = (index) => {
    if (reduced || isMobile) return;
    
    setHoveredIndex(-1);
    const item = itemRefs.current[index];
    if (!item) return;

    // Reset item animation
    gsap.to(item, {
      scale: 1,
      color: colors.default,
      textShadow: "none",
      letterSpacing: "0.28em",
      duration: 0.4,
      ease: "power2.out",
      overwrite: false
    });

    // Hide glow backdrop
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(glowRef.current, { display: 'none' });
        }
      });
    }
  };

  // Static version for reduced motion or mobile
  if (reduced || isMobile) {
    return (
      <section className="border-y border-line py-4 text-center text-sm uppercase tracking-[0.2em] text-muted">
        {marqueeItems.join(" · ")}
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      className="relative border-y border-line py-6 overflow-hidden"
    >
      {/* Glow backdrop element */}
      <div 
        ref={glowRef}
        className="absolute pointer-events-none rounded-full"
        style={{ 
          display: 'none',
          zIndex: 1,
          filter: 'blur(8px)'
        }}
      />
      
      <div className="relative z-10 flex justify-center items-center flex-wrap gap-x-8 gap-y-3 px-4">
        {marqueeItems.map((item, index) => (
          <span key={index} className="flex items-center">
            <span
              ref={el => itemRefs.current[index] = el}
              className="relative text-sm uppercase tracking-[0.28em] cursor-pointer select-none transition-colors duration-300"
              style={{ 
                color: colors.default,
                textShadow: 'none',
                willChange: 'transform, color, text-shadow, letter-spacing'
              }}
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={() => handleItemLeave(index)}
            >
              {item}
            </span>
            {index < marqueeItems.length - 1 && (
              <span 
                ref={el => separatorRefs.current[index] = el}
                className="ml-8 text-sm select-none transition-colors duration-200"
                style={{ 
                  color: colors.default,
                  willChange: 'transform, color'
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
