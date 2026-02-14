# Olas Simulator - Design Specification

## Overview
**Client:** Olas - Photo & Video Sharing Nostr Client
**Platform:** Mobile-first (Android/iOS)
**Design Philosophy:** Instagram-inspired, media-first, clean and visual

## Color Palette

### Primary Colors
- **Primary:** `#FF6B6B` (Coral Red)
- **Primary Dark:** `#E85555` (Dark Coral)
- **Primary Light:** `#FF8E8E` (Light Coral)

### Secondary Colors
- **Secondary:** `#4ECDC4` (Teal - complementary accent)
- **Secondary Light:** `#6EDDD6` (Light Teal)

### Background Colors
- **Background:** `#FFFFFF` (White)
- **Surface:** `#FAFAFA` (Off-white)
- **Card Background:** `#FFFFFF` (White with subtle shadow)

### Text Colors
- **Text Primary:** `#1A1A1A` (Near Black)
- **Text Secondary:** `#666666` (Dark Gray)
- **Text Muted:** `#999999` (Medium Gray)
- **Text Inverse:** `#FFFFFF` (White)

### Border & Divider
- **Border Light:** `#E5E5E5` (Light Gray)
- **Divider:** `#F0F0F0` (Very Light Gray)

### Status Colors
- **Success:** `#22C55E` (Green)
- **Warning:** `#F59E0B` (Amber)
- **Error:** `#EF4444` (Red)
- **Info:** `#3B82F6` (Blue)

### Dark Mode (Optional)
- **Dark Background:** `#0F0F0F` (Near Black)
- **Dark Surface:** `#1A1A1A` (Dark Gray)
- **Dark Card:** `#262626` (Medium Dark)

## Typography

### Font Stack
- **Primary:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Monospace:** 'SF Mono', Monaco, monospace (for NIP-05, IDs)

### Text Hierarchy
- **H1 (Screen Title):** 24px, Bold (700), Line-height 1.2
- **H2 (Section Title):** 20px, Semi-bold (600), Line-height 1.3
- **H3 (Card Title):** 16px, Semi-bold (600), Line-height 1.4
- **Body Large:** 16px, Regular (400), Line-height 1.5
- **Body:** 14px, Regular (400), Line-height 1.5
- **Caption:** 12px, Regular (400), Line-height 1.4
- **Small:** 11px, Regular (400), Line-height 1.3

## Layout Structure

### Screen Dimensions (Mobile Frame)
- **Width:** 375px (iPhone SE base)
- **Height:** 812px (iPhone X base)
- **Safe Area Top:** 44px
- **Safe Area Bottom:** 34px
- **Content Width:** 375px - 32px padding = 343px

### Grid System
- **Photo Grid:** 3 columns
- **Gap:** 2px between photos
- **Aspect Ratio:** 1:1 (square photos)

### Spacing Scale
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px

### Border Radius
- **Small:** 4px (buttons, inputs)
- **Medium:** 8px (cards, modals)
- **Large:** 12px (images, large cards)
- **Round:** 50% (avatars, profile pictures)
- **Pill:** 9999px (chips, tags)

## Components

### 1. Bottom Navigation Bar
**Position:** Fixed bottom
**Height:** 56px + safe area
**Background:** White with top border
**Border:** 1px solid #E5E5E5

**Tabs (5 items):**
1. Home (Grid icon) - Photos feed
2. Discover (Compass icon) - Explore
3. Upload (Plus circle - highlighted, larger)
4. Notifications (Heart icon)
5. Profile (User icon)

**Active State:**
- Icon color: Primary coral (#FF6B6B)
- Slight scale up (1.1x)

**Upload Button (Center):**
- Size: 56px diameter
- Background: Primary gradient
- Icon: Plus, white
- Shadow: 0 4px 12px rgba(255, 107, 107, 0.4)

### 2. Photo Grid
**Layout:** 3-column CSS Grid
**Gap:** 2px
**Item Aspect Ratio:** 1:1

**Photo Cell:**
- Background: #F0F0F0 (loading state)
- Object-fit: cover
- Tap to view full screen

**Video Indicator:**
- Position: Bottom-right corner
- Icon: Play triangle
- Size: 20px
- Background: Semi-transparent black circle

### 3. Stories/Highlights Row
**Position:** Top of feed, below header
**Height:** 90px
**Background:** White
**Scroll:** Horizontal scroll, snap to items

**Story Item:**
- Avatar size: 64px
- Ring: Gradient border (coral to pink) when unviewed
- Ring: Gray when viewed
- Username: Below avatar, 12px text

### 4. Media Card (Feed View)
**Structure:**
- Header: Avatar (32px) + Username + Timestamp
- Media: Full width, aspect-ratio 4:5 (portrait)
- Action Bar: Heart, Comment, Share, Bookmark icons
- Engagement: Like count, caption, comments
- Timestamp: Relative time (2h, 1d)

**Header:**
- Padding: 12px 16px
- Avatar: 32px round
- Username: Bold, 14px
- More button: Right aligned (3 dots)

**Action Bar:**
- Height: 48px
- Icons: 24px size
- Spacing: 16px between icons
- Bookmark: Right aligned

**Like/Action Icons:**
- Heart: Outline → Filled when liked (coral color)
- Comment: Outline only
- Share: Paper plane icon
- Bookmark: Outline → Filled when saved

### 5. Upload/Compose Screen
**Type:** Full screen modal
**Background:** Black (camera-first UI)

**Camera View:**
- Full screen preview
- Capture button: 72px white circle with coral ring
- Bottom options: Gallery, Photo, Video toggle

**Caption Input:**
- Bottom sheet style
- Text area with placeholder
- Keyboard aware

### 6. Profile Header
**Structure:**
- Avatar: 96px, centered
- Username: Below avatar, 20px bold
- NIP-05: Below username, 14px secondary color
- Stats Row: Posts | Followers | Following
- Action Buttons: Edit Profile / Follow

**Stats:**
- Layout: 3 columns, evenly spaced
- Numbers: 18px bold
- Labels: 12px secondary

### 7. Notifications
**Types:**
- Like: Heart icon + user + "liked your photo"
- Follow: User icon + user + "started following you"
- Comment: Bubble icon + user + "commented: ..."
- Mention: @ icon + user + "mentioned you"

**Item:**
- Avatar: 44px left
- Content: Middle
- Preview: 44px thumbnail right (if applicable)

## Screen Specifications

### Screen 1: Home Feed
**Layout:**
- Status bar: 44px (system)
- Stories row: 90px
- Photo feed: Remaining height - bottom nav
- Bottom nav: 56px + safe area

**Interactions:**
- Pull to refresh
- Infinite scroll
- Double tap to like
- Long press to zoom

### Screen 2: Discover/Explore
**Layout:**
- Search bar at top
- Category chips below (horizontal scroll)
- Photo grid (3 columns)
- Explore suggestions

**Content:**
- Trending hashtags
- Featured creators
- Popular media

### Screen 3: Upload Flow
**Steps:**
1. Camera/Gallery picker
2. Filter/edit (optional)
3. Caption input
4. Post

### Screen 4: Profile
**Sections:**
1. Profile header (avatar, name, stats)
2. Bio/description
3. Tab switcher: Grid | Saved
4. Photo grid

### Screen 5: Notifications
**Layout:**
- Grouped by day
- Follow requests at top (if any)
- Activity feed below

## Animation & Interactions

### Transitions
- **Screen transitions:** 300ms ease-out
- **Modal open:** 250ms slide up
- **Modal close:** 200ms slide down

### Micro-interactions
- **Like:** Scale 1.2 → 1.0 with bounce, fill color
- **Tab switch:** 150ms opacity/color fade
- **Pull to refresh:** Standard iOS spinner, coral color
- **Photo tap:** Fade to full screen viewer
- **Button press:** Scale 0.95 on tap

### Loading States
- **Photo grid:** Skeleton blocks, pulse animation
- **Image load:** Blur placeholder → sharp image
- **Upload progress:** Linear progress bar, coral

## Tour Flow (Onboarding Steps)

### Step 1: Welcome
- "Welcome to Olas"
- "The photo-first Nostr client"
- Show logo, brief description

### Step 2: Home Feed
- "Browse photos from people you follow"
- "Double tap to like, tap to view"
- Highlight: Photo grid area

### Step 3: Stories
- "View stories from friends"
- "Tap to watch, swipe to skip"
- Highlight: Stories row

### Step 4: Upload
- "Share your moments"
- "Tap the + button to post photos"
- Highlight: Center upload button

### Step 5: Discover
- "Explore the Nostr network"
- "Find trending photos and creators"
- Highlight: Discover tab

### Step 6: Profile
- "Your photo gallery"
- "All your posts in one place"
- Highlight: Profile tab

### Step 7: Nostr Features
- "Powered by Nostr"
- "Own your content, censorship resistant"
- Show: Zaps, relays mention

## CSS Custom Properties

```css
:root {
  /* Colors */
  --olas-primary: #FF6B6B;
  --olas-primary-dark: #E85555;
  --olas-primary-light: #FF8E8E;
  --olas-secondary: #4ECDC4;
  --olas-background: #FFFFFF;
  --olas-surface: #FAFAFA;
  --olas-text-primary: #1A1A1A;
  --olas-text-secondary: #666666;
  --olas-text-muted: #999999;
  --olas-border: #E5E5E5;
  
  /* Spacing */
  --olas-space-xs: 4px;
  --olas-space-sm: 8px;
  --olas-space-md: 16px;
  --olas-space-lg: 24px;
  --olas-space-xl: 32px;
  
  /* Border Radius */
  --olas-radius-sm: 4px;
  --olas-radius-md: 8px;
  --olas-radius-lg: 12px;
  --olas-radius-round: 50%;
  --olas-radius-pill: 9999px;
  
  /* Shadows */
  --olas-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --olas-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --olas-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --olas-shadow-primary: 0 4px 12px rgba(255, 107, 107, 0.4);
  
  /* Animation */
  --olas-transition-fast: 150ms ease;
  --olas-transition-normal: 250ms ease;
  --olas-transition-slow: 350ms ease;
}
```

## Responsive Considerations

While primarily mobile-focused, the design should scale:
- Tablet: 4-column grid, larger touch targets
- Desktop: Centered mobile view or responsive grid
- Maintain touch-friendly sizes (min 44px tap targets)

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: Visible coral outline
- Touch targets: Min 44x44px
- Alt text: Support for photo descriptions
- Reduced motion: Respect prefers-reduced-motion

---

## Design Approval Required

Please review this design specification. Once approved, we'll proceed to:
1. Create Astro page structure
2. Build React components
3. Implement interactive tour
4. Integrate into system

**Awaiting approval to proceed to Phase 3: Implementation**
