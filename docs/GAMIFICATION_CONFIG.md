# Configurable Gamification System

This document explains how to configure the gamification system (badges and streak tracking) without touching code.

## Quick Start

To change what activities trigger badges or streaks, edit:

```
src/config/gamification.ts
```

## Configuration Structure

### 1. Badge Definitions

Define badges in the `badges` object:

```typescript
'badge-id': {
  id: 'badge-id',
  name: 'Badge Name',
  description: 'What the user did to earn this',
  icon: '🎖️',
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  requirement: 'Description shown to users',
}
```

### 2. Activity Definitions

Define trackable activities in the `activities` object:

```typescript
activityId: {
  id: 'activity-id',
  name: 'Activity Name',
  description: 'What this activity represents',
  triggers: {
    streak: true | false,  // Does this count toward streak?
    badges: [
      {
        badgeId: 'badge-id',
        trigger: {
          type: 'boolean' | 'count' | 'threshold',
          threshold?: number  // Required for 'count' and 'threshold'
        }
      }
    ]
  }
}
```

## Trigger Types

### `boolean`
Award badge on first occurrence (one-time badges).

Example: Key generation, first post

```typescript
{
  badgeId: 'key-master',
  trigger: { type: 'boolean' }
}
```

### `count`
Award badge when cumulative count reaches threshold.

Example: Complete 3 guides for "Knowledge Seeker"

```typescript
{
  badgeId: 'knowledge-seeker',
  trigger: { type: 'count', threshold: 3 }
}
```

### `threshold`
Award badge when current value reaches threshold (state-based).

Example: Select 10 accounts for "Community Builder"

```typescript
{
  badgeId: 'community-builder',
  trigger: { type: 'threshold', threshold: 10 }
}
```

## Built-in Activities

The system comes with these pre-defined activities:

| Activity ID | Description | Streak | Badges |
|-------------|-------------|---------|---------|
| `viewGuide` | User viewed a guide | ✅ | None |
| `completeGuide` | User scrolled 80% of guide | ✅ | knowledge-seeker (3), nostr-graduate (9) |
| `generateKeys` | Generated Nostr keys | ✅ | key-master |
| `backupKeys` | Downloaded key backup | ✅ | security-conscious |
| `selectRelays` | Selected relays | ✅ | relay-explorer (3+) |
| `followAccounts` | Selected accounts | ✅ | community-builder (10+) |
| `makeFirstPost` | Made first Nostr post | ✅ | first-post |
| `receiveFirstZap` | Received first zap | ✅ | zap-receiver |

## Examples

### Add a New Badge

1. Add badge definition:
```typescript
'early-bird': {
  id: 'early-bird',
  name: 'Early Bird',
  description: 'Visited the site 5 days in a row',
  icon: '🐦',
  rarity: 'rare',
  requirement: 'Maintain a 5-day streak',
}
```

2. No activity needed - streak is automatic!

### Change Badge Threshold

To require 5 guides instead of 3 for "Knowledge Seeker":

```typescript
{
  badgeId: 'knowledge-seeker',
  trigger: { type: 'count', threshold: 5 },  // Changed from 3
}
```

### Add Streak to Activity

To make key generation NOT count toward streak:

```typescript
generateKeys: {
  id: 'generate-keys',
  name: 'Generate Keys',
  triggers: {
    streak: false,  // Changed from true
    badges: [...]
  }
}
```

### Create New Activity

1. Add to config:
```typescript
'shareGuide': {
  id: 'share-guide',
  name: 'Share Guide',
  description: 'User shared a guide on social media',
  triggers: {
    streak: true,
    badges: [
      {
        badgeId: 'sharer',
        trigger: { type: 'count', threshold: 3 }
      }
    ]
  }
}
```

2. Call from component:
```typescript
import { recordActivity } from '../utils/gamificationEngine';

// When user shares
recordActivity('shareGuide');
```

## Migration from Old System

The old system used separate functions like:
- `recordKeysGenerated()`
- `recordKeysBackedUp()`
- `updateConnectedRelays(count)`
- `updateFollowedAccounts(count)`
- `recordActivity()`

**New system uses one function:**
```typescript
recordActivity('activityId', { count?: number, guideId?: string })
```

## Component Integration

Components should import and call:

```typescript
import { recordActivity } from '../utils/gamificationEngine';

// Simple activity (streak only or boolean badge)
recordActivity('viewGuide');

// Activity with count (threshold-based badges)
recordActivity('selectRelays', { count: selectedRelays.size });

// Activity with guide ID (count-based badges)
recordActivity('completeGuide', { guideId: 'what-is-nostr' });
```

## Data Flow

1. Component calls `recordActivity(activityId, metadata)`
2. Engine loads current gamification data from localStorage
3. Engine updates streak (if configured)
4. Engine checks badge triggers (if configured)
5. Engine awards badges if thresholds met
6. Engine saves updated data to localStorage
7. Engine dispatches `gamification-updated` event
8. UI components (streak banner, badge display) listen and update

## Testing

To test your configuration:

1. Open browser DevTools
2. Go to Application → Local Storage
3. Find `nostrich-gamification-v1`
4. Delete it to reset
5. Perform activities and watch the data update
6. Check Console for logs: `[Gamification] Recording activity: ...`

## Troubleshooting

**Badge not awarding?**
- Check that badge ID matches in both `badges` and activity `triggers`
- Check trigger type and threshold
- Check browser console for errors
- Verify component is calling `recordActivity` with correct ID

**Streak not updating?**
- Check `streak: true` in activity config
- Verify component calls `recordActivity`
- Streak only updates once per day (by design)

**Activity not recognized?**
- Check activity ID matches exactly (case-sensitive)
- Verify import: `import { recordActivity } from '../utils/gamificationEngine'`
