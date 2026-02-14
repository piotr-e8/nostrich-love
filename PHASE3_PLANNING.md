# Phase 3 Planning Document

## Context: Where We Are

This document builds upon previous phases to plan Phase 3 development.

**Previous Documents:**
- `NOSTRICH_ANALYSIS_REPORT.md` - Strategic analysis and recommendations
- `PHASE1_COMPLETE.md` - Homepage redesign, 3-path system, theme updates
- `PHASE2_IMPLEMENTATION.md` - Gamification, community pages, Twitter Bridge
- `PHASE2_TESTING_REPORT.md` - QA verification of Phase 2
- `PROJECT_SUMMARY.md` (new) - Bug fixes and improvements from this session

**Current State (Post-Session):**
- Phase 1: ✅ Complete (homepage, paths, themes)
- Phase 2: ✅ Complete (gamification, community pages, Twitter Bridge)
- Session Fixes: ✅ Complete (API integration, dark mode, UI fixes)

---

## Phase 3 Scope

### Primary Goal
Enhance user engagement and prepare for production launch with real-time features and content improvements.

### Success Metrics
- User retention after 7 days: 40%+
- Guide completion rate: 55%+
- Social proof integration working
- Real-time features functional

---

## Phase 3 Features (Priority Order)

### 🔴 CRITICAL (Week 1)

#### 1. Real Activity Data Integration
**Current State:** Activity feed uses simulated data (35 pre-written messages)
**Goal:** Connect to actual Nostr relays for live activity

**Implementation:**
- Connect to public relays (wss://relay.damus.io, wss://nos.lol)
- Subscribe to kind:1 (notes) and kind:6 (reposts) events
- Filter for relevant hashtags (#nostr, #introduction)
- Display real user activity in ActivityFeed component
- Update every 30 seconds with new events
- Fallback to simulated data if relays unavailable

**Files to Modify:**
- `src/components/activity/ActivityFeed.tsx`
- Create: `src/utils/nostrRelays.ts`
- Create: `src/hooks/useRealtimeActivity.ts`

**Acceptance Criteria:**
- [ ] Shows real posts from Nostr users
- [ ] Updates automatically
- [ ] Handles relay connection failures gracefully
- [ ] Privacy-compliant (no private data)

---

#### 2. Content Creator Curation
**Current State:** Community pages use placeholder/mock creators
**Goal:** Replace with real, verified Nostr creators

**Implementation:**
- Research and identify active creators in each category:
  - Artists: 5 verified artists with Nostr presence
  - Photographers: 5 verified photographers
  - Musicians: 5 verified musicians
  - Parents: 5 parenting content creators
  - Foodies: 5 food/cooking creators
  - Books: 5 book reviewers/authors
- Update FeaturedCreator components with real:
  - Names and handles
  - Profile pictures (npub avatars)
  - Actual sample posts
  - Npubs for follow packs
- Add verification badges for confirmed creators

**Files to Modify:**
- All 6 `nostr-for-*.astro` pages
- `src/components/community/FeaturedCreator.astro`
- Create: `src/data/verifiedCreators.ts`

**Acceptance Criteria:**
- [ ] All creators are real Nostr users
- [ ] Profile data loads from Nostr (not hardcoded)
- [ ] Follow packs contain real npubs
- [ ] Sample posts are actual posts

---

### 🟡 HIGH PRIORITY (Week 2)

#### 3. Badge Graphics Enhancement
**Current State:** Badges use emoji placeholders (🔑 📝 ⚡)
**Goal:** Professional SVG badge designs

**Implementation:**
- Design 8 unique SVG badges:
  1. Key Master (key icon)
  2. First Post (pencil/paper)
  3. Zap Receiver (lightning bolt)
  4. Community Builder (hands shaking)
  5. Knowledge Seeker (books/scroll)
  6. Nostr Graduate (graduation cap)
  7. Security Conscious (shield/lock)
  8. Relay Explorer (globe/network)
- Each badge should have:
  - Locked state (grayscale/outline)
  - Unlocked state (colorful/detailed)
  - Animation on unlock
- Replace emoji with SVG in BadgeDisplay component
- Ensure badges look good at 64px, 128px, 256px

**Files to Modify:**
- `src/components/gamification/BadgeDisplay.tsx`
- Create: `src/components/gamification/BadgeSVG.tsx`
- Create: `public/badges/*.svg` (8 SVG files)

**Acceptance Criteria:**
- [ ] All 8 badges have unique SVG designs
- [ ] Locked/unlocked states visually distinct
- [ ] Animations work on unlock
- [ ] Responsive sizes work

---

#### 4. Onboarding Wizard Enhancement
**Current State:** "Start Here" badge guides users, but no wizard
**Goal:** Step-by-step first-time user experience

**Implementation:**
- Create multi-step wizard for first-time visitors:
  - Step 1: "Welcome to Nostr" - What is Nostr (30s video/embed)
  - Step 2: "Choose Your Path" - General/Bitcoiner/Privacy selector
  - Step 3: "Set Your Goal" - What do you want to do? (post, browse, earn)
  - Step 4: "First Guide Recommendation" - Suggest starting guide
  - Step 5: "Bookmark Progress" - Explain progress tracking
- Show wizard only on first visit (localStorage flag)
- Add "Replay Wizard" option in settings
- Make it skippable with "Skip for now" button

**Files to Modify:**
- Create: `src/components/onboarding/OnboardingWizard.tsx`
- Create: `src/components/onboarding/OnboardingStep.tsx`
- `src/pages/index.astro`
- `src/pages/settings.astro`

**Acceptance Criteria:**
- [ ] Wizard appears on first visit
- [ ] Can be skipped
- [ ] 5 steps total
- [ ] Stores completion in localStorage
- [ ] Progress indicator shows step number

---

### 🟢 MEDIUM PRIORITY (Week 3-4)

#### 5. Mobile App / PWA
**Current State:** Website works on mobile but not installable
**Goal:** Progressive Web App with offline support

**Implementation:**
- Create `manifest.json` with app metadata
- Add service worker for offline caching:
  - Cache guides content
  - Cache static assets
  - Offline fallback page
- Add "Add to Home Screen" prompt
- Optimize for mobile touch targets
- Test on iOS Safari and Android Chrome

**Files to Create:**
- `public/manifest.json`
- `public/sw.js` (service worker)
- `src/components/PWAInstallPrompt.tsx`

**Acceptance Criteria:**
- [ ] Can be installed as PWA
- [ ] Works offline (cached content)
- [ ] Passes Lighthouse PWA audit
- [ ] Splash screen on launch

---

#### 6. Analytics & Insights
**Current State:** No usage tracking
**Goal:** Understand user behavior without compromising privacy

**Implementation:**
- Implement privacy-focused analytics:
  - Plausible Analytics (GDPR-compliant, no cookies)
  - OR self-hosted Matomo
- Track events:
  - Guide completion
  - Path selection
  - Badge earnings
  - Twitter Bridge usage
  - Time on site
- Create dashboard for viewing:
  - Most popular guides
  - Drop-off points in flow
  - Path distribution (General/Bitcoiner/Privacy)
  - Badge completion rates
- Make analytics optional (respect DNT header)

**Files to Modify:**
- `src/layouts/Layout.astro` (add analytics script)
- Create: `src/utils/analytics.ts`
- Create: `src/pages/admin/analytics.astro` (internal dashboard)

**Acceptance Criteria:**
- [ ] Analytics respect user privacy
- [ ] Events tracked correctly
- [ ] Dashboard shows useful insights
- [ ] No PII collected

---

## Technical Debt to Address

### From Current Session
1. **TypeScript Warnings** - Clean up unused imports
2. **Content Collections** - Define explicit schemas for faq/tools
3. **Test Coverage** - Add unit tests for:
   - Gamification logic
   - Progress calculation
   - API error handling

### From Phase 2
1. **Nutzaps Integration** - Reward badges with NIP-61 nutzaps (mentioned in Phase 2 doc)
2. **Real NIP-58 Badge Publishing** - Currently mocked, implement actual badge publishing
3. **Follow Pack Enhancement** - Real-time updates when following

---

## Resources Needed

### For Real Activity Feed
- Nostr relay connections (free public relays available)
- Event filtering logic
- Rate limiting to avoid overwhelming relays

### For Creator Curation
- Research time to find verified creators (6 categories × 5 creators = 30 profiles)
- Permission from creators to feature them
- Automated profile fetching from Nostr

### For Badge Graphics
- Designer or AI tool for SVG creation
- 8 unique badge designs
- Animation implementation (Lottie or CSS)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Relays unreliable | Activity feed breaks | Fallback to simulated data |
| Creators don't respond | Placeholder data remains | Contact multiple creators per category |
| PWA certification fails | Can't install on mobile | Test early and often on real devices |
| Analytics privacy concerns | User trust loss | Use privacy-first analytics, be transparent |

---

## Definition of Done

Phase 3 is complete when:
- [ ] Real activity feed is working with at least 2 relays
- [ ] All 6 community pages feature real creators
- [ ] 8 SVG badge designs implemented
- [ ] Onboarding wizard guides first-time users
- [ ] PWA can be installed on mobile
- [ ] Analytics dashboard shows user insights
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Performance budget met (< 3s first contentful paint)

---

## Handoff Notes for Next Session

**If starting Phase 3:**
1. Read this document
2. Review PROJECT_SUMMARY.md for current state
3. Start with CRITICAL features (Real Activity Feed)
4. Reference existing patterns from Phases 1-2

**Known Working State:**
- All Phase 1 & 2 features functional
- Build passes with 0 errors
- Dark mode works across site
- Gamification system working
- Twitter Bridge functional

**Blockers to Watch:**
- Nostr relay availability
- Creator permission acquisition
- PWA testing on actual devices

---

**Document Version**: 1.0  
**Last Updated**: February 13, 2026  
**Status**: Ready for Implementation
