import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as fc from 'fast-check'
import Hero from './index.jsx'
import { ThemeProvider } from '../../contexts/ThemeContext.jsx'

/**
 * **Validates: Requirements 2.1, 2.2**
 * 
 * BUG CONDITION EXPLORATION TEST - EXPECTED TO FAIL ON UNFIXED CODE
 * 
 * This test demonstrates the bug where Hero content elements (headline, description, CTA buttons) 
 * are not visible when heroState.contentVisible == false AND heroState.videoBackground == true 
 * AND heroState.hasZIndexConflicts == true AND heroState.hasInlineStyleOverrides == true
 * 
 * The test will FAIL on the current unfixed code, confirming the bug exists.
 * When the fix is implemented, this same test will PASS, confirming the bug is resolved.
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

// Test wrapper with required providers
const TestWrapper = ({ children, theme = 'night' }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div data-testid="test-wrapper" className={`theme-${theme}`}>
          {children}
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

// Helper function to simulate the bug condition state
const createBugConditionState = () => ({
  contentVisible: false,
  videoBackground: true,
  hasZIndexConflicts: true,
  hasInlineStyleOverrides: true
})

// Helper function to check if Hero content elements are visible
const checkHeroContentVisibility = (container) => {
  const results = {
    hasLabel: false,
    hasHeadline: false,
    hasDescription: false,
    hasCtaButtons: false,
    labelVisible: false,
    headlineVisible: false,
    descriptionVisible: false,
    ctaButtonsVisible: false,
    zIndexIssues: [],
    styleIssues: []
  }

  // Check if elements exist in DOM
  const label = container.querySelector('p')?.textContent?.includes('Independent creative studio')
  const headline = container.querySelector('h1')?.textContent?.includes('WE BUILD DIGITAL EXPERIENCES')
  const description = container.querySelector('p')?.textContent?.includes('Premium websites for gyms')
  const ctaButtons = container.querySelectorAll('a').length >= 2

  results.hasLabel = !!label
  results.hasHeadline = !!headline  
  results.hasDescription = !!description
  results.hasCtaButtons = ctaButtons

  // Check computed styles for visibility issues
  const labelEl = container.querySelector('p')
  const headlineEl = container.querySelector('h1')
  const descriptionEl = Array.from(container.querySelectorAll('p')).find(p => 
    p.textContent?.includes('Premium websites for gyms')
  )
  const ctaContainer = container.querySelector('div[class*="flex"]')

  if (labelEl) {
    const labelStyles = window.getComputedStyle(labelEl)
    results.labelVisible = labelStyles.opacity !== '0' && labelStyles.visibility !== 'hidden'
    if (labelStyles.opacity === '0') results.styleIssues.push('Label has opacity: 0')
  }

  if (headlineEl) {
    const headlineStyles = window.getComputedStyle(headlineEl)
    results.headlineVisible = headlineStyles.opacity !== '0' && headlineStyles.visibility !== 'hidden'
    if (headlineStyles.opacity === '0') results.styleIssues.push('Headline has opacity: 0')
  }

  if (descriptionEl) {
    const descStyles = window.getComputedStyle(descriptionEl)
    results.descriptionVisible = descStyles.opacity !== '0' && descStyles.visibility !== 'hidden'
    if (descStyles.opacity === '0') results.styleIssues.push('Description has opacity: 0')
  }

  if (ctaContainer) {
    const ctaStyles = window.getComputedStyle(ctaContainer)
    results.ctaButtonsVisible = ctaStyles.opacity !== '0' && ctaStyles.visibility !== 'hidden'
    if (ctaStyles.opacity === '0') results.styleIssues.push('CTA buttons have opacity: 0')
  }

  // Check for z-index conflicts
  const videoEl = container.querySelector('video')
  const overlayEl = container.querySelectorAll('div')[1] // Second div should be overlay
  const contentEl = container.querySelector('[class*="flex items-center justify-center"]')

  if (videoEl) {
    const videoStyles = window.getComputedStyle(videoEl)
    if (videoStyles.zIndex === '1') results.zIndexIssues.push('Video has inline z-index: 1')
  }

  if (overlayEl) {
    const overlayStyles = window.getComputedStyle(overlayEl)
    if (overlayStyles.zIndex === '2') results.zIndexIssues.push('Overlay has inline z-index: 2')
  }

  if (contentEl) {
    const contentStyles = window.getComputedStyle(contentEl)
    if (contentStyles.zIndex === '3') results.zIndexIssues.push('Content has inline z-index: 3')
  }

  return results
}

describe('Hero Content Display Bug Condition Exploration', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.documentElement.className = ''
    vi.clearAllMocks()
  })

  it('CRITICAL: Should demonstrate Hero content visibility bug - EXPECTED TO FAIL on unfixed code', () => {
    // This test demonstrates the bug condition and will FAIL on unfixed code
    // The failure confirms the bug exists and validates our understanding
    const bugState = createBugConditionState()
    
    const { container } = render(
      <TestWrapper theme="night">
        <Hero />
      </TestWrapper>
    )

    const visibility = checkHeroContentVisibility(container)
    
    // Log findings for debugging (these will show in test output when it fails)
    console.log('Bug condition analysis:', {
      bugState,
      visibility,
      hasInlineStyles: container.innerHTML.includes('zIndex'),
      hasHardcodedColors: container.innerHTML.includes('#f7f3f0')
    })

    // These assertions demonstrate the expected behavior that should work but currently fails
    // When the test FAILS, it proves the bug exists with specific counterexamples
    expect(visibility.hasLabel, 'Label element should exist in DOM').toBe(true)
    expect(visibility.hasHeadline, 'Headline element should exist in DOM').toBe(true)
    expect(visibility.hasDescription, 'Description element should exist in DOM').toBe(true)
    expect(visibility.hasCtaButtons, 'CTA buttons should exist in DOM').toBe(true)
    
    // These are the critical visibility checks that will fail on unfixed code
    expect(visibility.labelVisible, 'Label should be visible (not opacity: 0)').toBe(true)
    expect(visibility.headlineVisible, 'Headline should be visible (not opacity: 0)').toBe(true)
    expect(visibility.descriptionVisible, 'Description should be visible (not opacity: 0)').toBe(true)
    expect(visibility.ctaButtonsVisible, 'CTA buttons should be visible (not opacity: 0)').toBe(true)
    
    // Check that z-index conflicts don't exist
    expect(visibility.zIndexIssues.length, `Z-index conflicts found: ${visibility.zIndexIssues.join(', ')}`).toBe(0)
    
    // Check that inline style overrides don't conflict
    expect(visibility.styleIssues.length, `Style conflicts found: ${visibility.styleIssues.join(', ')}`).toBe(0)
  })

  it('Property: Hero content visibility across theme modes - EXPECTED TO FAIL on unfixed code', () => {
    /**
     * Property-based test that generates different theme scenarios
     * This will fail on unfixed code, providing counterexamples across theme modes
     */
    fc.assert(
      fc.property(
        fc.constantFrom('night', 'day'),
        fc.record({
          viewport: fc.record({
            width: fc.integer({ min: 320, max: 1920 }),
            height: fc.integer({ min: 568, max: 1080 })
          }),
          reduced_motion: fc.boolean()
        }),
        (theme, testConfig) => {
          // Set viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: testConfig.viewport.width,
          })
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: testConfig.viewport.height,
          })

          // Mock reduced motion preference
          vi.mocked(window.matchMedia).mockReturnValue({
            matches: testConfig.reduced_motion,
            media: '(prefers-reduced-motion: reduce)',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })

          const { container, unmount } = render(
            <TestWrapper theme={theme}>
              <Hero />
            </TestWrapper>
          )

          const visibility = checkHeroContentVisibility(container)

          // Log counterexample details when property fails
          if (!visibility.labelVisible || !visibility.headlineVisible || 
              !visibility.descriptionVisible || !visibility.ctaButtonsVisible) {
            console.log(`Counterexample found - Theme: ${theme}, Config:`, testConfig)
            console.log('Visibility issues:', visibility)
          }

          unmount()

          // Property: Hero content must be visible in all theme modes and viewport sizes
          return visibility.labelVisible && 
                 visibility.headlineVisible && 
                 visibility.descriptionVisible && 
                 visibility.ctaButtonsVisible &&
                 visibility.zIndexIssues.length === 0 &&
                 visibility.styleIssues.length === 0
        }
      ),
      { 
        numRuns: 20,  // Scoped approach for deterministic bug
        verbose: true  // Show counterexamples when property fails
      }
    )
  })

  it('Specific bug scenario: Homepage load with theme switching - EXPECTED TO FAIL on unfixed code', () => {
    /**
     * Test specific scenarios mentioned in requirements:
     * - Homepage load, theme switching, mobile viewport scenarios
     */
    
    // Test homepage load scenario
    const { container: nightContainer, rerender } = render(
      <TestWrapper theme="night">
        <Hero />
      </TestWrapper>
    )

    const nightVisibility = checkHeroContentVisibility(nightContainer)
    
    // Switch to day theme
    rerender(
      <TestWrapper theme="day">
        <Hero />
      </TestWrapper>
    )

    const dayVisibility = checkHeroContentVisibility(nightContainer)

    // Test mobile viewport (simulate mobile scenario)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone viewport width
    })

    const { container: mobileContainer } = render(
      <TestWrapper theme="night">
        <Hero />
      </TestWrapper>
    )

    const mobileVisibility = checkHeroContentVisibility(mobileContainer)

    // All scenarios should show visible content, but will fail on unfixed code
    expect(nightVisibility.labelVisible && nightVisibility.headlineVisible && 
           nightVisibility.descriptionVisible && nightVisibility.ctaButtonsVisible, 
           'Night theme Hero content should be visible').toBe(true)
    
    expect(dayVisibility.labelVisible && dayVisibility.headlineVisible && 
           dayVisibility.descriptionVisible && dayVisibility.ctaButtonsVisible,
           'Day theme Hero content should be visible').toBe(true)
           
    expect(mobileVisibility.labelVisible && mobileVisibility.headlineVisible && 
           mobileVisibility.descriptionVisible && mobileVisibility.ctaButtonsVisible,
           'Mobile viewport Hero content should be visible').toBe(true)
  })
})