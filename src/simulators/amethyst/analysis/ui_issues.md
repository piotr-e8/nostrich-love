# Amethyst Simulator UI Issues

## Critical Issues (Fix Immediately)

### 1. **LoginScreen.tsx - Form Validation Missing**
- **Issue:** No validation on npub/nsec input fields
- **Severity:** Critical
- **Affected Files:** LoginScreen.tsx
- **Suggested Fix:** Add regex validation, show error states, disable submit until valid
- **Material Component:** TextField with error state

### 2. **HomeScreen.tsx - Tab Indicator Not Aligned with Material 3**
- **Issue:** Tab indicator uses basic line instead of Material 3 pill shape
- **Severity:** Critical
- **Affected Files:** HomeScreen.tsx, amethyst.theme.css
- **Suggested Fix:** Use Material 3 Secondary Tab indicator (pill/rounded style)
- **CSS Changes:** 
  ```css
  .md-tab-indicator {
    height: 3px;
    border-radius: 3px 3px 0 0;
    width: 40%;
    margin: 0 auto;
  }
  ```

### 3. **ComposeScreen.tsx - Character Counter Overflow**
- **Issue:** Circular progress indicator overflows container at 100%+
- **Severity:** Critical
- **Affected Files:** ComposeScreen.tsx:262-283
- **Suggested Fix:** Clamp max strokeDasharray value or switch to linear progress
- **Code:**
  ```tsx
  strokeDasharray={`${Math.min((content.length / maxLength) * 62.8, 62.8)} 62.8`}
  ```

---

## High Priority Issues

### 4. **MaterialCard.tsx - Missing Long-Press Actions**
- **Issue:** No context menu on posts (can't copy link, share, etc.)
- **Severity:** High
- **Affected Files:** MaterialCard.tsx
- **Suggested Fix:** Add onContextMenu handler with Material Menu
- **Material Component:** Menu, MenuItem

### 5. **ProfileScreen.tsx - "Edit Profile" Button Confusion**
- **Issue:** Button labeled "Edit Profile" but toggles follow state on own profile
- **Severity:** High
- **Affected Files:** ProfileScreen.tsx:127-131
- **Suggested Fix:** 
  - If viewing own profile: Navigate to Edit Profile screen
  - If viewing other: Show Follow/Unfollow button
- **Code Changes:** Add conditional logic based on currentUser vs profileUser

### 6. **BottomNav.tsx - Missing Active State Animation**
- **Issue:** No transition animation when switching tabs
- **Severity:** High
- **Affected Files:** BottomNav.tsx
- **Suggested Fix:** Add layout animation to active indicator
- **Framer Motion:** Use layoutId for smooth transitions

### 7. **SearchScreen.tsx - No Loading State**
- **Issue:** Search shows no feedback during "search" operation
- **Severity:** High
- **Affected Files:** SearchScreen.tsx:28-64
- **Suggested Fix:** Add CircularProgressIndicator during search simulation
- **Material Component:** CircularProgressIndicator

### 8. **NotificationsScreen.tsx - Badge Misalignment**
- **Issue:** Notification count badge positioned inconsistently
- **Severity:** High
- **Affected Files:** NotificationsScreen.tsx:251-254
- **Suggested Fix:** Use consistent positioning with transform translate
- **CSS:**
  ```css
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(25%, 25%);
  ```

---

## Medium Priority Issues

### 9. **All Screens - Missing Ripple Effects**
- **Issue:** Interactive elements lack Material ripple feedback
- **Severity:** Medium
- **Affected Files:** All screen files
- **Suggested Fix:** Add CSS ripple effect or use Material ripple component
- **Implementation:**
  ```css
  .md-ripple {
    position: relative;
    overflow: hidden;
  }
  .md-ripple::after {
    /* Ripple animation CSS */
  }
  ```

### 10. **SettingsScreen.tsx - Toggle Switch Not Material 3**
- **Issue:** Custom toggle implementation instead of Material Switch
- **Severity:** Medium
- **Affected Files:** SettingsScreen.tsx:298-304
- **Suggested Fix:** Replace with Material 3 Switch component
- **Material Spec:** 52px width, 32px height, proper thumb animation

### 11. **MessagesScreen.tsx - No Swipe Actions**
- **Issue:** List items don't support swipe gestures
- **Severity:** Medium
- **Affected Files:** MessagesScreen.tsx
- **Suggested Fix:** Implement SwipeToDismissBox pattern
- **Actions:** Archive, Delete, Mark as read

### 12. **ComposeScreen.tsx - Toolbar Buttons Lack Labels**
- **Issue:** Icon-only buttons have no accessible labels
- **Severity:** Medium
- **Affected Files:** ComposeScreen.tsx:228-252
- **Suggested Fix:** Add aria-label attributes and tooltips
- **Accessibility:** Critical for screen reader users

### 13. **HomeScreen.tsx - Filter Chips Don't Filter**
- **Issue:** Filter chips are decorative only, non-functional
- **Severity:** Medium
- **Affected Files:** HomeScreen.tsx:126-135
- **Suggested Fix:** Implement actual filtering logic
- **Or:** Remove if not needed for simulator

### 14. **ProfileScreen.tsx - Stats Formatting Inconsistent**
- **Issue:** Numbers not formatted with K/M suffixes
- **Severity:** Medium
- **Affected Files:** ProfileScreen.tsx:169-184
- **Suggested Fix:** Create useFormattedNumber hook
- **Code:**
  ```tsx
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(1) + 'K';
    return num.toString();
  };
  ```

### 15. **All Screens - No Error Boundaries**
- **Issue:** No error handling for component crashes
- **Severity:** Medium
- **Affected Files:** All screens
- **Suggested Fix:** Wrap screens with ErrorBoundary component
- **Implementation:** React Error Boundary pattern

---

## Low Priority Issues

### 16. **AmethystSimulator.tsx - Status Bar Time Static**
- **Issue:** Time always shows "9:41" instead of real time
- **Severity:** Low
- **Affected Files:** AmethystSimulator.tsx:131
- **Suggested Fix:** Use useState + useEffect to show current time
- **Nice-to-have:** Realistic touch

### 17. **HomeScreen.tsx - "You've Reached the End" Not Material**
- **Issue:** End of feed message is plain text
- **Severity:** Low
- **Affected Files:** HomeScreen.tsx:176-178
- **Suggested Fix:** Use Material EmptyState component with icon
- **Material Design:** Illustration + message + optional action

### 18. **MaterialCard.tsx - No Thread Depth Indicator**
- **Issue:** Replies don't show nesting/thread level
- **Severity:** Low
- **Affected Files:** MaterialCard.tsx
- **Suggested Fix:** Add left border or indentation for replies
- **Visual:** Subtle line indicating thread depth

### 19. **SettingsScreen.tsx - Relay Latency Static**
- **Issue:** All relay latencies are hardcoded mock values
- **Severity:** Low
- **Affected Files:** SettingsScreen.tsx:178-179
- **Suggested Fix:** Animate values or add variance for realism
- **Alternative:** Show "Connecting..." initially

### 20. **SearchScreen.tsx - Trending Topics Hardcoded**
- **Issue:** Topics never change, feel static
- **Severity:** Low
- **Affected Files:** SearchScreen.tsx:8-14
- **Suggested Fix:** Rotate through preset arrays or generate random
- **Enhancement:** Add timestamp of last update

### 21. **ComposeScreen.tsx - Privacy Dropdown Not Material**
- **Issue:** Custom dropdown instead of Material Menu
- **Severity:** Low
- **Affected Files:** ComposeScreen.tsx:128-181
- **Suggested Fix:** Use Material 3 DropdownMenu component
- **Placement:** Anchor to button properly

### 22. **All Screens - No Reduced Motion Support**
- **Issue:** Animations don't respect prefers-reduced-motion
- **Severity:** Low
- **Affected Files:** All files using framer-motion
- **Suggested Fix:** Check media query before animating
- **Accessibility:** Important for vestibular disorders

### 23. **NotificationsScreen.tsx - No Time Grouping**
- **Issue:** Notifications list lacks time-based sections
- **Severity:** Low
- **Affected Files:** NotificationsScreen.tsx
- **Suggested Fix:** Add headers: "Today", "Yesterday", "Earlier"
- **Material Design:** Sectioned list with sticky headers

### 24. **ProfileScreen.tsx - Banner Aspect Ratio Fixed**
- **Issue:** Banner has fixed height, doesn't adapt to image
- **Severity:** Low
- **Affected Files:** ProfileScreen.tsx:91-94
- **Suggested Fix:** Use aspect-ratio CSS property
- **Standard:** 3:1 ratio for profile banners

### 25. **FloatingActionButton.tsx - Missing Mini FAB Variant**
- **Issue:** Only standard and extended FAB, no mini size
- **Severity:** Low
- **Affected Files:** FloatingActionButton.tsx
- **Suggested Fix:** Add 'mini' size variant (40x40px)
- **Material Spec:** 40dp for mini, 56dp for standard

---

## Visual Polish Issues

### 26. **Color Inconsistencies**
- **Issue:** Hardcoded colors mixed with CSS variables
- **Files:** Multiple
- **Example:** `text-red-500` instead of `var(--md-error)`
- **Fix:** Audit all color usage, standardize on CSS variables

### 27. **Spacing Inconsistencies**
- **Issue:** Mix of Tailwind classes and custom CSS
- **Files:** All components
- **Example:** Some use `p-4`, others use custom padding
- **Fix:** Standardize on Material Design 8dp grid

### 28. **Typography Hierarchy**
- **Issue:** Font weights and sizes inconsistent
- **Files:** All screens
- **Fix:** Use Material 3 type scale strictly
- **Reference:** https://m3.material.io/styles/typography/type-scale-tokens

### 29. **Elevation Inconsistencies**
- **Issue:** Shadows don't follow Material elevation system
- **Files:** Components with shadows
- **Fix:** Use only --md-shadow-1 through --md-shadow-5
- **Standard:** Cards=1, FAB=3, Modals=4

### 30. **Border Radius Inconsistencies**
- **Issue:** Mix of rounded-lg, rounded-xl, custom values
- **Files:** All components
- **Fix:** Use Material radius tokens
- **Standard:** --md-radius-small (8dp) to --md-radius-extra-large (28dp)

---

## Accessibility Issues

### 31. **Missing ARIA Labels**
- **Severity:** High
- **Files:** All interactive components
- **Fix:** Add aria-label to all icon buttons

### 32. **No Keyboard Navigation**
- **Severity:** High
- **Files:** All screens
- **Fix:** Add tabindex and keyboard handlers

### 33. **No Focus Indicators**
- **Severity:** High
- **Files:** All interactive elements
- **Fix:** Add visible focus rings

### 34. **Color Contrast Issues**
- **Severity:** Medium
- **Files:** Multiple
- **Fix:** Ensure 4.5:1 contrast ratio minimum

---

## Performance Issues

### 35. **No List Virtualization**
- **Issue:** All posts render at once
- **Files:** HomeScreen, ProfileScreen
- **Fix:** Implement virtual scrolling for large lists

### 36. **No Image Lazy Loading**
- **Issue:** All images load immediately
- **Files:** MaterialCard, ProfileScreen
- **Fix:** Add loading="lazy" attribute

### 37. **No Memoization**
- **Issue:** Components re-render unnecessarily
- **Files:** All screens
- **Fix:** Add React.memo, useMemo, useCallback

---

## Summary by Severity

| Severity | Count | Priority |
|----------|-------|----------|
| Critical | 3 | Fix in Phase 2 |
| High | 5 | Fix in Phase 2-3 |
| Medium | 8 | Fix in Phase 3 |
| Low | 13 | Fix in Phase 4 |
| Accessibility | 4 | Fix in Phase 3 |
| Performance | 3 | Fix in Phase 4 |

**Total Issues: 37**
