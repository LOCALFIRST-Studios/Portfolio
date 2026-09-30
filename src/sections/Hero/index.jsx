import { useEffect, useRef } from "react";
import gsap from "gsap";
import MagneticButton from "../../components/MagneticButton";
import useReducedMotion from "../../hooks/useReducedMotion";
import { useTheme } from "../../contexts/ThemeContext";

export default function Hero() {
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const reduced = useReducedMotion();
  const { isDayMode } = useTheme();

  useEffect(() => {
    const els = [labelRef.current, headingRef.current, descriptionRef.current, ctaRef.current];

    if (reduced) {
      // Reduced motion: skip animation, make everything immediately visible
      els.forEach(el => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      return;
    }

    // Set initial state explicitly so GSAP owns it from the start
    els.forEach(el => {
      if (el) gsap.set(el, { opacity: 0, y: 30 });
    });
    if (headingRef.current) gsap.set(headingRef.current, { y: 50 });

    // Hero content entrance animation with staggered timing
    const tl = gsap.timeline({ delay: 0.6 });

    tl.to(labelRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    })
    .to(headingRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.5")
    .to(descriptionRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8")
    .to(ctaRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");

    return () => {
      tl.kill();
      // Clear inline styles so a re-mount starts clean
      els.forEach(el => {
        if (el) gsap.set(el, { clearProps: "opacity,y,transform" });
      });
    };
  }, [reduced]);

  const overlayOpacity = isDayMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.35)';

  return (
    <section 
      className="relative h-screen overflow-hidden"
      style={{ minHeight: '500px', maxHeight: '900px' }}
    >
      {/* Fallback background — sits behind the video */}
      <div 
        className="absolute inset-0"
        style={{ 
          zIndex: 0,
          background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #000000 100%)'
        }}
      />

      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover hero-video-bg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/landingpage.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for readability */}
      <div 
        className="absolute inset-0 hero-overlay"
        style={{ 
          backgroundColor: overlayOpacity,
          backdropFilter: 'blur(0.5px)',
          transition: 'background-color 300ms ease'
        }}
      />
      
      {/* Hero Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center px-4 md:px-6 hero-content"
      >
        <div className="w-full max-w-6xl text-center">
          {/* Label */}
          <p 
            ref={labelRef}
            className="text-xs md:text-sm uppercase tracking-widest mb-8 md:mb-12 text-cream opacity-90"
          >
            Independent creative studio
          </p>
          
          {/* Main Headline */}
          <h1
            ref={headingRef}
            className="font-light tracking-tight mb-8 md:mb-12 text-cream font-serif"
            style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              textShadow: '0 4px 16px rgba(0,0,0,0.7)',
              lineHeight: '0.9',
              fontWeight: '300'
            }}
          >
            WE BUILD DIGITAL<br />
            EXPERIENCES THAT<br />
            GET NOTICED.
          </h1>
          
          {/* Description */}
          <p 
            ref={descriptionRef}
            className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed mb-12 md:mb-16 text-cream opacity-90"
          >
            Premium websites for gyms, salons, cafés, PGs and ambitious local businesses.
          </p>
          
          {/* Call to Action */}
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton 
              to="/work" 
              className="px-8 py-4 text-base font-medium rounded-full"
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-bg)',
                border: 'none',
                minWidth: '160px'
              }}
            >
              View Our Work
            </MagneticButton>
            <MagneticButton 
              to="/contact" 
              variant="ghost" 
              className="px-8 py-4 text-base rounded-full border-2"
              style={{
                color: 'var(--color-cream)',
                borderColor: 'var(--color-cream)',
                backgroundColor: 'transparent',
                minWidth: '160px'
              }}
            >
              Start a Project
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
