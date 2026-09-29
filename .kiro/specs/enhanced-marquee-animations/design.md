# Enhanced Marquee Animations - Design Specification

## Overview

This design specification outlines the architecture and implementation approach for creating a sophisticated marquee component with premium hover animations and theme-aware color effects for LocalFirst Studios. The component integrates with the existing React/GSAP/Theme infrastructure to deliver a polished, accessible, and performant user experience.

## Architecture

### Component Structure

```jsx
// Main component hierarchy
EnhancedMarquee/
├── index.jsx                 // Main marquee component
├── MarqueeItem.jsx          // Individual category item
├── hooks/
│   ├── useMarqueeAnimation.js   // Core scrolling logic
│   ├── useHoverEffects.js       // Hover interaction management  
│   └── useProximityWave.js      // Wave effect calculations
├── animations/
│   ├── marqueeTimeline.js       // GSAP scrolling timeline
│   ├── hoverEffects.js          // Item hover animations
│   └── characterAnimation.js    // Text character effects
└── styles/
    └── marquee.css              // Component-specific styles
```

### Data Flow Architecture

```
Theme Context → EnhancedMarquee → Animation Controllers → GSAP Timelines
     ↓                ↓                    ↓                    ↓
Theme State → Color Schemes → Animation Configs → GPU Animations
     ↓                ↓                    ↓                    ↓
CSS Variables → Dynamic Styles → Transform Props → Rendered Effects
```

## Visual Design Specification

### Animation Hierarchy

1. **Base Layer**: Continuous horizontal marquee scroll
2. **Interaction Layer**: Hover-triggered item animations  
3. **Detail Layer**: Character-level text effects
4. **Ambient Layer**: Proximity-based wave effects

### Color Specifications

#### Day Mode Theme
- **Primary Hover**: `#F59E0B` (Amber 500)
- **Secondary Hover**: `#D97706` (Amber 600) 
- **Glow Effect**: `rgba(245, 158, 11, 0.2)` (20% opacity)
- **Text Color**: `#1F2937` (Gray 800)
- **Background Overlay**: `rgba(255, 255, 255, 0.1)`

#### Night Mode Theme  
- **Primary Hover**: `#06B6D4` (Cyan 500)
- **Secondary Hover**: `#0891B2` (Cyan 600)
- **Glow Effect**: `rgba(6, 182, 212, 0.25)` (25% opacity)
- **Text Color**: `#F9FAFB` (Gray 50)
- **Background Overlay**: `rgba(0, 0, 0, 0.15)`

### Animation Specifications

#### Base Marquee Scroll
- **Duration**: 20s for complete cycle
- **Easing**: `linear` (continuous motion)
- **Direction**: Right to left
- **Loop**: Infinite seamless loop
- **Performance**: CSS transform: `translateX()` only

#### Hover Effects Timeline
```javascript
// Hover Enter (150ms total)
0ms:    Scale: 1.0 → 1.05 (power2.out, 100ms)
50ms:   Glow: 0 → 1 (power2.out, 100ms)  
75ms:   Character stagger begin (power3.out, 200ms)

// Hover Exit (300ms total)  
0ms:    Character effects exit (power2.out, 150ms)
100ms:  Glow: 1 → 0 (power2.out, 150ms)
150ms:  Scale: 1.05 → 1.0 (power2.out, 150ms)
```

#### Character Animation
- **Stagger Delay**: 15ms between characters
- **Y Transform**: 0px → -3px → 0px
- **Duration**: 400ms per character
- **Easing**: `power3.out`
- **Overlap**: 75% (characters overlap timing)

#### Proximity Wave Effect
- **Trigger Distance**: 120px from hovered item
- **Wave Amplitude**: 2px vertical displacement
- **Wave Duration**: 600ms
- **Easing**: `elastic.out(1, 0.5)`
- **Affected Items**: ±2 items from hover target

## Technical Implementation

### Core Component Architecture

```jsx
// EnhancedMarquee/index.jsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import useReducedMotion from '../../hooks/useReducedMotion';
import useMarqueeAnimation from './hooks/useMarqueeAnimation';
import useHoverEffects from './hooks/useHoverEffects';
import MarqueeItem from './MarqueeItem';

const MARQUEE_ITEMS = ['Gyms', 'Salons', 'Cafés', 'PGs', 'Local businesses'];

export default function EnhancedMarquee() {
  const containerRef = useRef(null);
  const { isDayMode, isNightMode } = useTheme();
  const reduced = useReducedMotion();
  
  // Animation hooks
  const { startMarquee, pauseMarquee } = useMarqueeAnimation(containerRef, reduced);
  const { handleHover, handleUnhover } = useHoverEffects(reduced, isDayMode);
  
  useEffect(() => {
    startMarquee();
    return () => pauseMarquee();
  }, [startMarquee, pauseMarquee]);

  return (
    <div 
      ref={containerRef}
      className={`marquee-container ${isDayMode ? 'theme-day' : 'theme-night'}`}
      role="region"
      aria-label="Business categories marquee"
    >
      <div className="marquee-track">
        {/* Duplicate items for seamless loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
          <MarqueeItem
            key={`${item}-${index}`}
            text={item}
            index={index}
            onHover={handleHover}
            onUnhover={handleUnhover}
            isDayMode={isDayMode}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}
```

### Animation Controllers

```javascript
// hooks/useMarqueeAnimation.js
import { useCallback, useRef } from 'react';
import gsap from 'gsap';

export default function useMarqueeAnimation(containerRef, reduced) {
  const timelineRef = useRef(null);

  const startMarquee = useCallback(() => {
    if (!containerRef.current || reduced) return;
    
    const track = containerRef.current.querySelector('.marquee-track');
    const itemWidth = track.scrollWidth / 2; // Half width for seamless loop
    
    timelineRef.current = gsap.timeline({ repeat: -1 });
    timelineRef.current.to(track, {
      x: -itemWidth,
      duration: 20,
      ease: 'linear'
    });
  }, [reduced]);

  const pauseMarquee = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  return { startMarquee, pauseMarquee };
}
```

```javascript
// hooks/useHoverEffects.js
import { useCallback } from 'react';
import gsap from 'gsap';
import { MOTION } from '../../animations/motionConfig';

export default function useHoverEffects(reduced, isDayMode) {
  const activeAnimations = new Map();

  const handleHover = useCallback((element, index) => {
    if (reduced) {
      // Reduced motion: only color changes
      gsap.to(element, {
        color: isDayMode ? '#F59E0B' : '#06B6D4',
        duration: MOTION.micro.duration
      });
      return;
    }

    // Create hover timeline
    const tl = gsap.timeline();
    
    // Scale and glow
    tl.to(element, {
      scale: 1.1,
      duration: 0.15,
      ease: MOTION.micro.ease
    })
    .to(element, {
      boxShadow: `0 0 20px ${isDayMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.25)'}`,
      duration: 0.1,
      ease: MOTION.micro.ease
    }, '-=0.05');

    // Character animation
    const chars = element.querySelectorAll('.char');
    tl.to(chars, {
      y: -3,
      duration: 0.2,
      stagger: 0.015,
      ease: MOTION.reveal.ease
    }, '-=0.075');

    activeAnimations.set(element, tl);

    // Proximity wave effect
    triggerProximityWave(index);
  }, [reduced, isDayMode]);

  const handleUnhover = useCallback((element) => {
    const tl = activeAnimations.get(element);
    if (tl) {
      tl.reverse();
      activeAnimations.delete(element);
    }
  }, []);

  return { handleHover, handleUnhover };
}
```

### Performance Optimizations

#### GPU Acceleration Strategy
```css
/* Promote elements to GPU layer */
.marquee-item {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
  backface-visibility: hidden;
}

/* Use efficient properties only */
.marquee-item:hover {
  /* ✓ GPU accelerated */
  transform: scale(1.1) translateZ(0);
  opacity: 1;
  
  /* ✗ Avoid layout-triggering properties */
  /* width, height, padding, margin */
}
```

#### Memory Management
```javascript
// Cleanup pattern for all animation hooks
useEffect(() => {
  return () => {
    // Kill all GSAP animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Clear animation maps
    activeAnimations.clear();
    
    // Remove event listeners
    element.removeEventListener('mouseenter', handleHover);
    element.removeEventListener('mouseleave', handleUnhover);
  };
}, []);
```

## Accessibility Implementation

### Reduced Motion Compliance
```javascript
// Progressive animation enhancement
const animationConfig = reduced ? {
  // Reduced motion: only essential changes
  hover: { color: themeColor, duration: 0.2 },
  focus: { outline: '2px solid', duration: 0.1 }
} : {
  // Full animations for users who prefer motion
  hover: { scale: 1.1, glow: true, characters: true },
  focus: { scale: 1.05, outline: '2px solid' }
};
```

### Keyboard Navigation
```jsx
// Keyboard accessibility for marquee items
<MarqueeItem
  tabIndex={0}
  role="button"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleItemActivation(item);
    }
  }}
  onFocus={handleFocus}
  onBlur={handleBlur}
  aria-label={`View ${item} services`}
>
```

### Screen Reader Support
```jsx
// ARIA labels and live regions
<div 
  role="region"
  aria-label="Business categories"
  aria-live="polite"
  aria-atomic="false"
>
  <div className="sr-only">
    Scrolling showcase of business categories we serve
  </div>
  {/* Marquee content */}
</div>
```

## Error Handling & Fallbacks

### Animation Failure Recovery
```javascript
// Graceful degradation for animation failures
try {
  gsap.to(element, animationConfig);
} catch (error) {
  console.warn('Animation failed, applying fallback:', error);
  // Apply CSS-only fallback
  element.style.transform = 'scale(1.1)';
  element.style.transition = 'transform 0.2s ease-out';
}
```

### Browser Compatibility Layer
```javascript
// Feature detection and fallbacks
const hasGSAP = typeof gsap !== 'undefined';
const hasTransform = CSS.supports('transform', 'scale(1.1)');

const animationStrategy = hasGSAP && hasTransform 
  ? 'enhanced'    // Full GSAP animations
  : 'fallback';   // CSS-only animations
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Seamless Marquee Looping
*For any* marquee content length and scroll position, when content reaches the end boundary, the system should continue scrolling without visual interruption or gaps.
**Validates: Requirements 1.5**

### Property 2: Consistent Hover Scale Animation  
*For any* marquee item, hovering should trigger a scale transformation to 1.1 with smooth easing within the specified duration.
**Validates: Requirements 2.1**

### Property 3: Theme-Appropriate Hover Colors
*For any* theme state (Day/Night), hover effects should use colors that correspond to the current theme's color scheme.
**Validates: Requirements 2.2**

### Property 4: Independent Item Animations
*For any* sequence of multiple item hovers, each item should animate independently without interference from other concurrent animations.
**Validates: Requirements 2.3**

### Property 5: Consistent Hover Exit Timing
*For any* hovered item, removing hover should return the item to its original state within 300ms using smooth easing.
**Validates: Requirements 2.4**

### Property 6: Staggered Character Animation
*For any* text content being hovered, character-level animations should execute with consistent stagger timing across all characters.
**Validates: Requirements 2.5**

### Property 7: Proximity Wave Effects
*For any* item hover event, neighboring items within the proximity threshold should exhibit wave animation effects.
**Validates: Requirements 2.6**

### Property 8: Theme Transition Timing
*For any* theme change event, color transitions should complete within 400ms using smooth easing curves.
**Validates: Requirements 3.3**

### Property 9: Glow Effect Opacity Range
*For any* glow effect application, the opacity values should remain within the 15-25% range for subtle visual appearance.
**Validates: Requirements 3.4**

### Property 10: Theme-Animation Synchronization  
*For any* active animation state, colors and effects should remain synchronized with the current theme state.
**Validates: Requirements 3.5**

### Property 11: GPU-Only Property Animation
*For any* animation execution, only CSS transform and opacity properties should be modified to prevent layout shifts.
**Validates: Requirements 4.3, 4.4**

### Property 12: Animation Cleanup on Unmount
*For any* component unmount event, all GSAP timelines and event listeners should be properly destroyed to prevent memory leaks.
**Validates: Requirements 4.6, 8.2**

### Property 13: Accessibility State Preservation
*For any* animation-disabled state (reduced motion, fallback mode), core marquee functionality should remain fully accessible and operational.
**Validates: Requirements 5.3**

### Property 14: Keyboard Focus Visibility
*For any* focusable marquee element, keyboard navigation should provide clear visual focus indicators that meet accessibility standards.
**Validates: Requirements 5.4**

### Property 15: Screen Reader Content Access
*For any* animation state or transition, screen readers should maintain proper access to marquee content and semantics.
**Validates: Requirements 5.5**

### Property 16: Cross-Platform Fallback Behavior  
*For any* unsupported CSS feature or browser limitation, the system should provide appropriate fallback behavior without breaking functionality.
**Validates: Requirements 6.2**

### Property 17: Touch Interaction Consistency
*For any* touch-based device interaction, touch events should trigger appropriate hover-like states for consistent user experience.
**Validates: Requirements 6.3**

### Property 18: Browser Compatibility Preservation
*For any* browser without full animation support, core marquee functionality should remain intact without requiring advanced features.
**Validates: Requirements 6.4**

### Property 19: Hardware Acceleration Fallback
*For any* hardware limitation or lack of GPU acceleration, animations should gracefully fall back to software rendering.
**Validates: Requirements 6.5**

### Property 20: Theme State Responsiveness
*For any* theme context change, animations should immediately adapt their behavior and appearance to match the new theme state.
**Validates: Requirements 7.1**

### Property 21: CSS Custom Property Integration
*For any* theme class activation, animations should properly leverage existing CSS custom properties for consistent theming.
**Validates: Requirements 7.2**

### Property 22: Theme Transition Without Remount
*For any* theme change event, animation colors should update seamlessly without requiring component remount or recreation.
**Validates: Requirements 7.3**

### Property 23: GSAP Timeline State Management
*For any* animation pause or resume operation, GSAP timeline controls should maintain appropriate state management and responsiveness.
**Validates: Requirements 8.3**

### Property 24: Animation Batching Optimization  
*For any* batched animation operations, GSAP's requestAnimationFrame optimization should be utilized for optimal performance.
**Validates: Requirements 8.5**

## Testing Strategy

### Unit Testing Approach
- **Component Rendering**: Verify marquee items render with correct content and structure
- **Theme Integration**: Test color schemes and CSS class applications for Day/Night modes  
- **Event Handling**: Validate hover, focus, and keyboard interaction responses
- **Accessibility**: Confirm reduced motion compliance and ARIA implementations

### Property-Based Testing
- **Animation Properties**: Test universal behaviors across randomized inputs and states
- **Performance Properties**: Validate GPU-only animations and cleanup across scenarios
- **Theme Properties**: Verify color synchronization across theme transitions
- **Interaction Properties**: Test hover effects and proximity waves with varied inputs

### Integration Testing  
- **Cross-Browser**: Manual testing across Chrome, Firefox, Safari, Edge
- **Performance**: Frame rate monitoring and memory profiling during animations
- **Accessibility**: Testing with screen readers and keyboard-only navigation
- **Mobile**: Touch interaction testing on various devices and orientations

## Implementation Phases

### Phase 1: Core Marquee Foundation (Week 1)
- Base marquee component structure
- Continuous scroll animation with GSAP
- Theme context integration
- Basic accessibility setup

### Phase 2: Hover Animation System (Week 2)  
- Individual item hover effects
- Scale and glow animations
- Character-level text effects
- Theme-aware color system

### Phase 3: Advanced Interactions (Week 3)
- Proximity-based wave effects  
- Performance optimizations
- Memory management improvements
- Cross-browser compatibility testing

### Phase 4: Polish & Accessibility (Week 4)
- Reduced motion compliance
- Keyboard navigation enhancements
- Screen reader optimization
- Final performance validation

This design provides a comprehensive foundation for implementing a premium marquee component that meets all specified requirements while maintaining high performance, accessibility, and visual polish standards expected for LocalFirst Studios.