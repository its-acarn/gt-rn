# React Hooks Violation Fix

**Issue:** "Rendered fewer hooks than expected" error after FlashList migration

## Root Cause

The error occurred because of **early returns before all hooks were called**, violating React's [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).

### The Problem Pattern

```typescript
// ❌ WRONG - Early return before hooks
export default function Component() {
  const data = useData();
  const [state] = useState();

  if (loading) {
    return <Spinner />; // Early return!
  }

  const callback = useCallback(() => {}, []); // ❌ Won't be called when loading
  const value = useMemo(() => {}, []);      // ❌ Won't be called when loading

  return <View>...</View>;
}
```

**Why this breaks:**
- First render: `loading = false` → all hooks called (3 hooks total)
- Second render: `loading = true` → early return → only 2 hooks called
- React expects **exactly the same number of hooks in the same order every render**

### The Fix

```typescript
// ✅ CORRECT - All hooks before early return
export default function Component() {
  const data = useData();
  const [state] = useState();

  // Call ALL hooks unconditionally
  const callback = useCallback(() => {}, []); // ✅ Always called
  const value = useMemo(() => {}, []);       // ✅ Always called

  // Early returns AFTER all hooks
  if (loading) {
    return <Spinner />;
  }

  return <View>...</View>;
}
```

## Files Fixed

### 1. `app/(tabs)/my-courses.tsx`
- Moved `useCallback` hooks (lines 29-44) **before** the `isLoading` early return
- **Before:** Early return on line 25
- **After:** Early return moved to line 30 (after all hooks)

### 2. `app/(tabs)/wishlist.tsx`
- Moved `useCallback` hooks (lines 30-61) **before** the `isLoading` early return
- **Before:** Early return on line 26
- **After:** Early return moved to line 42 (after all hooks)

### 3. `app/(tabs)/index.tsx`
- Moved `useCallback` hooks (lines 50-70) **before** the `isInitialLoading` early return
- **Before:** Early return on line 46
- **After:** Early return moved to line 72 (after all hooks)

## React Rules of Hooks

### ✅ DO
- Call hooks at the top level of your component
- Call hooks in the same order every render
- Call all hooks before any early returns

### ❌ DON'T
- Call hooks inside conditions (`if`)
- Call hooks inside loops (`for`, `while`)
- Call hooks after early returns
- Call hooks inside callbacks

## Prevention

When adding new hooks to a component:
1. Add them at the top level, before any conditional logic
2. Group all hooks together at the start of the function
3. Place early returns and conditional logic **after** all hook calls

## Resources

- [React Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [ESLint Plugin: eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
