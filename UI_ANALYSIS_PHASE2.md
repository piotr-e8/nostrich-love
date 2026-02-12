# Phase 2: UI/UX Analysis & Recommendations

## Executive Summary

After analyzing screenshots from nostrapps.com for all 7 Nostr clients and comparing them with the current simulator implementations, I've identified several areas where the simulators can be improved to better match the real clients. This document provides detailed recommendations for each client.

## 📊 Screenshot Inventory

All reference screenshots have been downloaded to `/reference/screenshots/`:

| Client | Screenshots | Key Views Captured |
|--------|-------------|-------------------|
| **Damus** | 5 | Home, Feed, Profile, Compose, Settings |
| **Amethyst** | 3 | Feed, Profile, Notifications |
| **Primal** | 6 | Feed, Home, Profile, Notifications, Compose, Wallet |
| **Snort** | 1 | Logo reference only |
| **YakiHonne** | 6 | Home, Discover, Dashboard, Notifications, Widgets, Web Feeds |
| **Coracle** | 2 | Feed, Profile |
| **Gossip** | 4 | Feed, Relays, Profile, Settings |

---

## 🎨 Color Scheme Analysis

### 1. Damus (iOS Client)

**Current Simulator Colors:**
- Primary: `#8B5CF6` (Purple)
- Background: White with iOS-style grays

**Analysis from Screenshots:**
- ✅ Color scheme is accurate - Damus uses purple accent
- ✅ iOS-style light theme matches screenshots
- ⚠️ Needs adjustment: Real Damus has more subtle purple usage
- ⚠️ Tab bar and navigation need refinement to match iOS standards

**Recommendations:**
1. Keep current purple (`#8B5CF6`) - it's accurate
2. Reduce purple intensity in some elements - real app uses it more sparingly
3. Ensure proper iOS safe areas and status bar styling
4. Tab bar icons should be thinner/more iOS-like

---

### 2. Amethyst (Android Client)

**Current Simulator Colors:**
- Uses Material Design 3 with purple primary `#6750A4`
- Background: `#FFFBFE` (very light purple tint)

**Analysis from Screenshots:**
- ⚠️ **Major Issue**: Real Amethyst uses DEEP PURPLE, not Material Design purple
- Real colors are darker and richer
- Background is pure white, not tinted
- Accent color is more vibrant

**Recommendations:**
1. **Change primary color** from `#6750A4` to `#6B21A8` (deep purple)
2. Change background from tinted to pure white `#FFFFFF`
3. Update secondary/accent to match Amethyst's vibrant style
4. Material Design is correct, but colors need adjustment

**Updated Color Palette:**
```css
--amethyst-primary: #6B21A8;        /* Deep purple */
--amethyst-primary-light: #A855F7;   /* Light purple */
--amethyst-background: #FFFFFF;      /* Pure white */
--amethyst-surface: #FFFFFF;
```

---

### 3. Primal (Web & Mobile)

**Current Simulator Colors:**
- Primary: `#7C3AED` (Purple)
- Background: Dark `#0F0F0F`
- Bitcoin orange accents

**Analysis from Screenshots:**
- ⚠️ **Major Issue**: Primary color should be ORANGE, not purple!
- Real Primal uses orange `#F97316` as primary
- Background is dark but screenshots show more varied surfaces
- Wallet and highlights use orange prominently

**Recommendations:**
1. **Change primary color** from purple to `#F97316` (orange)
2. Keep dark background but refine surface colors
3. Ensure orange is used for CTAs, active states, and highlights
4. Update logo display (already done in Phase 1)

**Updated Color Palette:**
```css
--primal-primary: #F97316;           /* Orange */
--primal-primary-hover: #EA580C;     /* Darker orange */
--primal-primary-light: #FB923C;     /* Light orange */
--primal-bitcoin: #F7931A;           /* Bitcoin orange */
```

---

### 4. Snort (Web Client)

**Current Simulator Colors:**
- Accent: `#14B8A6` (Teal)
- Background: Dark slate `#0f172a`

**Analysis:**
- ⚠️ Only logo screenshot available from nostrapps.com
- Need to check snort.social for more reference
- Current teal color seems reasonable
- Dark theme is appropriate

**Recommendations:**
1. Visit snort.social to get more screenshots
2. Verify teal is the correct accent color
3. Ensure layout matches the three-column design seen in logo

---

### 5. YakiHonne (Mobile-First)

**Current Simulator Colors:**
- Primary: `#F7931A` (Bitcoin Orange)
- Background: White

**Analysis from Screenshots:**
- ✅ Color scheme is accurate - uses Bitcoin orange
- ✅ Clean white background matches screenshots
- ⚠️ Logo SVG has purple tones - need to verify actual colors
- ⚠️ Screenshots show more complex layouts with multiple content types

**Recommendations:**
1. Keep Bitcoin orange `#F7931A` - it's correct
2. Add support for multiple content types (articles, media, widgets)
3. Implement dashboard view seen in screenshots
4. Consider the purple from logo for specific accents

---

### 6. Coracle (Web Client)

**Current Simulator Colors:**
- Primary: `#6366F1` (Indigo)
- Background: White/light grays

**Analysis from Screenshots:**
- ✅ Indigo color is accurate
- ✅ Light, accessible design matches screenshots
- ⚠️ Real app has cleaner, more minimal layout
- ⚠️ High contrast accessibility features are prominent

**Recommendations:**
1. Keep indigo `#6366F1` - it's correct
2. Ensure high contrast ratios (already good)
3. Simplify layout to match Coracle's minimal approach
4. Focus on accessibility features

---

### 7. Gossip (Desktop Client)

**Current Simulator Colors:**
- Primary: `#22C55E` (Green)
- Background: Very dark `#0F0F0F`

**Analysis from Screenshots:**
- ✅ Green accent is correct
- ✅ Dark sidebar design matches screenshots
- ⚠️ Real app has black/white logo, not green
- ⚠️ Screenshots show native desktop app styling, not web

**Recommendations:**
1. Keep green `#22C55E` - it's correct
2. Emphasize desktop-native feel (keyboard shortcuts, dense layout)
3. Note that real Gossip is a native app (Rust), not web-based
4. Ensure relay management UI matches screenshots

---

## 📱 Layout & UI Component Differences

### Critical Updates Needed

#### Primal - **HIGH PRIORITY**
- **Issue**: Currently uses purple theme, should be orange
- **Impact**: Major brand misalignment
- **Action**: Update CSS variables in `primal-web.theme.css`

#### Amethyst - **HIGH PRIORITY**  
- **Issue**: Colors are too light/Material-generic
- **Impact**: Doesn't look like real Amethyst
- **Action**: Darken purples, remove background tint

### Minor Adjustments Needed

#### Damus
- Refine iOS-specific styling
- Adjust purple usage intensity

#### YakiHonne
- Add more content type support
- Implement dashboard layout

#### Snort
- Need more reference screenshots
- Verify current design is accurate

#### Coracle
- Already close to accurate
- Focus on accessibility

#### Gossip
- Already close to accurate
- Emphasize desktop features

---

## 🎯 Priority Action Items

### Immediate (This Week)

1. **Primal Theme Update**
   - File: `/src/simulators/primal/web/primal-web.theme.css`
   - Change all purple references to orange `#F97316`
   - Update hover states and accents

2. **Amethyst Theme Update**
   - File: `/src/simulators/amethyst/amethyst.theme.css`
   - Change primary from `#6750A4` to `#6B21A8`
   - Change background to pure white
   - Update Material Design tokens

### Next (Next Week)

3. **Component Layout Review**
   - Compare actual screen layouts with simulators
   - Adjust spacing, typography, and components
   - Update based on screenshot analysis

4. **Snort Research**
   - Get more screenshots from snort.social
   - Verify current design accuracy
   - Make adjustments if needed

### Future Considerations

5. **Advanced Features**
   - Add wallet components (Primal, YakiHonne)
   - Implement relay management (Gossip)
   - Add content type variations (YakiHonne)

---

## 📁 Files Modified

### Phase 1 (Completed)
- `/public/icons/` - Added official logos for all 7 clients
- `/src/simulators/shared/configs.ts` - Updated YakiHonne icon path

### Phase 2 (Current)
- `/reference/screenshots/` - Added 29 reference screenshots
- `/src/simulators/primal/web/primal-web.theme.css` - **Needs update**
- `/src/simulators/amethyst/amethyst.theme.css` - **Needs update**
- This analysis document

---

## ✅ Success Criteria

Phase 2 is complete when:
- [ ] Primal uses orange theme (not purple)
- [ ] Amethyst uses deep purple (not Material purple)
- [ ] All clients pass visual comparison with screenshots
- [ ] Color schemes match official brand colors
- [ ] Layouts are within 90% accuracy of real clients

---

## 📝 Notes

- All screenshots are stored in `/reference/screenshots/` for ongoing reference
- Official logos from Phase 1 are in `/public/icons/`
- The nostrapps.com screenshots provide excellent reference material
- Some clients (Snort) need additional research for complete accuracy

**Last Updated:** February 12, 2026
**Status:** Analysis Complete, Implementation In Progress
