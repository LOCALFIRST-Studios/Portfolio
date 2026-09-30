# Hero Content Display Fix Bugfix Design

## Overview

The Hero section content (headline, description, CTA buttons) is not visible on the homepage despite the video background working correctly. The bug manifests when users load the homepage - they see only the navbar and video background, but none of the Hero text content appears. This is a critical usability issue as the Hero section contains the main value proposition and call-to-action buttons.

The fix involves correcting z-index layering, inline style conflicts with CSS variables, and ensuring proper theme variable application for content visibility across both day and night modes.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Hero content elements have z-index conflicts and inline styles that prevent proper display
- **Property (P)**: The desired behavior when Hero loads - all content (headline, description, buttons) should be visible with proper editorial typography
- **Preservation**: Existing video background functionality and theme switching that must remain unchanged by the fix
- **z-index layering**: The stacking order that determines which elements appear in front of others
- **Theme variables**: CSS custom properties that change based on day/night mode selection
- **Editorial typography**: The Playfair Display serif font used in day mode for enhanced readability

## Bug Details

### Bug Condition

The bug manifests when the Hero section loads on the homepage. The content elements (headline, description, CTA buttons) are either completely invisible or have conflicting z-index values that place them behind the video background and overlay layers.

**Formal Specification:**
```
FUNCTION isBugCondition(heroState)
  INPUT: heroState of type HeroSectionState
  OUTPUT: boolean
  
  RETURN heroState.contentVisible == false
         AND heroState.videoBackground == true
         AND heroState.hasZIndexConflicts == true
         AND heroState.hasInlineStyleOverrides == true
END FUNCTION
```

### Examples

- **Homepage Load**: User navigates to homepage, sees video background and navbar, but no Hero content text or buttons
- **Theme Switch**: User toggles between day/night mode, video background changes but Hero content remains invisible
- **Mobile View**: On mobile devices, Hero content is invisible despite proper responsive container sizing
- **Development Mode**: Content visibility works in some builds but fails in production due to CSS variable conflicts

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Video background must continue to play automatically with proper aspect ratio and positioning
- Theme switching between day/night modes must continue to work for all other components
- Responsive behavior for different screen sizes must remain intact
- GSAP animations for Hero content entrance must continue to function
- Navbar display and positioning must remain unaffected

**Scope:**
All inputs that do NOT involve Hero content rendering should be completely unaffected by this fix. This includes:
- Video background loading and playback functionality
- Theme context switching mechanism
- Other page sections and components
- Navigation and routing functionality

## Hypothesized Root Cause

Based on the code analysis, the most likely issues are:

1. **Z-Index Stacking Context Issues**: The Hero content has z-index: 3, but inline styles on video (z-index: 1) and overlays (z-index: 2) may be creating stacking context conflicts
   - Video background uses `style={{ zIndex: 1 }}`
   - Overlay uses `style={{ zIndex: 2 }}`
   - Content container uses `style={{ zIndex: 3 }}`

2. **Inline Style Conflicts with CSS Variables**: The Hero component uses hardcoded inline styles that may conflict with theme CSS variables
   - Hardcoded colors like `#f7f3f0` instead of CSS custom properties
   - Font family overrides that bypass theme system

3. **CSS Transition Conflicts**: Global transition rules may interfere with Hero content initial display
   - All elements have automatic transitions applied
   - Initial opacity: 0 from GSAP may conflict with CSS transitions

4. **Theme Variable Application Issues**: The content may not be properly inheriting theme-based color variables for visibility
   - Day theme variables not properly applied to Hero content
   - Color contrast issues in different theme modes

## Correctness Properties

Property 1: Bug Condition - Hero Content Visibility

_For any_ page load where the Hero section renders with video background active, the fixed Hero component SHALL display all content elements (headline, description, CTA buttons) with proper visibility, correct z-index stacking, and theme-appropriate styling.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Video Background and Theme Functionality

_For any_ interaction that does NOT involve Hero content rendering (video playback, theme switching, navigation), the fixed code SHALL produce exactly the same behavior as the original code, preserving video background functionality and theme switching capabilities.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/sections/Hero/index.jsx`

**Function**: `Hero` component

**Specific Changes**:
1. **Remove Inline Z-Index Styles**: Replace all inline z-index styles with CSS classes
   - Remove `style={{ zIndex: 1 }}` from video element
   - Remove `style={{ zIndex: 2 }}` from overlay element
   - Remove `style={{ zIndex: 3 }}` from content container

2. **Replace Hardcoded Colors with CSS Variables**: Replace all hardcoded color values with theme-aware CSS custom properties
   - Replace `#f7f3f0` with `var(--color-cream)` or appropriate theme variable
   - Use theme-contextual colors that work in both day and night modes

3. **Fix Font Family Implementation**: Ensure editorial typography works properly across themes
   - Use CSS custom properties instead of inline font-family styles
   - Respect theme-based font selections (Playfair Display for day mode)

4. **Add Proper CSS Classes for Layering**: Create utility classes for proper z-index management
   - Add `.hero-video-bg` class for video background
   - Add `.hero-overlay` class for readability overlay
   - Add `.hero-content` class for content container

5. **Ensure Proper Initial Visibility**: Make sure content is initially visible before GSAP animations
   - Set appropriate initial opacity values
   - Ensure no CSS conflicts with GSAP initial states

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create visual tests that check Hero content visibility across different conditions. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Homepage Load Test**: Load homepage and check if Hero content is visible (will fail on unfixed code)
2. **Day Theme Test**: Switch to day theme and verify Hero content visibility (will fail on unfixed code)
3. **Night Theme Test**: Switch to night theme and verify Hero content visibility (will fail on unfixed code)
4. **Mobile Viewport Test**: Test Hero content visibility on mobile screen sizes (may fail on unfixed code)

**Expected Counterexamples**:
- Hero content elements return computed style opacity of 0 or visibility: hidden
- Possible causes: z-index conflicts, CSS variable resolution failures, inline style precedence issues

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL heroState WHERE isBugCondition(heroState) DO
  result := renderHero_fixed(heroState)
  ASSERT contentIsVisible(result) AND themeStylesApplied(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL interaction WHERE NOT isBugCondition(interaction) DO
  ASSERT Hero_original(interaction) = Hero_fixed(interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-Hero-content interactions

**Test Plan**: Observe behavior on UNFIXED code first for video background and theme switching, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Video Background Preservation**: Verify video continues to load, play, and respond correctly after fix
2. **Theme Switching Preservation**: Verify theme switching works correctly for all other components after fix
3. **Animation Preservation**: Verify GSAP animations work correctly after CSS changes
4. **Responsive Preservation**: Verify responsive behavior continues working across all screen sizes

### Unit Tests

- Test Hero content visibility in different theme modes
- Test z-index layering with different viewport sizes
- Test that CSS variables are properly resolved in different theme contexts
- Test that inline style removal doesn't break other functionality

### Property-Based Tests

- Generate random theme combinations and verify Hero content visibility works correctly
- Generate random viewport sizes and verify responsive behavior is maintained
- Test that all theme switching scenarios continue to work across many combinations

### Integration Tests

- Test full page load flow with Hero content visibility in both themes
- Test theme switching with Hero section visible and verify smooth transitions
- Test that video background and Hero content work together across different network conditions