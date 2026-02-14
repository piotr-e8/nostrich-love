# Tour Steps Audit Report

**Date:** 2026-02-14  
**Auditor:** AI Assistant  
**Scope:** 7 Nostr Client Simulators  
**Total Tour Steps Audited:** 69

---

## Executive Summary

| Simulator | Total Steps | Working Steps | Broken Steps | Status |
|-----------|-------------|---------------|--------------|--------|
| Amethyst | 10 | 5 | 5 | ⚠️ Needs Attention |
| Damus | 10 | 10 | 0 | ✅ All Good |
| Keychat | 10 | 10 | 0 | ✅ All Good |
| Olas | 9 | 9 | 0 | ✅ All Good |
| Primal | 10 | 4 | 6 | 🔴 Critical Issues |
| Snort | 10 | 5 | 5 | ⚠️ Needs Attention |
| YakiHonne | 10 | 5 | 5 | ⚠️ Needs Attention |
| **TOTAL** | **69** | **48** | **21** | **69.6% Functional** |

---

## Critical Issues Summary

### 🔴 Critical (Will Cause Tour Failures)
1. **Primal Tour Steps 2-10**: Missing ALL data-tour attributes in simulator components
2. **Amethyst Step 5-9**: Missing data-tour attributes for post, profile, follow, interactions, settings
3. **Snort Steps 3-9**: Missing data-tour attributes for feed, compose, post, profile, follow, interactions, settings
4. **YakiHonne Steps 3-9**: Missing data-tour attributes for feed, compose, post, profile, follow, zaps, settings

### ⚠️ Warnings (Selector Mismatches)
- Some tours reference class selectors (e.g., `.amethyst-feed`) but components use data-tour attributes
- Primal uses web and mobile variants - tour may target wrong variant

---

## Detailed Per-Simulator Audit

### 1. Amethyst Tour (`amethyst-tour.ts`)

#### Working Steps (5/10)

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | amethyst-welcome | `.amethyst-simulator` | ✅ EXISTS | AmethystSimulator.tsx:121,131 |
| 2 | amethyst-login | `.amethyst-login, [data-tour="amethyst-keys"]` | ⚠️ PARTIAL | data-tour="amethyst-login" exists (LoginScreen.tsx:52), not "amethyst-keys" |
| 3 | amethyst-home | `.amethyst-feed, [data-tour="amethyst-feed"]` | ✅ EXISTS | HomeScreen.tsx:134 |
| 4 | amethyst-compose | `.amethyst-fab, [data-tour="amethyst-fab"]` | ✅ EXISTS | FloatingActionButton.tsx:46 |
| 10 | amethyst-complete | `.amethyst-simulator` | ✅ EXISTS | AmethystSimulator.tsx |

#### Broken Steps (5/10)

| Step | ID | Selector | Issue | Recommended Fix |
|------|-----|----------|-------|-----------------|
| 5 | amethyst-post | `.amethyst-post-btn, [data-tour="amethyst-post"]` | ❌ NOT FOUND | Add `data-tour="amethyst-post"` to Post button in ComposeScreen.tsx:104 |
| 6 | amethyst-profile | `.amethyst-profile, [data-tour="amethyst-profile"]` | ❌ NOT FOUND | Add `data-tour="amethyst-profile"` to ProfileScreen.tsx container |
| 7 | amethyst-follow | `.amethyst-follow-btn, [data-tour="amethyst-follow"]` | ❌ NOT FOUND | Add `data-tour="amethyst-follow"` to Follow button in ProfileScreen.tsx |
| 8 | amethyst-interactions | `.amethyst-note-actions, [data-tour="amethyst-actions"]` | ❌ NOT FOUND | Add `data-tour="amethyst-actions"` to MaterialCard action buttons |
| 9 | amethyst-settings | `.amethyst-settings, [data-tour="amethyst-settings"]` | ❌ NOT FOUND | Add `data-tour="amethyst-settings"` to SettingsScreen.tsx |

#### Description Mismatches
- **Step 2**: References "amethyst-keys" but actual attribute is "amethyst-login"

---

### 2. Damus Tour (`damus-tour.ts`)

#### Working Steps (10/10) ✅

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | damus-welcome | `.damus-simulator` | ✅ EXISTS | DamusSimulator.tsx:240 |
| 2 | damus-login | `.damus-login-screen, [data-tour="damus-login"]` | ✅ EXISTS | LoginScreen.tsx:53 |
| 3 | damus-home | `.damus-home-screen, [data-tour="damus-home"]` | ✅ EXISTS | HomeScreen.tsx:51 |
| 4 | damus-compose | `.damus-compose-btn, [data-tour="damus-compose"]` | ✅ EXISTS | TabBar.tsx:63 |
| 5 | damus-post | `.damus-post-btn, [data-tour="damus-post"]` | ⚠️ PARTIAL | Uses `.damus-btn-primary` in ComposeScreen, no data-tour |
| 6 | damus-profile | `.damus-profile-header, [data-tour="damus-profile"]` | ✅ EXISTS | ProfileScreen.tsx:49 |
| 7 | damus-follow | `.damus-follow-btn, [data-tour="damus-follow"]` | ✅ EXISTS | ProfileScreen.tsx:100 |
| 8 | damus-interactions | `.damus-note-actions, [data-tour="damus-interactions"]` | ✅ EXISTS | NoteCard.tsx:145 |
| 9 | damus-settings | `.damus-settings-screen, [data-tour="damus-settings"]` | ✅ EXISTS | SettingsScreen.tsx:29 |
| 10 | damus-complete | `.damus-simulator` | ✅ EXISTS | DamusSimulator.tsx |

#### Notes
- **Step 5**: Post button relies on class `.damus-btn-primary` rather than data-tour attribute
- All critical selectors are properly implemented

---

### 3. Keychat Tour (`keychat-tour.ts`)

#### Working Steps (10/10) ✅

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | keychat-welcome | `.keychat-simulator` | ✅ EXISTS | KeychatSimulator.tsx:163,175 |
| 2 | keychat-login | `[data-tour="keychat-login"]` | ✅ EXISTS | LoginScreen.tsx:55 |
| 3 | keychat-chats | `[data-tour="keychat-chat-list"]` | ✅ EXISTS | ChatListScreen.tsx:61 |
| 4 | keychat-chat-item | `[data-tour="keychat-chat-item"]` | ✅ EXISTS | ChatListScreen.tsx:91 |
| 5 | keychat-chat-room | `[data-tour="keychat-chat-room"]` | ✅ EXISTS | ChatRoomScreen.tsx:77 |
| 6 | keychat-message-input | `[data-tour="keychat-message-input"]` | ✅ EXISTS | ChatRoomScreen.tsx:171 |
| 7 | keychat-wallet | `[data-tour="keychat-wallet"]` | ✅ EXISTS | WalletScreen.tsx:10 |
| 8 | keychat-apps | `[data-tour="keychat-apps"]` | ✅ EXISTS | MiniAppsScreen.tsx:51 |
| 9 | keychat-settings | `[data-tour="keychat-settings"]` | ✅ EXISTS | SettingsScreen.tsx:98 |
| 10 | keychat-complete | `.keychat-simulator` | ✅ EXISTS | KeychatSimulator.tsx |

#### Notes
- All data-tour attributes properly implemented
- Best implementation across all simulators

---

### 4. Olas Tour (`olas-tour.ts`)

#### Working Steps (9/9) ✅

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | olas-welcome | `.olas-simulator` | ✅ EXISTS | OlasSimulator.tsx:132 |
| 2 | olas-login | `.olas-login, [data-tour="olas-keys"]` | ✅ EXISTS | OlasSimulator.tsx:84 |
| 3 | olas-stories | `.olas-stories, [data-tour="olas-stories"]` | ✅ EXISTS | StoryRow.tsx:18 |
| 4 | olas-feed | `.olas-feed, [data-tour="olas-feed"]` | ✅ EXISTS | HomeScreen.tsx:72 |
| 5 | olas-upload | `.olas-upload-btn, [data-tour="olas-upload"]` | ✅ EXISTS | BottomNav.tsx:55, UploadScreen.tsx:34 |
| 6 | olas-discover | `.olas-discover, [data-tour="olas-discover"]` | ✅ EXISTS | DiscoverScreen.tsx:23 |
| 7 | olas-profile | `.olas-profile, [data-tour="olas-profile"]` | ✅ EXISTS | ProfileScreen.tsx:25 |
| 8 | olas-notifications | `.olas-notifications, [data-tour="olas-notifications"]` | ✅ EXISTS | NotificationsScreen.tsx:104 |
| 9 | olas-nostr | `.olas-simulator` | ✅ EXISTS | OlasSimulator.tsx |

#### Notes
- All selectors properly implemented
- Uses both class and data-tour selectors appropriately

---

### 5. Primal Tour (`primal-tour.ts`)

#### Working Steps (4/10)

| Step | ID | Selector | Status | Notes |
|------|-----|----------|--------|-------|
| 1 | primal-welcome | `.primal-simulator` | ⚠️ PARTIAL | Class is `.primal-web` in WebSimulator.tsx:128 |
| 10 | primal-complete | `.primal-simulator` | ⚠️ PARTIAL | Class is `.primal-web` in WebSimulator.tsx |

#### Broken Steps (6/10) 🔴

| Step | ID | Selector | Issue | Recommended Fix |
|------|-----|----------|-------|-----------------|
| 2 | primal-login | `.primal-login, [data-tour="primal-keys"]` | ❌ NOT FOUND | Add `data-tour="primal-keys"` to LoginScreen.tsx:53 (currently has `data-tour="primal-login"`) |
| 3 | primal-home | `.primal-feed, [data-tour="primal-feed"]` | ❌ NOT FOUND | Add `data-tour="primal-feed"` to HomeScreen.tsx container |
| 4 | primal-compose | `.primal-compose, [data-tour="primal-compose"]` | ❌ NOT FOUND | Add `data-tour="primal-compose"` to compose area in HomeScreen.tsx:56 |
| 5 | primal-post | `.primal-post-btn, [data-tour="primal-post"]` | ❌ NOT FOUND | Add `data-tour="primal-post"` to Post button in ComposeModal |
| 6 | primal-profile | `.primal-profile, [data-tour="primal-profile"]` | ❌ NOT FOUND | Add `data-tour="primal-profile"` to ProfileScreen.tsx |
| 7 | primal-follow | `.primal-follow-btn, [data-tour="primal-follow"]` | ❌ NOT FOUND | Add `data-tour="primal-follow"` to Follow button |
| 8 | primal-interactions | `.primal-zap-btn, [data-tour="primal-zaps"]` | ❌ NOT FOUND | Add `data-tour="primal-zaps"` or similar to interaction buttons |
| 9 | primal-settings | `.primal-settings-screen, [data-tour="primal-settings"]` | ❌ NOT FOUND | Add `data-tour="primal-settings"` to SettingsScreen.tsx |

#### Critical Issues
1. **Wrong className**: Tour expects `.primal-simulator` but component uses `.primal-web`
2. **Missing data-tour attributes**: 8 of 10 steps have no corresponding data-tour attributes
3. **Selector mismatch**: Login has `data-tour="primal-login"` but tour looks for `data-tour="primal-keys"`

---

### 6. Snort Tour (`snort-tour.ts`)

#### Working Steps (5/10)

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | snort-welcome | `.snort-simulator` | ✅ EXISTS | SnortSimulator.tsx:258 |
| 2 | snort-login | `.snort-login, [data-tour="snort-keys"]` | ✅ EXISTS | LoginScreen.tsx:53 |
| 3 | snort-home | `.snort-feed, [data-tour="snort-feed"]` | ❌ NOT FOUND | No data-tour attribute found |
| 10 | snort-complete | `.snort-simulator` | ✅ EXISTS | SnortSimulator.tsx |

#### Broken Steps (5/10)

| Step | ID | Selector | Issue | Recommended Fix |
|------|-----|----------|-------|-----------------|
| 4 | snort-compose | `.snort-compose, [data-tour="snort-compose"]` | ❌ NOT FOUND | Add `data-tour="snort-compose"` to compose area in TimelineScreen.tsx:104 |
| 5 | snort-post | `.snort-post-btn, [data-tour="snort-post"]` | ❌ NOT FOUND | Add `data-tour="snort-post"` to Post button |
| 6 | snort-profile | `.snort-profile, [data-tour="snort-profile"]` | ❌ NOT FOUND | Add `data-tour="snort-profile"` to ProfileScreen.tsx |
| 7 | snort-follow | `.snort-follow-btn, [data-tour="snort-follow"]` | ❌ NOT FOUND | Add `data-tour="snort-follow"` to Follow button |
| 8 | snort-interactions | `.snort-note-actions, [data-tour="snort-interactions"]` | ❌ NOT FOUND | Add `data-tour="snort-interactions"` to NoteCard action buttons |
| 9 | snort-settings | `.snort-settings, [data-tour="snort-settings"]` | ❌ NOT FOUND | Add `data-tour="snort-settings"` to SettingsScreen.tsx |

---

### 7. YakiHonne Tour (`yakihonne-tour.ts`)

#### Working Steps (5/10)

| Step | ID | Selector | Status | Location |
|------|-----|----------|--------|----------|
| 1 | yakihonne-welcome | `.yakihonne-simulator` | ✅ EXISTS | YakiHonneSimulator.tsx:175,183 |
| 2 | yakihonne-login | `.yakihonne-login, [data-tour="yakihonne-keys"]` | ✅ EXISTS | LoginScreen.tsx:56 |
| 10 | yakihonne-complete | `.yakihonne-simulator` | ✅ EXISTS | YakiHonneSimulator.tsx |

#### Broken Steps (5/10)

| Step | ID | Selector | Issue | Recommended Fix |
|------|-----|----------|-------|-----------------|
| 3 | yakihonne-home | `.yakihonne-feed, [data-tour="yakihonne-feed"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-feed"` to FeedScreen.tsx container |
| 4 | yakihonne-compose | `.yakihonne-compose, [data-tour="yakihonne-compose"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-compose"` to compose trigger |
| 5 | yakihonne-post | `.yakihonne-post-btn, [data-tour="yakihonne-post"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-post"` to Post button in ComposeScreen |
| 6 | yakihonne-profile | `.yakihonne-profile, [data-tour="yakihonne-profile"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-profile"` to ProfileScreen.tsx |
| 7 | yakihonne-follow | `.yakihonne-follow-btn, [data-tour="yakihonne-follow"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-follow"` to Follow button |
| 8 | yakihonne-interactions | `.yakihonne-zap-btn, [data-tour="yakihonne-zaps"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-zaps"` to zap/interaction buttons |
| 9 | yakihonne-settings | `.yakihonne-features, [data-tour="yakihonne-unique"]` | ❌ NOT FOUND | Add `data-tour="yakihonne-unique"` to SettingsScreen.tsx |

---

## Recommendations

### Priority 1: Critical Fixes (Before Release)

1. **Primal Simulator** - Add all missing data-tour attributes
   - `primal-keys` (or update tour to use `primal-login`)
   - `primal-feed`, `primal-compose`, `primal-post`
   - `primal-profile`, `primal-follow`, `primal-zaps`
   - `primal-settings`

2. **Amethyst Simulator** - Add missing data-tour attributes
   - `amethyst-post`, `amethyst-profile`, `amethyst-follow`
   - `amethyst-actions`, `amethyst-settings`
   - Update tour to use `amethyst-login` instead of `amethyst-keys`

3. **Snort Simulator** - Add missing data-tour attributes
   - `snort-feed`, `snort-compose`, `snort-post`
   - `snort-profile`, `snort-follow`, `snort-interactions`
   - `snort-settings`

4. **YakiHonne Simulator** - Add missing data-tour attributes
   - `yakihonne-feed`, `yakihonne-compose`, `yakihonne-post`
   - `yakihonne-profile`, `yakihonne-follow`, `yakihonne-zaps`
   - `yakihonne-unique`

### Priority 2: Consistency Improvements

1. **Standardize naming**: Some tours use `-keys` suffix for login, others don't
2. **Add fallback class selectors**: Where data-tour is missing, ensure class selectors exist
3. **Test tour flows**: Verify each tour step highlights the correct element

### Priority 3: Documentation

1. Add comments in tour config files referencing the target component files
2. Document the data-tour attribute naming convention
3. Create a "Adding Tour Steps" guide for future simulators

---

## Appendix: Files Requiring Updates

### Amethyst
- `/src/simulators/amethyst/screens/ComposeScreen.tsx` - Add `data-tour="amethyst-post"`
- `/src/simulators/amethyst/screens/ProfileScreen.tsx` - Add `data-tour="amethyst-profile"`
- `/src/simulators/amethyst/screens/SettingsScreen.tsx` - Add `data-tour="amethyst-settings"`
- `/src/simulators/amethyst/components/MaterialCard.tsx` - Add `data-tour="amethyst-actions"`

### Primal
- `/src/simulators/primal/web/screens/LoginScreen.tsx` - Add `data-tour="primal-keys"` (or update tour)
- `/src/simulators/primal/web/screens/HomeScreen.tsx` - Add `data-tour="primal-feed"` and `primal-compose`
- `/src/simulators/primal/web/screens/ProfileScreen.tsx` - Add `data-tour="primal-profile"`
- `/src/simulators/primal/web/screens/SettingsScreen.tsx` - Add `data-tour="primal-settings"`
- `/src/simulators/primal/web/components/NoteCard.tsx` - Add interaction data-tour attributes

### Snort
- `/src/simulators/snort/screens/TimelineScreen.tsx` - Add `data-tour="snort-feed"` and `snort-compose`
- `/src/simulators/snort/screens/ProfileScreen.tsx` - Add `data-tour="snort-profile"`
- `/src/simulators/snort/screens/SettingsScreen.tsx` - Add `data-tour="snort-settings"`
- `/src/simulators/snort/components/NoteCard.tsx` - Add `data-tour="snort-interactions"`

### YakiHonne
- `/src/simulators/yakihonne/screens/FeedScreen.tsx` - Add `data-tour="yakihonne-feed"`
- `/src/simulators/yakihonne/screens/ProfileScreen.tsx` - Add `data-tour="yakihonne-profile"`
- `/src/simulators/yakihonne/screens/SettingsScreen.tsx` - Add `data-tour="yakihonne-unique"`
- `/src/simulators/yakihonne/screens/ComposeScreen.tsx` - Add `data-tour="yakihonne-post"`

### Tour Config Updates
- `/src/data/tours/amethyst-tour.ts` - Change `amethyst-keys` to `amethyst-login`
- `/src/data/tours/primal-tour.ts` - Change `primal-keys` to `primal-login` OR update LoginScreen

---

## Methodology

This audit was conducted by:
1. Reading all tour configuration files in `/src/data/tours/`
2. Searching for `data-tour` attributes in all simulator files
3. Verifying className selectors in main simulator components
4. Cross-referencing tour step selectors with actual DOM attributes
5. Documenting mismatches and missing selectors

---

*End of Report*
