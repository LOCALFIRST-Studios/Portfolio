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
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const { isDayMode } = useTheme();

  useEffect(() => {
    if (reduced) return;
    
    // Hero content entrance animation with staggered timing
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from(labelRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    })
    .from(headingRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .from(descriptionRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.5")
    .from(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    return () => tl.kill();
  }, [reduced]);

  return (
    <section className="relative h-screen min-h-[500px] max-h-[800px] md:min-h-[600px] lg:max-h-none overflow-hidden theme-transition">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={(e) => {
          console.warn('Video failed to load:', e);
        }}
      >
        <source src="/landingpage.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback background if video fails */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-0"
        style={{ 
          zIndex: -1,
          backgroundImage: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #000000 100%)'
        }}
      />

      {/* Theme-aware overlay for text readability */}
      <div 
        className={`absolute inset-0 theme-transition ${
          isDayMode 
            ? 'bg-white/5 backdrop-blur-[0.5px]' 
            : 'bg-black/25 backdrop-blur-[0.5px]'
        }`}
      />
      
      {/* Hero Content */}
      <div className="container-site relative z-10 flex h-full items-center px-4 md:px-6">
        <div className="max-w-5xl">
          <p 
            ref={labelRef}
            className={`text-xs md:text-sm uppercase tracking-[0.22em] theme-transition ${
              isDayMode ? 'text-white/95' : 'text-white/90'
            }`}
          >
            Independent web studio
          </p>
          
          <h1
            ref={headingRef}
            className="mt-4 md:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[0.95] text-white drop-shadow-lg"
          >
            WE BUILD DIGITAL EXPERIENCES THAT GET NOTICED.
          </h1>
          
          <p 
            ref={descriptionRef}
            className={`mt-4 md:mt-6 max-w-xl text-base md:text-lg lg:text-xl theme-transition ${
              isDayMode ? 'text-white/95' : 'text-white/85'
            }`}
          >
            Premium websites for gyms, salons, cafés, PGs and ambitious local businesses.
          </p>
          
          <div 
            ref={ctaRef}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton to="/work">View Our Work</MagneticButton>
            <MagneticButton to="/contact" variant="ghost">
              Start a Project
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
