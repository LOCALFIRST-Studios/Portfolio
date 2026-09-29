import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import useReducedMotion from "./useReducedMotion";

/**
 * Hook to manage smooth theme transitions
 * Adds transition classes and manages transition states
 */
export function useThemeTransition() {
  const { currentTheme } = useTheme();
  const reduced = useReducedMotion();
  const elementRef = useRef(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!elementRef.current || reduced) return;

    const element = elementRef.current;
    isTransitioning.current = true;

    // Add transition class
    element.classList.add('theme-transition');

    // Remove transition state after animation completes
    const timeout = setTimeout(() => {
      isTransitioning.current = false;
    }, 300);

    return () => {
      clearTimeout(timeout);
      isTransitioning.current = false;
    };
  }, [currentTheme, reduced]);

  return {
    ref: elementRef,
    isTransitioning: isTransitioning.current,
    transitionClass: reduced ? '' : 'theme-transition',
  };
}

/**
 * Hook for theme-aware style objects with transitions
 */
export function useThemeStyles(nightStyles = {}, dayStyles = {}) {
  const { isDayMode } = useTheme();
  const reduced = useReducedMotion();
  
  const baseStyles = {
    transition: reduced ? 'none' : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return {
    ...baseStyles,
    ...(isDayMode ? dayStyles : nightStyles),
  };
}