# Infinite Loop Fix Summary

**Date**: 2026-02-13  
**Issue**: "Maximum update depth exceeded" error on /follow-pack  
**Root Cause**: useLocalStorage hook's setValue not memoized  
**Status**: ✅ Fixed

---

## Problem Analysis

The /follow-pack page was experiencing an infinite re-render loop causing:
- "Maximum update depth exceeded" React error
- Memory usage continuously growing
- Browser tab becoming unresponsive
- Error message appearing repeatedly

**Error Pattern:**
```
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, 
but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

---

## Root Cause

**File**: `src/hooks/useLocalStorage.ts`

The `useLocalStorage` hook was returning a `setValue` function that was recreated on every render:

```typescript
// BEFORE - Problematic
const setValue = (value: T | ((val: T) => T)) => {
  // ... implementation
};

return [storedValue, setValue];  // setValue is new on every render
```

When components used this hook and included `setSavedSelections` (the setValue function) in a useEffect dependency array:

```typescript
React.useEffect(() => {
  setSavedSelections(selections);
}, [selectedNpubs, setSavedSelections]);  // setSavedSelections changes every render!
```

This created an infinite loop:
1. Component renders
2. useLocalStorage returns new setValue function
3. useEffect dependency changes (setSavedSelectors is new)
4. useEffect runs and calls setState
5. Component re-renders
6. Back to step 1 - infinite loop!

---

## Fix Applied

**File**: `src/hooks/useLocalStorage.ts`

Wrapped `setValue` in `useCallback` to ensure stable reference:

```typescript
// AFTER - Fixed
const setValue = useCallback((value: T | ((val: T) => T)) => {
  try {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? (value as (val: T) => T)(prev) : value;
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
      
      return valueToStore;
    });
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}, [key]);  // Only depends on key (which is stable)

return [storedValue, setValue];  // setValue is now stable
```

**Key Changes:**
1. Added `useCallback` wrapper around `setValue`
2. Used functional update pattern inside `setStoredValue` to avoid stale closures
3. Dependency array only includes `key` (which is stable when called correctly)

---

## Impact

**Affected Components:**
- `/follow-pack` page (FollowPackFinder component)
- Any component using `useLocalStorage` hook with setValue in useEffect dependencies

**Performance Impact:**
- ✅ Eliminates infinite re-render loop
- ✅ Stops memory growth
- ✅ Removes React warning spam
- ✅ Improves page responsiveness

---

## Prevention

**Best Practices for Custom Hooks:**

1. **Always memoize returned functions with useCallback:**
```typescript
export function useCustomHook() {
  const [state, setState] = useState();
  
  // ❌ Bad - new function every render
  const updateState = (value) => setState(value);
  
  // ✅ Good - stable function reference
  const updateState = useCallback((value) => {
    setState(value);
  }, []);
  
  return [state, updateState];
}
```

2. **Use functional updates when previous state is needed:**
```typescript
// ❌ Bad - relies on stale closure
const setValue = useCallback((newValue) => {
  setState(stableValue ? newValue : oldValue);  // oldValue might be stale
}, [stableValue]);

// ✅ Good - always has fresh state
const setValue = useCallback((newValue) => {
  setState(prev => stableValue ? newValue : prev);
}, [stableValue]);
```

3. **Be careful with hook dependencies:**
```typescript
// ❌ Bad - setState in dependency array
useEffect(() => {
  setState(value);
}, [setState, value]);  // setState changes every render

// ✅ Good - only include stable dependencies
useEffect(() => {
  setState(value);
}, [value]);  // Assuming setState is stable
```

---

## Testing

**Verification Steps:**
1. Navigate to `/follow-pack`
2. Open browser DevTools console
3. Verify no "Maximum update depth exceeded" errors
4. Check Memory tab - usage should be stable
5. Interact with filters, search, and account selection
6. Verify page remains responsive

---

## Files Modified

- ✅ `src/hooks/useLocalStorage.ts` - Memoized setValue with useCallback

## Related Fixes

This fix complements the memory leak fix in `CyberpunkAnimation.tsx`. Both issues were causing performance problems but from different causes:
- **Memory leak**: Orphaned timeouts accumulating
- **Infinite loop**: Unstable function references triggering re-renders

---

## References

- [React useCallback Documentation](https://react.dev/reference/react/useCallback)
- [React Hook Dependencies](https://react.dev/reference/react/useEffect#parameters)
- [Stale Closures in React](https://react.dev/reference/react/useCallback#preventing-an-effect-from-firing-too-often)
