/**
 * Tour System Integration Guide
 * 
 * Step-by-step instructions for adding tours to existing simulators
 */

## Integration Steps

### Step 1: Add Tour Attributes to Simulator Elements

Add `data-tour` attributes to key elements for targeting:

```tsx
// In your simulator components
<button 
  className="compose-btn"
  data-tour="damus-compose"
>
  Compose
</button>

<div 
  className="feed"
  data-tour="damus-feed"
>
  {/* Feed content */}
</div>
```

### Step 2: Import Required Files

In your simulator page or component:

```tsx
// At the top of your file
import { TourWrapper, TourButton } from '@/components/tour';
import { damusTourConfig } from '@/data/tours';
import '@/components/tour/tour.css';
```

### Step 3: Wrap with TourWrapper

```tsx
export function DamusSimulator() {
  return (
    <TourWrapper 
      tourConfig={damusTourConfig}
      autoStart={true}  // Auto-start on first visit
    >
      {/* Your existing simulator JSX */}
      <div className="simulator-content">
        {/* ... */}
      </div>
      
      {/* Optional: Manual tour button */}
      <TourButton tourConfig={damusTourConfig} />
    </TourWrapper>
  );
}
```

### Step 4: Update Tour Selectors (if needed)

If your simulator uses different class names than the tour config, update the tour file:

```ts
// In src/data/tours/damus-tour.ts
{
  id: 'damus-compose',
  target: '.my-custom-compose-btn', // Update selector
  title: 'Create a Post',
  content: '...',
  position: 'bottom',
}
```

### Step 5: Test the Tour

1. Clear localStorage to reset tour state
2. Refresh the page
3. Tour should auto-start
4. Test all navigation: Next, Prev, Skip, keyboard
5. Test mobile responsiveness

## Manual Tour Trigger

Add a button to manually start the tour:

```tsx
import { useTour } from '@/components/tour';

function SettingsPanel() {
  const { restartTour } = useTour();
  
  return (
    <button onClick={restartTour}>
      Restart Guided Tour
    </button>
  );
}
```

## Available Tours

All tours are exported from `@/data/tours`:

- `damusTourConfig` - iOS Damus client
- `amethystTourConfig` - Android Amethyst client  
- `primalTourConfig` - Web Primal client
- `snortTourConfig` - Web Snort client
- `yakihonneTourConfig` - Web YakiHonne client

## Customizing Tour Behavior

### Disable Auto-start

```tsx
<TourWrapper 
  tourConfig={damusTourConfig}
  autoStart={false}  // Only manual start
>
```

### Callbacks

```tsx
<TourWrapper 
  tourConfig={damusTourConfig}
  onTourComplete={() => {
    // Show completion message
    showToast('Tour completed!');
  }}
  onTourSkip={() => {
    // Show "resume later" message
    showToast('You can restart the tour anytime');
  }}
>
```

### Conditional Tour Button

```tsx
import { hasCompletedTour } from '@/components/tour';

function ShowCompletionBadge() {
  const completed = hasCompletedTour('damus-tour');
  
  return completed ? (
    <Badge>✓ Tour Completed</Badge>
  ) : null;
}
```

## Troubleshooting

**Tour not starting?**
- Check that autoStart prop is true
- Clear localStorage for the tour key
- Check browser console for errors

**Elements not highlighted?**
- Verify selectors match actual DOM elements
- Ensure elements are rendered before tour starts
- Add small delay if elements load asynchronously

**Tooltips in wrong position?**
- Adjust `position` property in tour step
- Tooltips auto-adjust for viewport edges
- Check that target element is visible

**CSS not loading?**
- Import `tour.css` in your component or layout
- Check that Tailwind/PostCSS is processing the file
- Verify file path is correct
