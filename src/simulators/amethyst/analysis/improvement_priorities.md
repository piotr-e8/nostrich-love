# Amethyst Simulator Improvement Priorities

## Priority Matrix

| Priority | Impact | Effort | Items | Phase |
|----------|--------|--------|-------|-------|
| **P0 - Critical** | High | Low-Med | 6 | Phase 2 |
| **P1 - High** | High | Medium | 8 | Phase 2-3 |
| **P2 - Medium** | Medium | Medium | 12 | Phase 3 |
| **P3 - Low** | Low | High | 15 | Phase 4 |

---

## P0 - Critical (Complete in Phase 2)

### 1. **Fix Critical UI Bugs** 
**Impact:** User Experience | **Effort:** Low | **Time:** 2-3 hours

- Fix LoginScreen validation (Issue #1)
- Fix Tab indicator Material 3 alignment (Issue #2)
- Fix Compose character counter overflow (Issue #3)
- Fix Edit Profile button logic (Issue #5)

**Why Critical:** These bugs break user flow and create confusion. They are quick fixes with high impact.

**Files:**
- LoginScreen.tsx
- HomeScreen.tsx
- ComposeScreen.tsx
- ProfileScreen.tsx

---

### 2. **Add Stories/Highlights Row**
**Impact:** High | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Horizontal scrollable row at top of feed showing active user stories

**Material Components:**
- Carousel
- Avatar with badges
- Progress indicator for story viewing

**Implementation:**
```tsx
// New component: StoriesRow.tsx
interface Story {
  id: string;
  user: User;
  hasStory: boolean;
  isViewed: boolean;
  items: StoryItem[];
}
```

**Why Critical:** Essential social media feature that makes the simulator feel like a real app. High visual impact.

---

### 3. **Complete Pull-to-Refresh**
**Impact:** High | **Effort:** Low | **Time:** 2-3 hours

**Description:** Full pull gesture with visual feedback and loading animation

**Material Components:**
- SwipeRefreshLayout equivalent
- CircularProgressIndicator

**Implementation:**
- Add pull gesture detection
- Show loading indicator
- Animate content refresh

**Why Critical:** Fundamental mobile interaction pattern. Currently incomplete.

---

### 4. **Add Direct Message Chat View**
**Impact:** High | **Effort:** High | **Time:** 6-8 hours

**Description:** Full conversation screen accessible from Messages list

**Material Components:**
- ChatBubble (custom)
- AppBar with back button
- TextField for input
- Send FAB

**Features:**
- Message bubbles (sent/received)
- Timestamps
- Avatar display
- Send message simulation

**Why Critical:** Messages screen currently non-functional. Completing this makes a major feature usable.

---

### 5. **Implement Infinite Scroll**
**Impact:** High | **Effort:** Medium | **Time:** 3-4 hours

**Description:** Load more posts as user scrolls, remove "end of feed" message

**Material Components:**
- InfiniteLoader
- Skeleton screens
- CircularProgressIndicator

**Implementation:**
- Add scroll listener
- Trigger load at 80% scroll
- Show loading indicator
- Append new posts with animation

**Why Critical:** Essential for realistic feed behavior. Current static end is jarring.

---

### 6. **Add Basic Accessibility**
**Impact:** High | **Effort:** Low | **Time:** 2-3 hours

**Description:** ARIA labels, keyboard navigation, focus management

**Implementation:**
- Add aria-label to all icon buttons
- Add role="button" where needed
- Ensure keyboard Tab navigation works
- Add focus-visible styles

**Why Critical:** Accessibility is a requirement, not a feature. Essential for inclusive design.

---

## P1 - High Priority (Complete in Phase 2-3)

### 7. **Add Zap Payment Interface**
**Impact:** High | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Full zap UI with amount selection, message, and confirmation

**Material Components:**
- BottomSheet
- Slider for amount
- TextField for message
- Button variants

**Features:**
- Preset amounts (21, 100, 500, 1000, 5000 sats)
- Custom amount input
- Optional message
- Confirmation animation

**Why High:** Zaps are a core Nostr feature. The simulator should showcase this prominently.

---

### 8. **Add Edit Profile Screen**
**Impact:** High | **Effort:** Medium | **Time:** 4-6 hours

**Description:** Full profile editing form

**Material Components:**
- TextFields (outlined)
- ImagePicker for avatar/banner
- TextArea for bio
- Chips for links
- Save button

**Fields:**
- Display name
- Username/handle
- Bio (160 chars)
- Website URL
- Avatar upload
- Banner upload

**Why High:** Profile management is essential functionality currently missing.

---

### 9. **Add Media Carousel**
**Impact:** Medium-High | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Swipeable image gallery in posts

**Material Components:**
- ViewPager2 equivalent
- Page indicators
- Zoom/pan support

**Features:**
- Swipe between images
- Dot indicators
- Counter (1/4)
- Tap to expand

**Why High:** Improves post viewing experience significantly. Common in social apps.

---

### 10. **Add Long-Press Context Menus**
**Impact:** Medium-High | **Effort:** Medium | **Time:** 3-4 hours

**Description:** Context menus on posts with actions

**Material Components:**
- Menu
- MenuItem
- Divider

**Actions:**
- Copy link
- Share
- Bookmark
- Mute user
- Report
- Translate

**Why High:** Essential power-user feature. Makes simulator feel complete.

---

### 11. **Add Followers/Following Lists**
**Impact:** Medium-High | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Modal lists showing followers and following

**Material Components:**
- ModalBottomSheet
- List with avatars
- Search within list
- Follow/Unfollow buttons

**Why High:** Completes profile functionality. Stats are currently non-interactive.

---

### 12. **Add Thread View**
**Impact:** Medium | **Effort:** High | **Time:** 6-8 hours

**Description:** Full conversation thread with nesting

**Material Components:**
- Tree-like list
- Indentation lines
- Collapse/expand

**Features:**
- Reply indentation
- Thread depth indicator
- Collapse long threads
- Jump to parent

**Why High:** Threads are core to Nostr. Currently missing entirely.

---

### 13. **Add Loading States**
**Impact:** Medium | **Effort:** Low | **Time:** 3-4 hours

**Description:** Skeleton screens and loading indicators

**Material Components:**
- Shimmer
- CircularProgressIndicator
- LinearProgressIndicator

**Locations:**
- Feed loading
- Profile loading
- Search loading
- Image loading

**Why High:** Improves perceived performance and looks more polished.

---

### 14. **Implement Swipe Actions**
**Impact:** Medium | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Swipe to reply/like/delete on list items

**Material Components:**
- SwipeToDismissBox
- Action backgrounds

**Locations:**
- Feed posts
- Messages
- Notifications

**Why High:** Mobile-first interaction pattern. Expected by users.

---

## P2 - Medium Priority (Complete in Phase 3)

### 15. **Add Emoji Picker**
**Impact:** Medium | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Full emoji selection in composer

**Material Components:**
- BottomSheet
- Emoji grid
- Category tabs
- Search

**Why Medium:** Nice-to-have feature for compose. Not critical path.

---

### 16. **Add Search Autocomplete**
**Impact:** Medium | **Effort:** Medium | **Time:** 3-4 hours

**Description:** Suggest completions as user types

**Material Components:**
- DropdownMenu
- List items with avatars

**Why Medium:** Improves search UX significantly but not essential.

---

### 17. **Add Content Filtering**
**Impact:** Medium | **Effort:** Medium | **Time:** 3-4 hours

**Description:** Filter NSFW, keywords, languages

**Material Components:**
- Switch
- Chips
- Dialogs

**Why Medium:** Important for content moderation but simulator content is controlled.

---

### 18. **Add Hashtag Pages**
**Impact:** Medium | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Dedicated pages for trending hashtags

**Material Components:**
- Tabs
- Feed
- Header with stats

**Why Medium:** Improves discoverability but not core functionality.

---

### 19. **Add Poll Support**
**Impact:** Low-Medium | **Effort:** High | **Time:** 6-8 hours

**Description:** Create and vote on polls

**Material Components:**
- RadioButton
- Progress bars
- TextFields

**Why Medium:** Nice feature but not essential for basic simulator.

---

### 20. **Add Bookmark/Saved Posts**
**Impact:** Medium | **Effort:** Low | **Time:** 2-3 hours

**Description:** Save posts for later viewing

**Material Components:**
- IconButton toggle
- Snackbar confirmation
- Saved posts screen

**Why Medium:** Useful feature but can be simulated without persistence.

---

### 21. **Improve NIP-05 Verification**
**Impact:** Medium | **Effort:** Low | **Time:** 2-3 hours

**Description:** Proper NIP-05 verification with actual domain check

**Material Components:**
- Badge with tooltip
- Verification dialog

**Why Medium:** Adds authenticity but mock data already shows verification.

---

### 22. **Add Voice Messages**
**Impact:** Low-Medium | **Effort:** High | **Time:** 6-8 hours

**Description:** Record and send audio messages in chat

**Material Components:**
- Microphone button
- Waveform visualization
- Playback controls

**Why Medium:** Cool feature but not essential for basic messaging.

---

### 23. **Add Notification Filters**
**Impact:** Low-Medium | **Effort:** Low | **Time:** 2-3 hours

**Description:** Filter notifications by type

**Material Components:**
- FilterChips
- Badge counts

**Why Medium:** Nice organization feature but list is manageable without.

---

### 24. **Add Scheduled Posts**
**Impact:** Low | **Effort:** Medium | **Time:** 4-5 hours

**Description:** Schedule posts for future publication

**Material Components:**
- DatePicker
- TimePicker
- Scheduled list

**Why Medium:** Advanced feature not needed for basic simulator.

---

### 25. **Add Key Backup Interface**
**Impact:** High | **Effort:** Medium | **Time:** 3-4 hours

**Description:** Secure key backup with encryption simulation

**Material Components:**
- Dialog
- Password field
- QR code display

**Why Medium:** Important for security but already has basic key generation.

---

### 26. **Add Material Ripple Effects**
**Impact:** Low-Medium | **Effort:** Low | **Time:** 2-3 hours

**Description:** Touch ripple feedback on all interactive elements

**Material Components:**
- Ripple
- Touch feedback

**Why Medium:** Visual polish. Current hover states are adequate.

---

## P3 - Low Priority (Complete in Phase 4)

### 27-41. **Polish & Advanced Features**

- Advanced relay management
- Cross-posting to multiple relays
- Content warnings/NSFW tags
- Translation interface
- Location tagging
- GIF search integration
- Camera capture
- Link previews/unfurling
- Typing indicators
- Message reactions
- Data export
- Navigation rail for tablets
- Dynamic Material You colors
- Speed dial FAB
- Haptic feedback simulation

**Why Low:** These are polish features and advanced functionality that can be added after core features are complete.

---

## Implementation Roadmap

### Phase 2 (Immediate - 2-3 weeks)
1. Fix all P0 critical bugs
2. Add Stories row
3. Complete pull-to-refresh
4. Add Chat view
5. Implement infinite scroll
6. Basic accessibility

**Goal:** Core functionality working, no critical bugs

### Phase 3 (1-2 weeks)
1. P1 high priority features
2. Zap interface
3. Edit profile
4. Media carousel
5. Context menus
6. Followers lists

**Goal:** Feature-complete for simulator purposes

### Phase 4 (Ongoing - 1 week)
1. P2 medium priority
2. P3 low priority
3. Performance optimization
4. Visual polish
5. Advanced features

**Goal:** Production-quality simulator

---

## Effort Summary

| Phase | Hours | Features |
|-------|-------|----------|
| Phase 2 | 25-30 | 6 items (critical) |
| Phase 3 | 35-45 | 8 items (high) |
| Phase 4 | 50-70 | 27 items (med/low) |
| **Total** | **110-145** | **41 items** |

---

## Success Metrics

- **Phase 2 Complete:** All critical bugs fixed, 5 core features added
- **Phase 3 Complete:** 80% of P1 features implemented
- **Phase 4 Complete:** All P2 features, 50% of P3 features

**Definition of Done:**
- [ ] No critical or high bugs
- [ ] All screens functional
- [ ] Material Design 3 compliant
- [ ] Basic accessibility working
- [ ] Tour updated with new features
