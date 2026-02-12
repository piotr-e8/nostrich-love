# Lucide Icon Mapping for Nostr Clients

## Common Nostr Icons

| Feature | Lucide Icon | Alternative | Notes |
|---------|-------------|-------------|-------|
| Home | `Home` | `House` | Feed/timeline |
| Search | `Search` | `ScanSearch` | Discovery |
| Profile | `User` | `UserCircle` | User account |
| Settings | `Settings` | `Cog` | Configuration |
| Notifications | `Bell` | `Inbox` | Alerts/mentions |
| Messages | `MessageCircle` | `Mail` | DMs/chat |
| Post/Compose | `PlusCircle` | `SquarePen` | Create note |
| Reply | `MessageSquare` | `Reply` | Thread reply |
| Repost | `Repeat` | `RefreshCw` | Share/boost |
| Like/React | `Heart` | `ThumbsUp` | Reaction |
| Zap | `Zap` | `ZapFast` | Lightning tip |
| More Options | `MoreHorizontal` | `MoreVertical` | Overflow menu |
| Share | `Share` | `ExternalLink` | Share post |
| Bookmark | `Bookmark` | `BookMarked` | Save post |
| Copy | `Copy` | `Clipboard` | Copy ID/text |
| Image | `Image` | `Images` | Media upload |
| Link | `Link` | `Paperclip` | URL attachment |
| Globe | `Globe` | `Globe2` | Public/global |
| Lock | `Lock` | `LockKeyhole` | Private/encrypted |
| Clock | `Clock` | `History` | Timestamp |
| Check | `Check` | `CheckCircle2` | Verified/done |
| X/Close | `X` | `XCircle` | Close/delete |
| Menu | `Menu` | `List` | Navigation |
| Back | `ArrowLeft` | `ChevronLeft` | Navigate back |
| Forward | `ArrowRight` | `ChevronRight` | Navigate forward |
| Refresh | `RefreshCw` | `RotateCcw` | Reload |
| Filter | `Filter` | `Sliders` | Filter options |
| Sort | `ArrowUpDown` | `SortAsc` | Sorting |
| List | `List` | `AlignJustify` | List view |
| Grid | `LayoutGrid` | `Grid` | Grid view |
| Moon | `Moon` | `MoonStar` | Dark mode |
| Sun | `Sun` | `SunDim` | Light mode |
| QR Code | `QrCode` | `Scan` | QR scan |
| Key | `Key` | `KeyRound` | Private key |
| Shield | `Shield` | `ShieldCheck` | Security |
| Relay | `Radio` | `Antenna` | Relay/server |
| Hash | `Hash` | `HashTag` | Hashtag/topic |
| At | `AtSign` | `Mention` | Mention |

## Client-Specific Icons

### Amethyst (Android)
- Use Material Design icons where available
- Floating Action Button: `Plus`
- Bottom Navigation: 5 icons

### Damus (iOS)
- Use SF Symbols equivalents
- Tab bar icons: filled vs outline states
- Navigation: Back chevrons

### Gossip (Desktop)
- Desktop-style icons
- Menu bar icons
- Toolbar icons

## Icon Sizes

| Usage | Size | Stroke Width |
|-------|------|--------------|
| Navigation | 24px | 2px |
| Action Bar | 20px | 1.5px |
| Inline | 16px | 1.5px |
| Small | 14px | 1px |
| Large | 32px | 2px |

## Color States

| State | Color | Usage |
|-------|-------|-------|
| Default | `--icon-color` | Normal state |
| Active | `--icon-active` | Selected state |
| Disabled | `--icon-muted` | Non-interactive |
| Error | `--icon-error` | Warning/error |
| Success | `--icon-success` | Confirmation |

## Implementation Notes

1. **Consistency**: Use same icon for same action across clients
2. **Accessibility**: Include aria-labels
3. **Animation**: Add subtle hover states
4. **Sizing**: Maintain 24px touch targets
5. **Stroke**: Use consistent stroke widths
