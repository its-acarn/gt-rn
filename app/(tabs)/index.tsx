import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import { CenteredSpinner } from '@/components';
import { useCourses } from '@/features/courses/hooks';
import { colors } from '@/theme/colors';
import { Course } from '@/types/domain';

export default function CoursesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [country, setCountry] = useState<string | undefined>(undefined);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const params = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      country,
    }),
    [country, debouncedSearch]
  );

  const { data, isLoading, isRefetching, refetch } = useCourses(params);

  const courses = data ?? [];
  const isInitialLoading = isLoading && !data;

  if (isInitialLoading) {
    return <CenteredSpinner message="Loading courses…" />;
  }

  const handlePressCourse = useCallback(
    (course: Course) => {
      router.push(`/course/${course.id}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <TouchableOpacity style={styles.card} onPress={() => handlePressCourse(item)}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.city}
          {item.stateRegion ? `, ${item.stateRegion}` : ''}
          {` • ${item.country}`}
        </Text>
        {item.website ? <Text style={styles.website}>{item.website}</Text> : null}
      </TouchableOpacity>
    ),
    [handlePressCourse]
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.heading}>Courses</Text>
        <Text style={styles.subtitle}>
          Search the curated catalog or filter by region.
          {search !== debouncedSearch && ' Typing...'}
          {isLoading && search === debouncedSearch && ' Searching...'}
        </Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search courses"
          style={styles.searchInput}
        />
        <TextInput
          value={country ?? ''}
          onChangeText={setCountry}
          placeholder="Country code (e.g. US, GB)"
          maxLength={2}
          autoCapitalize="characters"
          style={styles.searchInput}
        />
      </View>
      <FlashList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyHeading}>No courses yet</Text>
            <Text style={styles.emptyCopy}>
              Try adjusting your search or ask an admin to approve more courses.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 14,
  },
  website: {
    color: colors.primary,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
});
