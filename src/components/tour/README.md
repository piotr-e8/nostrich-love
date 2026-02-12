/**
 * Guided Tour System README
 * 
 * A reusable, interactive tour system for all 5 Nostr client simulators
 * (Damus, Amethyst, Primal, Snort, YakiHonne)
 */

## Quick Start

### 1. Wrap Your Simulator with TourProvider

```tsx
import { TourProvider, TourOverlay } from '@/components/tour';
import { damusTourConfig } from '@/data/tours';

function DamusSimulator() {
  return (
    <TourProvider>
      {/* Your simulator content */}
      <TourOverlay />
    </TourProvider>
  );
}
```

### 2. Import the CSS

In your global CSS or component:

```tsx
import '@/components/tour/tour.css';
```

### 3. Use the Simple Wrapper (Recommended)

```tsx
import { TourWrapper, TourButton } from '@/components/tour';
import { damusTourConfig } from '@/data/tours';

function DamusSimulator() {
  return (
    <TourWrapper tourConfig={damusTourConfig} autoStart={true}>
      {/* Your simulator content */}
      <TourButton tourConfig={damusTourConfig} />
    </TourWrapper>
  );
}
```

## Features

✅ **Spotlight Effect** - Highlights UI elements with animated borders  
✅ **Auto-positioning Tooltips** - Smart positioning with viewport detection  
✅ **Progress Persistence** - Saves progress to localStorage  
✅ **Keyboard Navigation** - Arrow keys, Enter, Escape  
✅ **Mobile Responsive** - Adapts to smaller screens  
✅ **Step Progress** - Visual progress bar and step indicators  
✅ **Skip/Restart** - User control over the tour experience  
✅ **Dark Mode** - Automatic dark mode support  
✅ **Accessibility** - ARIA labels and keyboard support  

## Tour Steps Structure

Each tour has 9-10 steps:

1. **Welcome** - Introduction to the client
2. **Keys** - Security and key management
3. **Feed** - Timeline/home screen
4. **Compose** - Creating posts
5. **Interactions** - Like, reply, repost, zap
6. **Profile** - User profiles and following
7. **Discovery** - Finding users/communities
8. **Relays** - Relay management
9. **Settings** - Configuration
10. **Complete** - Summary and next steps

## Custom Tours

Create custom tours by following the TourConfig interface:

```tsx
const customTour: TourConfig = {
  id: 'my-tour',
  name: 'My Custom Tour',
  storageKey: 'nostr-tour-mine',
  steps: [
    {
      id: 'step-1',
      target: '.my-element',
      title: 'Step Title',
      content: 'Step description',
      position: 'bottom',
      action: 'Optional action text',
      spotlightPadding: 8,
    },
    // ... more steps
  ],
};
```

## API Reference

### useTour Hook

```tsx
const {
  state,              // Current tour state
  config,             // Current tour config
  startTour,          // Start a tour
  endTour,            // End/skip tour
  goToStep,           // Jump to specific step
  goToNextStep,       // Advance to next step
  goToPreviousStep,   // Go back
  restartTour,        // Restart current tour
  currentStepData,    // Current step info
} = useTour();
```

### Storage Utilities

```tsx
import { 
  hasCompletedTour, 
  hasSkippedTour, 
  resetTourProgress 
} from '@/components/tour';

// Check if user completed a tour
const completed = hasCompletedTour('damus-tour');

// Reset progress
resetTourProgress('damus-tour');
```

## Styling

The tour system uses CSS custom properties for easy theming:

```css
:root {
  --tour-primary: #8b5cf6;
  --tour-backdrop: rgba(0, 0, 0, 0.75);
  --tour-spotlight-color: #8b5cf6;
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Chrome Android 88+

## License

Part of the Nostr Beginner Guide project.
