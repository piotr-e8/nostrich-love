# Amethyst Branding Assets

## App Icon

![Amethyst Icon](icon.png)

**Source:** https://cdn.satellite.earth/1a4d9d7bb7f3e481aeb5f98b6626b5b4b85d90d59f4d4b00ffa7edbf1c19d6e7.png  
**Resolution:** 512x512px  
**Format:** PNG  
**Background:** Transparent  
**Description:** Stylized amethyst crystal in purple gradient

## Logo Variations

### Primary Logo
- **Type:** Wordmark with icon
- **Colors:** Purple (#673AB7) with white/light text
- **Usage:** App launcher, splash screen, marketing

### Icon Only
- **Shape:** Rounded square (Android adaptive icon)
- **Colors:** Purple gradient
- **Usage:** Notifications, shortcuts, favicon

## Color Palette

### Brand Colors
```css
--amethyst-primary: #673AB7;
--amethyst-primary-dark: #512DA8;
--amethyst-primary-light: #7E57C2;
--amethyst-accent: #E91E63;
```

### Semantic Colors
```css
--color-success: #4CAF50;
--color-warning: #FFC107;
--color-error: #F44336;
--color-info: #2196F3;
```

### Social Action Colors
```css
--color-like: #E91E63;        /* Pink - Heart reactions */
--color-boost: #00BCD4;       /* Cyan - Repost */
--color-zap: #FFD700;         /* Gold - Lightning */
--color-verified: #4CAF50;    /* Green - Checkmark */
```

### Theme Colors

#### Light Theme
```css
--background: #FFFFFF;
--surface: #F5F5F5;
--surface-variant: #E0E0E0;
--text-primary: #212121;
--text-secondary: #757575;
--text-tertiary: #9E9E9E;
--divider: #E0E0E0;
```

#### Dark Theme
```css
--background: #121212;
--surface: #1E1E1E;
--surface-variant: #2C2C2C;
--text-primary: #FFFFFF;
--text-secondary: #B3B3B3;
--text-tertiary: #808080;
--divider: #2C2C2C;
```

## Typography

### Font Family
- **Primary:** System font stack (Roboto on Android)
- **Fallback:** -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif

### Type Scale
```
Headline Large: 32sp / Bold
Headline Medium: 28sp / Bold
Headline Small: 24sp / Bold

Title Large: 22sp / Medium
Title Medium: 16sp / Medium
Title Small: 14sp / Medium

Body Large: 16sp / Regular
Body Medium: 14sp / Regular
Body Small: 12sp / Regular

Label Large: 14sp / Medium
Label Medium: 12sp / Medium
Label Small: 11sp / Medium
```

## Design Principles

1. **Material Design 3:** Follows Material You guidelines
2. **Card-based Layout:** Rounded cards for content containment
3. **Consistent Spacing:** 8dp grid system
4. **Clear Hierarchy:** Visual emphasis on important elements
5. **Accessibility:** WCAG 2.1 AA compliant contrast ratios

## Screenshots

Screenshots are available in the `../screenshots/` directory:

1. **feed.webp** - Main timeline/home feed
2. **profile.webp** - User profile view
3. **notifications.webp** - Activity/notifications

## Resources

- **GitHub:** https://github.com/vitorpamplona/amethyst
- **Website:** https://amethyst.social
- **Play Store:** https://play.google.com/store/apps/details?id=com.vitorpamplona.amethyst
- **Nostr:** npub1gcxzte5zlkncx26j68ez60fzkvtkm9e0vrwdcvsjakxf9mu9qewqlfnj5z

## Usage Guidelines

When creating simulator mockups or designs based on Amethyst:

1. Use the purple (#673AB7) as the primary brand color
2. Maintain rounded corners (8-16dp) for cards and buttons
3. Use outlined icons for actions
4. Follow Material Design elevation guidelines
5. Ensure adequate contrast for accessibility
6. Support both light and dark themes
