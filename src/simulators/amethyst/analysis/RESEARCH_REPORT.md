# Amethyst UI Research Report

**Repository:** https://github.com/vitorpamplona/amethyst  
**Platform:** Android (Kotlin + Jetpack Compose)  
**Date:** 2025-02-13  
**Researcher:** AI Assistant

---

## Executive Summary

Amethyst is a Nostr client for Android built with Kotlin and Jetpack Compose. It uses Material Design 3 with a distinctive deep purple color scheme. The app features a bottom navigation bar with 5 tabs, pull-to-refresh feeds, stories/horizontal scroll sections, and rich note cards with interactive actions.

---

## 1. Color System

### Primary Palette (Exact Hex Values)

**Light Theme:**
- Primary: `#6750A4` (Deep Purple)
- On Primary: `#FFFFFF`
- Primary Container: `#EADDFF` (Light Lavender)
- On Primary Container: `#21005D`

**Dark Theme:**
- Primary: `#D0BCFF` (Light Purple)
- On Primary: `#381E72`
- Primary Container: `#4F378B` (Deep Purple)
- On Primary Container: `#EADDFF`

### Secondary Palette
- Secondary: `#625B71` (Gray-Purple)
- On Secondary: `#FFFFFF`
- Secondary Container: `#E8DEF8` (Lavender)
- On Secondary Container: `#1D192B`

### Tertiary Palette
- Tertiary: `#7D5260` (Mauve)
- On Tertiary: `#FFFFFF`
- Tertiary Container: `#FFD8E4` (Pink)
- On Tertiary Container: `#31111D`

### Amethyst Brand Colors (Source Code)
```kotlin
val Purple200 = Color(0xFFBB86FC)  // Light purple accent
val Purple500 = Color(0xFF6200EE)  // Deep purple primary
val Purple700 = Color(0xFF3700B3)  // Darker purple
val Teal200 = Color(0xFF03DAC5)    // Teal accent
val BitcoinOrange = Color(0xFFF7931A)  // Bitcoin orange for zaps
val RoyalBlue = Color(0xFF4169E1)  // Royal blue for links
```

### Surface Colors

**Light Theme:**
- Surface: `#FFFBFE` (Almost White)
- Surface Variant: `#E7E0EC` (Light Gray-Purple)
- Background: `#FFFBFE`
- On Surface: `#1C1B1F` (Near Black)
- On Surface Variant: `#49454F` (Dark Gray)

**Dark Theme:**
- Surface: `#1C1B1F` (Dark Gray)
- Surface Variant: `#49454F` (Medium Gray)
- Background: `#1C1B1F`
- On Surface: `#E6E1E5` (Light Gray)
- On Surface Variant: `#CAC4D0` (Medium Light Gray)

### Semantic Colors
- Error: `#B3261E` (Light) / `#F2B8B5` (Dark)
- Warning: `#FFCC00` (Light) / `#F8DE22` (Dark)
- Success: `#339900` (Light) / `#99CC33` (Dark)
- Following: `#03DAC5` (Teal)

---

## 2. Typography System

### Font Family
- Primary: Roboto (system default)
- Monospace: FontFamily.Monospace (for code blocks)

### Type Scale
```kotlin
// Font Sizes
val Font4SP = 4.sp
val Font6SP = 6.sp
val Font8SP = 8.sp
val Font10SP = 10.sp
val Font12SP = 12.sp
val Font14SP = 14.sp  // Standard body small
val Font17SP = 17.sp
val Font18SP = 18.sp

// Display Sizes
Display Large: 57px/64px
Display Medium: 45px/52px
Display Small: 36px/44px
Headline Large: 32px/40px
Headline Medium: 28px/36px
Headline Small: 24px/32px
Title Large: 22px/28px
Title Medium: 16px/24px (weight: 500)
Title Small: 14px/20px (weight: 500)
Body Large: 16px/24px
Body Medium: 14px/20px
Body Small: 12px/16px
Label Large: 14px/20px (weight: 500)
Label Medium: 12px/16px (weight: 500)
Label Small: 11px/16px (weight: 500)
```

### Line Heights
- Default: 1.30em (for markdown content)
- Paragraph Spacing: 18.sp

---

## 3. Spacing & Layout

### Spacing Scale (8dp grid)
```kotlin
val Size0dp = 0.dp
val Size2dp = 2.dp
val Size5dp = 5.dp
val Size6dp = 6.dp
val Size8dp = 8.dp
val Size10dp = 10.dp
val Size12dp = 12.dp
val Size13dp = 13.dp
val Size14dp = 14.dp
val Size15dp = 15.dp
val Size16dp = 16.dp
val Size17dp = 17.dp
val Size18dp = 18.dp
val Size19dp = 19.dp
val Size20dp = 20.dp
val Size22dp = 22.dp
val Size23dp = 23.dp
val Size24dp = 24.dp
val Size25dp = 25.dp
val Size30dp = 30.dp
val Size34dp = 34.dp
val Size35dp = 35.dp  // Standard avatar size
val Size40dp = 40.dp
val Size50dp = 50.dp
val Size55dp = 55.dp  // Large avatar size
val Size75dp = 75.dp  // Profile picture
val Size100dp = 100.dp
val Size110dp = 110.dp
val Size165dp = 165.dp
```

### Padding Values
- Standard horizontal: 10.dp (16px)
- Standard vertical: 10.dp (16px)
- Half padding: 5.dp (8px)
- Large padding: 15.dp (24px)
- Feed padding: top: 10.dp, bottom: 10.dp

---

## 4. Shape & Border Radius

### Border Radius Scale
```kotlin
val SmallestBorder = RoundedCornerShape(5.dp)    // 5px
val SmallBorder = RoundedCornerShape(7.dp)       // 7px
val SmallishBorder = RoundedCornerShape(9.dp)    // 9px
val QuoteBorder = RoundedCornerShape(15.dp)      // 15px (cards)
val ButtonBorder = RoundedCornerShape(20.dp)     // 20px (pill shape)
```

### Component Shapes
- **Cards:** 15dp rounded corners (`QuoteBorder`)
- **Buttons:** 20dp fully rounded (pill shape)
- **Avatars:** CircleShape (100%)
- **Text Fields:** 4dp top corners only
- **Chips:** 8dp rounded
- **FAB:** 16dp rounded (`md-radius-large`)
- **Bottom Nav Items:** Full rounded background (pill shape)

---

## 5. Navigation Structure

### Bottom Navigation (5 Items)
```kotlin
// From AppBottomBar.kt
NavigationBar {
    bottomNavigationItems.forEach { item ->
        NavigationBarItem(
            icon = { NotifiableIcon(...) },
            selected = selected,
            onClick = { nav(bottomNav.route) },
        )
    }
}
```

**Navigation Items:**
1. **Home** - Main feed with tabs
2. **Search** - Discover content
3. **Notifications** - Activity feed
4. **Messages** - Direct messages
5. **Profile** - User profile

### Navigation Routes (From AppNavigation.kt)
- `Route.Home` - Home screen
- `Route.Message` - Messages
- `Route.Video` - Video feed
- `Route.Discover` - Discover/Search
- `Route.Notification` - Notifications
- `Route.Profile` - User profile
- `Route.Settings` - App settings
- `Route.Search` - Search screen
- Plus many more specialized routes...

### Home Screen Tabs
- **New Threads** - Following feed
- **Conversations** - Replies thread view

---

## 6. Component Designs

### Note Card Structure
From analysis of MaterialCard.tsx and NoteCompose:

```
┌─────────────────────────────────────┐
│ [Avatar]  Name      ✓  handle   ⋮  │
│           @nip05...     timestamp  │
├─────────────────────────────────────┤
│ Content text with #hashtags and      │
│ nostr:mentions                       │
├─────────────────────────────────────┤
│ [Image Grid - 1-4 images]           │
├─────────────────────────────────────┤
│ 💬 12  🔄 5  ⚡ 340  ❤️ 89  ⤴️      │
└─────────────────────────────────────┘
```

**Card Specifications:**
- Background: `var(--md-surface)`
- Border Radius: 15dp
- Padding: 16dp (standard)
- Shadow: `md-shadow-1` (elevation 1)
- Hover Shadow: `md-shadow-2` (elevation 2)

### Avatar Sizes
- **Small (stories):** 64px with 3px purple border gradient
- **Standard:** 35dp (40px)
- **Large:** 55dp (profile pictures)
- **Extra Large:** 120dp (profile header)

### Action Buttons
- **Reply:** MessageCircle icon, gray default, purple on hover
- **Repost:** Repeat icon, green when active
- **Zap:** Zap icon, amber/orange when active, shows Bitcoin colors
- **Like:** Heart icon, red when active
- **Share:** Share icon

### Floating Action Button (FAB)
- Size: 56dp × 56dp
- Background: `var(--md-primary-container)`
- Icon: Plus (compose)
- Position: Bottom right, above nav bar
- Shadow: `md-shadow-3`

### Stories/Highlights Row
```
┌──────────────────────────────────────┐
│ [+] [🔴] [🔴] [🔴] [🔴] [🔴]        │
│ Add Alice Bob  Carol Dave  Eve       │
└──────────────────────────────────────┘
```

- Horizontal scrollable
- First item: "Add Story" with dashed border
- Live stories: Red/pink gradient ring with pulse animation
- Regular stories: Purple gradient ring
- Size: 64px avatar + 3px border

---

## 7. Screen Layouts

### Home Screen Layout
```
┌─────────────────────────────────────┐
│ ≡  Amethyst          🔍  🔔(3)     │ ← App Bar (50dp height)
├─────────────────────────────────────┤
│ Following    │    Global           │ ← Tabs (indicator on active)
├─────────────────────────────────────┤
│ [Stories Row - Horizontal Scroll]   │
├─────────────────────────────────────┤
│ [Filter: All Bitcoin Nostr Tech]   │ ← Filter chips
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Note Card 1                 │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Note Card 2                 │   │
│  └─────────────────────────────┘   │
│            ...                      │
│                                     │
├─────────────────────────────────────┤
│ 🏠  🔍  🔔  ✉️  👤                 │ ← Bottom Nav
└─────────────────────────────────────┘
```

### Profile Screen Layout
```
┌─────────────────────────────────────┐
│ ←  User Name        Posts: 42   ⚙️  │
├─────────────────────────────────────┤
│ [Banner Image - 120dp height]       │
├─────────────────────────────────────┤
│ [Avatar]    [Edit Profile] [Share] │
│ Name                                │
│ @handle                             │
│ Bio text here...                    │
│ 📍 Location  🔗 Website  📅 Joined  │
│ 1,234 Following  567 Followers      │
├─────────────────────────────────────┤
│ Posts  Replies  Likes              │ ← Tabs
├─────────────────────────────────────┤
│ [Note cards...]                     │
└─────────────────────────────────────┘
```

---

## 8. Animation Specifications

### Duration Values
```css
--md-duration-short: 150ms;
--md-duration-medium: 300ms;
--md-duration-long: 500ms;
```

### Easing Functions
```css
--md-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
--md-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
```

### Animation Patterns
- **Tab switching:** 200ms fade transition
- **Page navigation:** Spring animation (stiffness: 300, damping: 30)
- **Button press:** Scale 0.9 with spring
- **Card entrance:** Fade in + translate Y 20px, staggered
- **Pull to refresh:** Spring back with spinner rotation
- **Story pulse:** 2s infinite pulse animation

---

## 9. Elevation & Shadows

### Shadow Scale
```css
--md-shadow-0: none;
--md-shadow-1: 0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3);
--md-shadow-2: 0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3);
--md-shadow-3: 0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px 0px rgba(0,0,0,0.3);
--md-shadow-4: 0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px 0px rgba(0,0,0,0.3);
--md-shadow-5: 0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3);
```

### Usage
- Cards: shadow-1 (default), shadow-2 (hover)
- FAB: shadow-3
- Bottom Nav: shadow-2
- App Bar: shadow-2

---

## 10. Key Files & Locations

### Theme Files
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/theme/Color.kt` - Color definitions
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/theme/Theme.kt` - Theme configuration
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/theme/Type.kt` - Typography
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/theme/Shape.kt` - Spacing & Shapes

### Navigation
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/navigation/AppNavigation.kt` - Main nav host
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/navigation/bottombars/AppBottomBar.kt` - Bottom nav

### Screens
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/screen/loggedIn/home/HomeScreen.kt` - Home feed
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/screen/loggedIn/profile/ProfileScreen.kt` - Profile
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/screen/loggedIn/settings/SettingsScreen.kt` - Settings

### Components
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/note/NoteCompose.kt` - Note cards
- `amethyst/src/main/java/com/vitorpamplona/amethyst/ui/components/` - UI components

---

## 11. Unique Features to Highlight

1. **Purple Color Scheme** - Distinctive deep purple brand identity
2. **Stories/Highlights** - Instagram-like stories with live indicators
3. **Zap Actions** - Bitcoin Lightning integration with orange/amber colors
4. **NIP-05 Verification** - Checkmark badges for verified users
5. **Pull-to-Refresh** - Native Android pull gesture with spinner
6. **Live Activities** - Red pulse animation for live streams
7. **Filter Chips** - Material 3 filter chips for content filtering
8. **Bottom Navigation** - Material 3 style with indicator animation
9. **Material You** - Dynamic color support (Android 12+)
10. **Markdown Support** - Rich text rendering with code blocks

---

## 12. Implementation Notes

### Current Simulator Status
The existing simulator at `/Users/piotrczarnoleski/nostr-beginner-guide/src/simulators/amethyst/` already has:
- ✅ Material Design 3 theme system
- ✅ Color tokens (light/dark themes)
- ✅ Bottom navigation with 5 tabs
- ✅ Note cards with actions
- ✅ Home screen with stories
- ✅ Profile screen layout
- ✅ Compose screen
- ✅ Settings screen
- ✅ Pull-to-refresh simulation
- ✅ Tab navigation

### Areas for Improvement
1. **Typography** - Update to match exact Material 3 type scale
2. **Spacing** - Implement exact 8dp grid system
3. **Animations** - Add spring physics and exact easing curves
4. **Components** - Add more Material 3 components (chips, switches, etc.)
5. **Colors** - Verify exact hex values from source code
6. **Navigation** - Add more screen transitions
7. **Icons** - Use exact Material 3 icons

---

## References

- **Repository:** https://github.com/vitorpamplona/amethyst
- **Material Design 3:** https://m3.material.io/
- **Jetpack Compose:** https://developer.android.com/jetpack/compose
- **Nostr Protocol:** https://nostr.com/
