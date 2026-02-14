# Troubleshooting Guide

Common issues and solutions when working with the workflow system and simulators.

## Simulator Issues

### Blank Screen After Login

**Symptoms**: User clicks "Create Account" or "Login" and sees only a white/blank screen

**Possible Causes**:
1. AnimatePresence animation conflict
2. Missing screen component export
3. TourContext not available
4. State not updating properly

**Solutions**:

1. **Remove AnimatePresence wrapping**:
   ```tsx
   // Instead of:
   <AnimatePresence mode="wait">
     <motion.div key={activeTab}>...</motion.div>
   </AnimatePresence>
   
   // Use simple conditional rendering:
   {activeTab === 'home' && <HomeScreen />}
   ```

2. **Add console logging**:
   ```tsx
   console.log('Login called, user:', user);
   console.log('isAuthenticated:', isAuthenticated);
   ```

3. **Check all imports**:
   - Verify screen components export correctly
   - Check for circular dependencies

4. **Test without TourWrapper**:
   - Temporarily remove tour to isolate issue
   - If works without tour, check TourContext

### TypeScript Errors

**Issue**: `Property 'X' does not exist in type 'Y'`

**Solution**:
1. Check existing type definitions in `/src/data/mock/types.ts`
2. Use only fields that exist in the type
3. For optional fields, add type guards

**Example**:
```typescript
// MockUser doesn't have 'npub' field
// Wrong:
const user: MockUser = { npub: '...' } // Error!

// Right:
const user: MockUser = { 
  pubkey: '...', // Use pubkey instead
  ...
}
```

### Icon Not Displaying

**Issue**: Simulator icon shows broken image

**Solutions**:
1. Check icon path in configs.ts matches actual file
2. Verify icon file exists in /public/icons/
3. Use correct extension (.png vs .svg)
4. Check browser console for 404 errors

## Workflow Issues

### Agent Makes Wrong Assumptions

**Issue**: Code doesn't match existing patterns

**Solution**:
- Always provide `pattern_reference` in workflow inputs
- Reference existing working simulators (amethyst for Android, damus for iOS)
- Include specific file paths to mimic

### Missing Type Updates

**Issue**: Added new simulator but TypeScript errors about missing enum values

**Solution**:
1. Add to enum in `/src/simulators/shared/types/index.ts`
2. Add config in `/src/simulators/shared/configs.ts`
3. Export tour in `/src/data/tours/index.ts`
4. All three files must be updated

### Build Succeeds But Runtime Fails

**Issue**: npm run build passes, but simulator doesn't work in browser

**Diagnosis**:
```bash
# Check for console errors
npm run dev

# Open browser console (F12)
# Look for:
# - React errors
# - Missing module errors
# - TypeError messages
```

**Common Fixes**:
1. Check component exports (default vs named)
2. Verify all screen components render something
3. Check for null/undefined handling
4. Add error boundaries

## Research Issues

### Can't Find Brand Colors

**Problem**: No clear brand color on website

**Solutions**:
1. Check app screenshots for dominant colors
2. Look at logo and extract primary color
3. Use platform defaults (Material Design blue for Android)
4. Check GitHub for brand guidelines

### Missing Screenshots

**Problem**: No UI screenshots available

**Solutions**:
1. Check multiple sources:
   - Official website
   - App stores
   - GitHub README
   - YouTube videos
   - nostrapps.com
2. Use existing simulator as template
3. Implement generic platform-appropriate UI

## Testing Checklist

Before marking simulator complete, verify:

### Static Checks
- [ ] All required files exist
- [ ] TypeScript compiles without errors
- [ ] Build succeeds
- [ ] Configs properly registered

### Runtime Checks
- [ ] Login screen displays
- [ ] Login button works (no blank screen)
- [ ] Navigation between tabs works
- [ ] All screens render content
- [ ] Tour loads (if applicable)
- [ ] No console errors
- [ ] Icon displays correctly

### UI Checks
- [ ] Colors match brand
- [ ] Responsive layout works
- [ ] Dark mode works (if implemented)
- [ ] Navigation dropdown shows new entry

## Getting Help

If stuck:
1. Check `/docs/workflow-system/LESSONS_LEARNED.md`
2. Reference existing working simulators
3. Check browser console for errors
4. Review progress file for step-by-step log

## Prevention

### Before Implementation
- [ ] Review existing simulator patterns
- [ ] Check all type definitions
- [ ] Verify research sources include nostrapps.com
- [ ] Document expected UI flow

### During Implementation
- [ ] Test each screen individually
- [ ] Add console.log for debugging
- [ ] Verify all imports work
- [ ] Test on both light and dark themes

### After Implementation
- [ ] Run validation script
- [ ] Test full user flow manually
- [ ] Check browser console for errors
- [ ] Verify navigation integration
