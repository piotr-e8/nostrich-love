# Test Scenarios - Nostr Client Simulators

**Last Updated:** 2026-02-11
**Purpose:** Comprehensive test scenarios for end-to-end user flows

---

## Test Scenario Categories

### 1. User Onboarding Flows

#### Scenario 1.1: First-Time User - Damus
**Priority:** High
**Prerequisites:** Simulator loaded at `/simulators/damus`

**Steps:**
1. User lands on Login screen
2. Observe welcome message and demo user options
3. Click "Demo User" button
4. Verify transition to Home screen
5. Verify feed loads with Following tab active
6. Verify user avatar appears in header
7. Verify tab bar is visible with Home, Search, Profile tabs

**Expected Results:**
- Smooth transition with no errors
- Feed displays 20+ notes
- User context properly established
- All navigation elements visible

**Test Data:**
- Mock users: alice, bob, carol, dave, eve
- Mock notes: 25 notes with varied content

---

#### Scenario 1.2: First-Time User - Amethyst
**Priority:** High
**Prerequisites:** Simulator loaded at `/simulators/amethyst`

**Steps:**
1. User lands on Home screen (no login required)
2. Observe Material Design 3 interface
3. Verify bottom navigation with 5 tabs
4. Verify Following/Global tabs at top
5. Verify filter chips below tabs
6. Click through each bottom tab
7. Verify FAB visible only on Home tab

**Expected Results:**
- All tabs switch smoothly
- Content appropriate for each tab
- Animations play correctly
- Theme consistent across screens

---

### 2. Content Interaction Flows

#### Scenario 2.1: Browse Feed and Interact
**Priority:** High
**Applies to:** Damus, Amethyst

**Steps:**
1. Navigate to Home/Feed screen
2. Scroll through posts
3. Click Like button on a post
4. Verify like count updates (visual feedback)
5. Click Repost button
6. Verify repost action logged
7. Click Zap button
8. Verify zap action logged
9. Click Reply button
10. Verify compose screen/modal opens

**Expected Results:**
- All buttons respond to clicks
- Visual feedback on interactions
- Console logs show actions
- No errors in browser console

---

#### Scenario 2.2: Filter Feed Content
**Priority:** Medium
**Applies to:** Damus, Amethyst

**Steps (Damus):**
1. On Home screen, locate Following/Global toggle
2. Click "Global" tab
3. Verify feed content updates
4. Click "Following" tab
5. Verify returns to following feed

**Steps (Amethyst):**
1. On Home screen, click filter chips
2. Click "Bitcoin" chip
3. Verify filter applied (visual state)
4. Click "All" chip
5. Verify returns to unfiltered view

**Expected Results:**
- Tab/chip state visually indicated
- Content filtering simulated
- Smooth transitions between states

---

#### Scenario 2.3: View User Profiles
**Priority:** High
**Applies to:** All simulators

**Steps:**
1. Navigate to feed with posts
2. Click on user avatar or username
3. Verify profile screen opens
4. Verify user info displayed:
   - Avatar
   - Display name
   - Username/NIP-05
   - Bio
   - Stats (followers, following, notes)
5. Click back button
6. Verify returns to previous screen

**Expected Results:**
- Correct user profile displayed
- All user info visible
- Navigation works correctly

**Test Users:**
- alice: Verified NIP-05, bio, 150 followers
- bob: No NIP-05, different bio
- carol: Different stats

---

### 3. Content Creation Flows

#### Scenario 3.1: Create New Post
**Priority:** High
**Applies to:** Damus, Amethyst

**Steps (Damus):**
1. Click compose button in tab bar
2. Verify compose screen opens
3. Type text in input field: "Testing the Damus simulator! #nostr"
4. Verify text appears in input
5. Click "Post" button
6. Verify returns to Home screen
7. Verify new post appears in feed (simulated)

**Steps (Amethyst):**
1. Click FAB on Home screen
2. Verify compose modal slides up
3. Type text: "Testing Amethyst simulator 🎉"
4. Verify character counter updates
5. Click "Post" button
6. Verify toast notification appears
7. Verify modal closes
8. Verify returns to Home

**Expected Results:**
- Compose UI opens correctly
- Text input accepts typing
- Character limit enforced (if applicable)
- Post button submits content
- Success feedback provided

---

#### Scenario 3.2: Cancel Post Creation
**Priority:** Medium
**Applies to:** Damus, Amethyst

**Steps:**
1. Open compose screen/modal
2. Type some text
3. Click Cancel/Close button
4. Verify returns to previous screen
5. Verify no post created

**Expected Results:**
- Cancel works without posting
- Returns to correct previous screen
- No data loss issues

---

### 4. Navigation Flows

#### Scenario 4.1: Tab Navigation
**Priority:** High
**Applies to:** All simulators

**Steps (Amethyst):**
1. Start on Home tab
2. Click Search tab
3. Verify Search screen appears
4. Click Notifications tab
5. Verify Notifications screen appears
6. Click Messages tab
7. Verify Messages screen appears
8. Click Profile tab
9. Verify Profile screen appears
10. Click Home tab
11. Verify returns to Home

**Expected Results:**
- Each tab shows correct content
- Active tab visually indicated
- Animations play on tab switch
- No state loss between tabs

---

#### Scenario 4.2: Deep Navigation - Profile from Various Screens
**Priority:** Medium
**Applies to:** Amethyst

**Steps:**
1. Navigate to Search screen
2. Click on suggested user
3. Verify profile opens
4. Go back to Search
5. Navigate to Notifications
6. Click user from notification
7. Verify profile opens
8. Return to Notifications

**Expected Results:**
- Profile accessible from multiple entry points
- Back navigation works correctly
- Context maintained appropriately

---

### 5. Settings and Preferences

#### Scenario 5.1: Change Theme - Amethyst
**Priority:** Medium
**Applies to:** Amethyst

**Steps:**
1. Open Settings screen
2. Locate Theme section
3. Click "Dark" option
4. Verify UI switches to dark theme
5. Click "Light" option
6. Verify UI switches to light theme
7. Click "Auto" option
8. Verify theme matches system preference

**Expected Results:**
- Theme changes instantly
- All elements styled correctly in both themes
- Selection state visible

---

#### Scenario 5.2: View Settings - Damus
**Priority:** Low
**Applies to:** Damus

**Steps:**
1. Click Settings tab
2. Verify Settings screen opens
3. Verify various settings categories visible:
   - Account
   - Appearance
   - Notifications
   - Relays
4. Click "Logout" button
5. Verify returns to Login screen

**Expected Results:**
- Settings organized logically
- Logout functionality works
- No errors during navigation

---

### 6. Search Functionality

#### Scenario 6.1: Search for Users/Content
**Priority:** Medium
**Applies to:** Amethyst

**Steps:**
1. Navigate to Search tab
2. Click on search input
3. Type "bitcoin"
4. Verify search UI responds
5. Observe trending topics section
6. Observe suggested users section
7. Click on a trending topic
8. Verify simulated search results

**Expected Results:**
- Search input accepts text
- Trending topics displayed
- Suggested users displayed
- Interactive elements functional

---

### 7. Notification Flows

#### Scenario 7.1: View Notifications
**Priority:** Medium
**Applies to:** Amethyst

**Steps:**
1. Navigate to Notifications tab
2. Verify notification list displays
3. Verify different notification types:
   - Like notifications
   - Repost notifications
   - Zap notifications
   - Follow notifications
4. Verify unread badges (if present)
5. Click on a notification
6. Verify simulated action

**Expected Results:**
- Various notification types visible
- Timestamps displayed correctly
- Icons match notification type

---

### 8. Direct Messages

#### Scenario 8.1: View Messages List
**Priority:** Medium
**Applies to:** Amethyst

**Steps:**
1. Navigate to Messages tab
2. Verify conversation list displays
3. Verify for each conversation:
   - User avatar
   - Username
   - Last message preview
   - Timestamp
   - Online indicator (if applicable)
4. Scroll through conversations
5. Click on a conversation
6. Verify simulated DM view (if implemented)

**Expected Results:**
- Conversation list populated
- All metadata visible
- Proper ordering (by recency)

---

### 9. Error Handling and Edge Cases

#### Scenario 9.1: Rapid Navigation
**Priority:** Low
**Applies to:** All simulators

**Steps:**
1. Rapidly click between tabs
2. Rapidly open/close modals
3. Rapidly switch themes

**Expected Results:**
- No crashes
- No UI glitches
- State remains consistent

---

#### Scenario 9.2: Long Text Input
**Priority:** Low
**Applies to:** Damus, Amethyst

**Steps:**
1. Open compose screen
2. Type very long text (1000+ characters)
3. Verify character counter
4. Verify text area handles overflow

**Expected Results:**
- No UI breaking
- Character counter accurate
- Text remains editable

---

#### Scenario 9.3: Empty States
**Priority:** Low
**Applies to:** All simulators

**Steps:**
1. Navigate to sections with potentially empty content
2. Verify empty state UI displays
3. Verify helpful messaging

**Expected Results:**
- Graceful empty states
- User-friendly messaging
- No blank screens

---

## Automated Test Scenarios (Future)

### E2E Tests to Implement

```javascript
// Example Cypress tests to add
describe('Damus Simulator', () => {
  it('completes full user flow', () => {
    cy.visit('/simulators/damus');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="home-screen"]').should('be.visible');
    cy.get('[data-testid="note-card"]').first().find('[data-testid="like-button"]').click();
    cy.get('[data-testid="compose-button"]').click();
    cy.get('[data-testid="compose-input"]').type('Test post');
    cy.get('[data-testid="post-button"]').click();
    cy.get('[data-testid="home-screen"]').should('be.visible');
  });
});
```

---

## Test Data Matrix

| Test User | NIP-05 | Followers | Following | Notes | Verified |
|-----------|--------|-----------|-----------|-------|----------|
| alice | alice@nostr.com | 150 | 89 | 42 | ✅ |
| bob | - | 89 | 45 | 23 | ❌ |
| carol | carol@example.com | 234 | 123 | 67 | ✅ |
| dave | - | 45 | 200 | 12 | ❌ |
| eve | eve@nostr.social | 500 | 50 | 156 | ✅ |

---

## Regression Test Suite

Run these scenarios after any changes:

1. ✅ Login flow works
2. ✅ All tabs accessible
3. ✅ Compose post works
4. ✅ Like/Repost/Zap buttons respond
5. ✅ Profile navigation works
6. ✅ Settings accessible
7. ✅ Theme switching works (Amethyst)
8. ✅ No console errors
9. ✅ Mobile responsive
10. ✅ Animations smooth

---

## Test Environment Requirements

### Browser Matrix
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Screen Sizes
- 320px (small mobile)
- 375px (iPhone)
- 414px (large mobile)
- 768px (tablet)
- 1024px (desktop)
- 1920px (large desktop)

---

## Sign-off Checklist

Before release, verify:

- [ ] All scenarios in this document tested
- [ ] No critical bugs open
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete
- [ ] Documentation updated
