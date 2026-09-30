# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Hero Content Visibility Test
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that Hero content elements (headline, description, CTA buttons) are visible when heroState.contentVisible == false AND heroState.videoBackground == true AND heroState.hasZIndexConflicts == true AND heroState.hasInlineStyleOverrides == true
  - Create property-based test that verifies Hero content visibility across different theme modes (day/night)
  - Test cases: Homepage load, theme switching, mobile viewport scenarios
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: Hero content opacity, z-index conflicts, CSS variable resolution failures
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Video Background and Theme Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (video background playback, theme switching for other components, navigation functionality)
  - Write property-based tests capturing observed behavior patterns: video autoplay, theme context switching, GSAP animations, responsive behavior
  - Property-based testing generates many test cases for stronger preservation guarantees
  - Test that for all interactions NOT involving Hero content rendering, behavior remains unchanged
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Fix for Hero content display z-index and theme compatibility issues

  - [x] 3.1 Remove inline z-index styles and implement CSS classes
    - Remove `style={{ zIndex: 1 }}` from video element
    - Remove `style={{ zIndex: 2 }}` from overlay element  
    - Remove `style={{ zIndex: 3 }}` from content container
    - Create CSS utility classes: `.hero-video-bg`, `.hero-overlay`, `.hero-content`
    - Apply proper z-index values through CSS classes instead of inline styles
    - _Bug_Condition: isBugCondition(heroState) where heroState.hasZIndexConflicts == true_
    - _Expected_Behavior: contentIsVisible(result) AND themeStylesApplied(result)_
    - _Preservation: Video background and theme functionality from design_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [x] 3.2 Replace hardcoded colors with CSS custom properties
    - Replace all instances of `#f7f3f0` with appropriate CSS custom properties
    - Ensure theme-aware color variables work in both day and night modes
    - Update headline, description, and button styling to use theme variables
    - Remove inline color styles that conflict with theme system
    - _Bug_Condition: heroState.hasInlineStyleOverrides == true_
    - _Expected_Behavior: Theme-appropriate styling applied correctly_
    - _Preservation: Existing theme switching functionality_
    - _Requirements: 2.1, 2.2, 3.2_

  - [x] 3.3 Fix font family implementation for theme compatibility
    - Replace inline font-family styles with CSS custom properties
    - Ensure Playfair Display editorial typography works properly in day mode
    - Use theme-contextual font selections instead of hardcoded font-family
    - Maintain proper font-weight and text-shadow effects through CSS classes
    - _Bug_Condition: Editorial typography not working properly across themes_
    - _Expected_Behavior: Proper font rendering in both day and night modes_
    - _Preservation: Existing responsive typography and animation behavior_
    - _Requirements: 2.2, 3.2_

  - [ ] 3.4 Ensure proper initial visibility before GSAP animations
    - Review initial opacity settings to prevent conflicts with GSAP animations
    - Ensure content is initially visible before entrance animations
    - Verify no CSS transition conflicts with GSAP initial states
    - Test that content appears correctly when reduced motion is enabled
    - _Bug_Condition: Content not visible due to animation conflicts_
    - _Expected_Behavior: Content visible with proper animation sequence_
    - _Preservation: GSAP animation timing and effects_
    - _Requirements: 2.1, 3.3_

  - [ ] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Hero Content Visibility Test
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Video Background and Theme Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions in video background, theme switching, animations)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise
  - Verify Hero content is visible across all theme modes and viewport sizes
  - Confirm video background and theme switching functionality is preserved
  - Validate that z-index layering works correctly without inline styles
  - Test editorial typography renders properly in day mode with Playfair Display