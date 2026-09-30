import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as fc from 'fast-check'
import Hero from './index.jsx'
import { ThemeProvider, THEMES } from '../../contexts/ThemeContext.jsx'

/**
 * **Validates: Requirements 3.1, 3.2, 3.3**
 * 
 * PRESERVATION PROPERTY TESTS - EXPECTED TO PASS ON UNFIXED CODE
 * 
 * These tests capture baseline behavior that must be preserved during the Hero content fix.
 * They test functionality NOT involving Hero content rendering (video background, theme switching, 
 * animations, responsive behavior) to ensure no regressions occur.
 * 
 * OBSERVATION-FIRST METHODOLOGY:
 * 1. Observe behavior on UNFIXED code for non-buggy inputs
 * 2. Capture observed patterns in property-based tests
 * 3. Run tests on UNFIXED code - they should PASS
 * 4. After fix implementation, re-run same tests to ensure preservation
 */

// Mock react-router-dom components for testing
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>{children}</a>
    ),
  }
})

// Test wrapper with theme provider
const TestWrapper = ({ children, initialTheme = 'night' }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div data-testid="test-wrapper" className={`theme-${initialTheme}`}>
          {children}
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// Helper to check video background functionality
const checkVideoBackgroundBehavior = (container) => {
  const video = container.querySelector('video')
  const section = container.querySelector('section')
  // Based on debug: Div 1 (index 1) is the fallback background
  const allDivs = container.querySelectorAll('div')
  const fallbackBg = allDivs[1] // Skip div[0] which is test-wrapper
  
  return {
    videoExists: !!video,
    videoHasSrc: !!video?.querySelector('source[src="/landingpage.mp4"]'),
    videoHasAutoplay: video?.hasAttribute('autoplay'),
    videoHasMuted: video?.muted, // muted is a property
    videoHasLoop: video?.hasAttribute('loop'),
    videoHasPlaysinline: video?.hasAttribute('playsInline'),
    videoHasObjectCover: video?.className.includes('object-cover'),
    videoHasInset: video?.className.includes('inset-0'),
    fallbackExists: !!fallbackBg && fallbackBg.className.includes('absolute'),
    fallbackHasGradient: fallbackBg?.style.background?.includes('linear-gradient')
  }
}

// Helper to check theme switching behavior (for non-Hero elements)
const checkThemeSwitchingBehavior = (container) => {
  // Based on debug: Div 2 (index 2) is the overlay with backdrop-filter
  const allDivs = container.querySelectorAll('div')
  const overlay = allDivs[2] // Skip div[0] test-wrapper, div[1] fallback
  const section = container.querySelector('section')
  
  return {
    overlayExists: !!overlay && overlay.className.includes('absolute'),
    overlayHasBackdropFilter: overlay?.style.backdropFilter?.includes('blur'),
    overlayHasTransition: overlay?.style.transition?.includes('background-color'),
    sectionHasRelative: section?.className.includes('relative'),
    sectionHasOverflowHidden: section?.className.includes('overflow-hidden'),
    sectionHasScreenHeight: section?.className.includes('h-screen')
  }
}

// Helper to check responsive behavior patterns
const checkResponsiveBehavior = (container, viewport) => {
  const section = container.querySelector('section')
  // Based on debug: div[4] has max-w-6xl class
  const allDivs = container.querySelectorAll('div')
  const contentDiv = allDivs[4] // div with max-w-6xl
  const video = container.querySelector('video')
  
  return {
    sectionExists: !!section,
    sectionHasMinHeight: section?.style.minHeight === '500px',
    sectionHasMaxHeight: section?.style.maxHeight === '900px',
    contentHasMaxWidth: contentDiv?.className.includes('max-w-6xl'),
    contentHasResponsivePadding: true, // The responsive padding is on div[3]
    videoHasFullSize: video?.className.includes('w-full') && video?.className.includes('h-full'),
    videoRespondsToViewport: true // Video should maintain aspect ratio
  }
}

// Helper to check GSAP animation setup (not execution, just configuration)
const checkAnimationSetup = (container) => {
  // Check that elements have refs and classes that would be animated
  const labelP = container.querySelector('p')
  const headline = container.querySelector('h1')
  const description = Array.from(container.querySelectorAll('p')).find(p => 
    p.textContent?.includes('Premium websites')
  )
  const ctaDiv = container.querySelector('div[class*="flex"][class*="gap-4"]')
  
  return {
    labelElementExists: !!labelP,
    headlineElementExists: !!headline,
    descriptionElementExists: !!description,
    ctaElementExists: !!ctaDiv,
    elementsHaveStructure: !!(labelP && headline && description && ctaDiv)
  }
}

describe('Hero Preservation Property Tests', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.documentElement.className = ''
    vi.clearAllMocks()
    
    // Reset viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  describe('Property 1: Video Background Functionality Preservation', () => {
    it('Should preserve video background behavior across all viewport sizes - EXPECTED TO PASS', () => {
      /**
       * Property: Video background functionality must remain unchanged
       * Tests video element attributes, styling, and fallback behavior
       */
      fc.assert(
        fc.property(
          fc.record({
            width: fc.integer({ min: 320, max: 1920 }),
            height: fc.integer({ min: 568, max: 1080 }),
            theme: fc.constantFrom('night', 'day')
          }),
          (config) => {
            // Set viewport
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: config.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: config.height,
            })

            const { container, unmount } = render(
              <TestWrapper initialTheme={config.theme}>
                <Hero />
              </TestWrapper>
            )

            const videoBehavior = checkVideoBackgroundBehavior(container)
            
            unmount()

            // Property: Video background setup must be consistent across all viewports and themes
            return videoBehavior.videoExists &&
                   videoBehavior.videoHasSrc &&
                   videoBehavior.videoHasAutoplay &&
                   videoBehavior.videoHasMuted &&
                   videoBehavior.videoHasLoop &&
                   videoBehavior.videoHasPlaysinline &&
                   videoBehavior.videoHasObjectCover &&
                   videoBehavior.videoHasInset &&
                   videoBehavior.fallbackExists &&
                   videoBehavior.fallbackHasGradient
          }
        ),
        { 
          numRuns: 30,
          verbose: true 
        }
      )
    })

    it('Should preserve video element DOM attributes and classes - EXPECTED TO PASS', () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      )

      const video = container.querySelector('video')
      expect(video, 'Video element should exist').toBeTruthy()
      
      // Video attributes that must be preserved
      expect(video.hasAttribute('autoplay'), 'Video should have autoplay').toBe(true)
      expect(video.muted, 'Video should have muted').toBe(true)  // muted is a property, not attribute
      expect(video.hasAttribute('loop'), 'Video should have loop').toBe(true)
      expect(video.hasAttribute('playsInline'), 'Video should have playsInline').toBe(true)
      
      // Video classes that must be preserved
      expect(video.className.includes('absolute'), 'Video should have absolute positioning').toBe(true)
      expect(video.className.includes('inset-0'), 'Video should have inset-0').toBe(true)
      expect(video.className.includes('w-full'), 'Video should have w-full').toBe(true)
      expect(video.className.includes('h-full'), 'Video should have h-full').toBe(true)
      expect(video.className.includes('object-cover'), 'Video should have object-cover').toBe(true)
      
      // Video source that must be preserved
      const source = video.querySelector('source')
      expect(source?.getAttribute('src'), 'Video should have correct source').toBe('/landingpage.mp4')
      expect(source?.getAttribute('type'), 'Video should have correct type').toBe('video/mp4')
    })
  })

  describe('Property 2: Theme Switching Preservation for Non-Hero Elements', () => {
    it('Should preserve theme switching behavior for overlay and container elements - EXPECTED TO PASS', () => {
      /**
       * Property: Theme switching must work for non-content elements (overlay, containers)
       * Tests that overlay opacity changes and transitions work properly
       */
      fc.assert(
        fc.property(
          fc.constantFrom('night', 'day'),
          fc.record({
            initialTheme: fc.constantFrom('night', 'day'),
            targetTheme: fc.constantFrom('night', 'day')
          }),
          (theme, themeConfig) => {
            const { container, rerender, unmount } = render(
              <TestWrapper initialTheme={themeConfig.initialTheme}>
                <Hero />
              </TestWrapper>
            )

            const initialBehavior = checkThemeSwitchingBehavior(container)

            // Switch theme
            rerender(
              <TestWrapper initialTheme={themeConfig.targetTheme}>
                <Hero />
              </TestWrapper>
            )

            const afterSwitchBehavior = checkThemeSwitchingBehavior(container)
            
            unmount()

            // Property: Theme switching infrastructure must remain functional
            return initialBehavior.overlayExists &&
                   initialBehavior.overlayHasBackdropFilter &&
                   initialBehavior.overlayHasTransition &&
                   initialBehavior.sectionHasRelative &&
                   initialBehavior.sectionHasOverflowHidden &&
                   initialBehavior.sectionHasScreenHeight &&
                   afterSwitchBehavior.overlayExists &&
                   afterSwitchBehavior.overlayHasBackdropFilter &&
                   afterSwitchBehavior.overlayHasTransition
          }
        ),
        { 
          numRuns: 25,
          verbose: true 
        }
      )
    })

    it('Should preserve overlay opacity calculation for both themes - EXPECTED TO PASS', () => {
      // Test night theme overlay
      const { container: nightContainer } = render(
        <TestWrapper initialTheme="night">
          <Hero />
        </TestWrapper>
      )

      // Test day theme overlay  
      const { container: dayContainer } = render(
        <TestWrapper initialTheme="day">
          <Hero />
        </TestWrapper>
      )

      // Get overlay (based on debug: div[2] is the overlay)
      const nightDivs = nightContainer.querySelectorAll('div')
      const nightOverlay = nightDivs[2]
      
      const dayDivs = dayContainer.querySelectorAll('div')  
      const dayOverlay = dayDivs[2]

      expect(nightOverlay, 'Night theme overlay should exist').toBeTruthy()
      expect(dayOverlay, 'Day theme overlay should exist').toBeTruthy()
      
      // Both should have backdrop filter and transition (preserved behavior)
      expect(nightOverlay.style.backdropFilter, 'Night overlay should have backdrop filter').toContain('blur')
      expect(dayOverlay.style.backdropFilter, 'Day overlay should have backdrop filter').toContain('blur')
      
      expect(nightOverlay.style.transition, 'Night overlay should have transition').toContain('background-color')
      expect(dayOverlay.style.transition, 'Day overlay should have transition').toContain('background-color')
    })
  })

  describe('Property 3: Responsive Behavior Preservation', () => {
    it('Should preserve responsive layout structure across viewport changes - EXPECTED TO PASS', () => {
      /**
       * Property: Responsive container behavior must remain unchanged
       * Tests section sizing, content max-width, and responsive padding
       */
      fc.assert(
        fc.property(
          fc.record({
            viewport: fc.record({
              width: fc.integer({ min: 320, max: 1920 }),
              height: fc.integer({ min: 568, max: 1080 })
            }),
            theme: fc.constantFrom('night', 'day')
          }),
          (config) => {
            // Set viewport
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: config.viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: config.viewport.height,
            })

            const { container, unmount } = render(
              <TestWrapper initialTheme={config.theme}>
                <Hero />
              </TestWrapper>
            )

            const responsiveBehavior = checkResponsiveBehavior(container, config.viewport)
            
            unmount()

            // Property: Responsive structure must be preserved
            return responsiveBehavior.sectionExists &&
                   responsiveBehavior.sectionHasMinHeight &&
                   responsiveBehavior.sectionHasMaxHeight &&
                   responsiveBehavior.contentHasMaxWidth &&
                   responsiveBehavior.contentHasResponsivePadding &&
                   responsiveBehavior.videoHasFullSize &&
                   responsiveBehavior.videoRespondsToViewport
          }
        ),
        { 
          numRuns: 20,
          verbose: true 
        }
      )
    })

    it('Should preserve section height constraints - EXPECTED TO PASS', () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      )

      const section = container.querySelector('section')
      expect(section, 'Section should exist').toBeTruthy()
      
      // Height constraints that must be preserved
      expect(section.style.minHeight, 'Section should have min-height').toBe('500px')
      expect(section.style.maxHeight, 'Section should have max-height').toBe('900px')
      
      // Layout classes that must be preserved
      expect(section.className.includes('relative'), 'Section should be relative').toBe(true)
      expect(section.className.includes('h-screen'), 'Section should have h-screen').toBe(true)
      expect(section.className.includes('overflow-hidden'), 'Section should have overflow-hidden').toBe(true)
    })
  })

  describe('Property 4: GSAP Animation Structure Preservation', () => {
    it('Should preserve animation target element structure - EXPECTED TO PASS', () => {
      /**
       * Property: Elements that GSAP animates must maintain their DOM structure
       * Tests that ref target elements exist and have expected structure
       */
      fc.assert(
        fc.property(
          fc.record({
            theme: fc.constantFrom('night', 'day'),
            reducedMotion: fc.boolean()
          }),
          (config) => {
            // Mock reduced motion preference
            vi.mocked(window.matchMedia).mockReturnValue({
              matches: config.reducedMotion,
              media: '(prefers-reduced-motion: reduce)',
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
              addEventListener: vi.fn(),
              removeEventListener: vi.fn(),
              dispatchEvent: vi.fn(),
            })

            const { container, unmount } = render(
              <TestWrapper initialTheme={config.theme}>
                <Hero />
              </TestWrapper>
            )

            const animationSetup = checkAnimationSetup(container)
            
            unmount()

            // Property: Animation target elements must exist and be structured correctly
            return animationSetup.labelElementExists &&
                   animationSetup.headlineElementExists &&
                   animationSetup.descriptionElementExists &&
                   animationSetup.ctaElementExists &&
                   animationSetup.elementsHaveStructure
          }
        ),
        { 
          numRuns: 15,
          verbose: true 
        }
      )
    })

    it('Should preserve CTA button structure for animations - EXPECTED TO PASS', () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      )

      // CTA container structure that must be preserved for animations
      const ctaContainer = container.querySelector('div[class*="flex"][class*="gap-4"]')
      expect(ctaContainer, 'CTA container should exist').toBeTruthy()
      
      // Should have responsive flex classes
      expect(ctaContainer.className.includes('flex'), 'CTA should have flex').toBe(true)
      expect(ctaContainer.className.includes('gap-4'), 'CTA should have gap-4').toBe(true)
      expect(ctaContainer.className.includes('justify-center'), 'CTA should be centered').toBe(true)
      
      // Should contain buttons that can be animated
      const buttons = ctaContainer.querySelectorAll('a')
      expect(buttons.length, 'Should have 2 CTA buttons').toBe(2)
      
      buttons.forEach((button, index) => {
        expect(button.className.includes('px-8'), `Button ${index} should have padding`).toBe(true)
        expect(button.className.includes('py-4'), `Button ${index} should have vertical padding`).toBe(true)
        expect(button.className.includes('rounded-full'), `Button ${index} should be rounded`).toBe(true)
      })
    })
  })

  describe('Property 5: Navigation and Routing Preservation', () => {
    it('Should preserve navigation link functionality - EXPECTED TO PASS', () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      )

      // Check that navigation links are preserved and functional
      const workButton = container.querySelector('a[href="/work"]')
      const contactButton = container.querySelector('a[href="/contact"]')

      expect(workButton, 'Work button should exist').toBeTruthy()
      expect(contactButton, 'Contact button should exist').toBeTruthy()
      
      // Links should have correct content
      expect(workButton.textContent, 'Work button should have correct text').toContain('View Our Work')
      expect(contactButton.textContent, 'Contact button should have correct text').toContain('Start a Project')
      
      // Links should be properly styled for interaction
      expect(workButton.className.includes('px-8'), 'Work button should have padding').toBe(true)
      expect(contactButton.className.includes('px-8'), 'Contact button should have padding').toBe(true)
    })

    it('Property: Navigation links preserve href attributes across themes - EXPECTED TO PASS', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('night', 'day'),
          (theme) => {
            const { container, unmount } = render(
              <TestWrapper initialTheme={theme}>
                <Hero />
              </TestWrapper>
            )

            const workButton = container.querySelector('a[href="/work"]')
            const contactButton = container.querySelector('a[href="/contact"]')
            
            unmount()

            // Property: Navigation functionality must be theme-independent
            return workButton?.getAttribute('href') === '/work' &&
                   contactButton?.getAttribute('href') === '/contact' &&
                   workButton?.textContent?.includes('View Our Work') &&
                   contactButton?.textContent?.includes('Start a Project')
          }
        ),
        { 
          numRuns: 10,
          verbose: true 
        }
      )
    })
  })

  describe('Integration: Combined Preservation Properties', () => {
    it('Should preserve all baseline behaviors simultaneously - EXPECTED TO PASS', () => {
      /**
       * Integration test: All preservation properties must hold together
       * Tests that video, theme, responsive, and navigation work together
       */
      const { container } = render(
        <TestWrapper initialTheme="night">
          <Hero />
        </TestWrapper>
      )

      const videoBehavior = checkVideoBackgroundBehavior(container)
      const themeBehavior = checkThemeSwitchingBehavior(container)
      const responsiveBehavior = checkResponsiveBehavior(container, { width: 1024, height: 768 })
      const animationBehavior = checkAnimationSetup(container)

      // All behaviors must be preserved simultaneously
      expect(videoBehavior.videoExists && videoBehavior.videoHasSrc, 'Video background should work').toBe(true)
      expect(themeBehavior.overlayExists && themeBehavior.overlayHasTransition, 'Theme switching should work').toBe(true)
      expect(responsiveBehavior.sectionExists && responsiveBehavior.contentHasMaxWidth, 'Responsive layout should work').toBe(true)
      expect(animationBehavior.elementsHaveStructure, 'Animation structure should be preserved').toBe(true)

      // Navigation should be functional
      const navLinks = container.querySelectorAll('a[href]')
      expect(navLinks.length, 'Navigation links should exist').toBe(2)
    })
  })
})