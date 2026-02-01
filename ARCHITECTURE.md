# React Native Architecture - Project Structure

## Overview

This project follows modern React Native architecture patterns with Expo Router for file-based routing and a clean separation of concerns.

## Directory Structure

```
gt-rn/
├── app/                          # Expo Router - File-based routing
│   ├── (auth)/                  # Auth route group
│   │   ├── _layout.tsx         # Auth stack layout
│   │   ├── login.tsx           # Login screen
│   │   └── register.tsx        # Register screen
│   ├── (tabs)/                 # Tab navigation group
│   │   ├── _layout.tsx         # Tab bar configuration
│   │   ├── index.tsx           # Courses tab (home)
│   │   ├── wishlist.tsx        # Wishlist tab
│   │   ├── my-courses.tsx      # My courses tab
│   │   ├── stats.tsx           # Stats tab
│   │   └── profile.tsx         # Profile tab
│   ├── course/
│   │   └── [id].tsx            # Dynamic course detail route
│   ├── modal/
│   │   └── add-visit.tsx       # Add visit modal
│   └── _layout.tsx             # Root layout (providers, auth flow)
│
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   ├── features/           # Feature-specific components
│   │   └── index.ts
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   ├── courses/
│   │   │   ├── api.ts          # API calls
│   │   │   ├── hooks.ts        # React Query hooks
│   │   │   └── types.ts        # TypeScript types
│   │   ├── visits/
│   │   ├── wishlist/
│   │   ├── stats/
│   │   ├── profile/
│   │   └── sync/
│   │
│   ├── services/               # Core services layer
│   │   ├── api/
│   │   │   ├── client.ts       # Axios instance
│   │   │   └── index.ts
│   │   ├── storage/
│   │   │   ├── database.ts     # SQLite
│   │   │   ├── secure-store.ts # Secure storage wrapper
│   │   │   └── index.ts
│   │   └── haptics.ts          # Haptic feedback service
│   │
│   ├── hooks/                  # Global custom hooks
│   │
│   ├── providers/              # React context providers
│   │   └── AuthProvider.tsx
│   │
│   ├── theme/                  # Design tokens
│   │   ├── colors.ts
│   │   └── navigation.ts
│   │
│   ├── types/                  # Global TypeScript types
│   │   ├── domain.ts
│   │   └── index.ts
│   │
│   └── utils/                  # Utility functions
│       └── id.ts
│
├── assets/                     # Static assets
├── app.json                    # Expo configuration
├── package.json
└── tsconfig.json
```

## Key Architectural Decisions

### 1. Expo Router (File-Based Routing)

**Why:** Modern approach to navigation with automatic deep linking, type safety, and better DX.

**Benefits:**
- Automatic route generation from file structure
- Built-in deep linking
- Better type safety with `useLocalSearchParams`
- Simplified navigation patterns
- Layouts for shared UI

**Example:**
```tsx
// app/(tabs)/index.tsx
import { useRouter } from 'expo-router';

export default function CoursesScreen() {
  const router = useRouter();

  const handlePress = (id: string) => {
    router.push(`/course/${id}`);
  };
  // ...
}
```

### 2. Services Layer

**Why:** Centralize external interactions (API, storage, native features) for better testability and reusability.

**Structure:**
- `services/api/` - HTTP client configuration
- `services/storage/` - Data persistence (SQLite, SecureStore, AsyncStorage)
- `services/haptics.ts` - Native feature wrappers

**Example:**
```tsx
// services/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

export const setAuthToken = (token: string | null) => {
  // ...
};
```

### 3. Feature-Based Organization

**Why:** Keep related code together - easier to find, modify, and remove features.

**Each feature contains:**
- `api.ts` - API endpoints
- `hooks.ts` - React Query hooks
- `types.ts` - TypeScript interfaces
- Components (when needed)

**Example:**
```tsx
// features/courses/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from './api';

export function useCourses(params) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => fetchCourses(params),
  });
}
```

### 4. Offline-First with React Query

**Why:** Mobile apps need to work offline and handle unreliable networks.

**Implementation:**
- Persistent query cache with AsyncStorage
- Optimistic updates
- Network-aware retry logic
- Stale-while-revalidate pattern

### 5. UI Component Library

**Why:** Consistent design, reusability, and easier maintenance.

**Structure:**
- `components/ui/` - Generic, reusable components (Button, Spinner, Input)
- `components/features/` - Feature-specific composed components

## Navigation Patterns

### Auth Flow

Auth is handled in `app/_layout.tsx` using route protection:

```tsx
function NavigationHandler() {
  const segments = useSegments();
  const { status } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = status === 'authenticated';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments]);

  return <Slot />;
}
```

### Tabs

Bottom tab navigation is configured in `app/(tabs)/_layout.tsx`:

```tsx
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ /* ... */ }}>
      <Tabs.Screen name="index" options={{ title: 'Courses' }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      {/* ... */}
    </Tabs>
  );
}
```

### Dynamic Routes

```tsx
// app/course/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```

### Modals

```tsx
// app/modal/add-visit.tsx
export default function AddVisitScreen() {
  return (
    <>
      <Stack.Screen options={{ presentation: 'modal' }} />
      {/* ... */}
    </>
  );
}
```

## Migration from React Navigation

### What Changed

1. **Routing**: React Navigation → Expo Router
2. **File Structure**: `src/screens/` and `src/navigation/` → `app/` directory
3. **Services Layer**: Created `src/services/` for API and storage
4. **Entry Point**: `App.tsx` → `index.js` with `expo-router/entry`
5. **Components**: Organized into `ui/` and `features/`

### Import Path Updates

```tsx
// Old
import { api } from '@/api/client';
import { initializeDatabase } from '@/storage/database';
import { CenteredSpinner } from '@/components/CenteredSpinner';

// New
import { api } from '@/services/api';
import { initializeDatabase } from '@/services/storage';
import { CenteredSpinner } from '@/components';
```

## Best Practices

### 1. Feature Organization
- Keep feature code self-contained
- Export only what's needed from features
- Use barrel exports (`index.ts`) for clean imports

### 2. Navigation
- Use `router.push()` for new screens
- Use `router.replace()` for auth flows
- Use `router.back()` for dismissing modals

### 3. State Management
- Use React Query for server state
- Use Context for global app state (auth, theme)
- Use local state for UI-only state

### 4. Performance
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for expensive components
- Implement pull-to-refresh for lists

### 5. Offline Support
- All API calls go through React Query
- Use optimistic updates for mutations
- Persist query cache with AsyncStorage
- Handle network errors gracefully

## Running the App

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type check
npm run typecheck

# Lint
npm run lint
```

## Key Dependencies

- **expo-router** - File-based routing
- **@tanstack/react-query** - Server state management
- **axios** - HTTP client
- **expo-secure-store** - Secure credential storage
- **expo-sqlite** - Local database
- **expo-haptics** - Haptic feedback

## Future Enhancements

### Potential Additions
1. **Theme Provider** - Dark mode support
2. **Error Boundaries** - Better error handling
3. **Analytics** - User behavior tracking
4. **Push Notifications** - User engagement
5. **Biometric Auth** - Enhanced security
6. **Location Services** - Course discovery
7. **Image Optimization** - FastImage or Expo Image

### Component Library Expansion
- Button variants
- Form inputs
- Cards
- Modals
- Toast notifications
- Loading states

## Troubleshooting

### Common Issues

**TypeScript errors after update:**
```bash
npm run typecheck
```

**Metro bundler cache:**
```bash
npx expo start --clear
```

**Node modules issues:**
```bash
rm -rf node_modules
npm install
```

**iOS/Android build issues:**
```bash
cd ios && pod install && cd ..
npx expo prebuild --clean
```
