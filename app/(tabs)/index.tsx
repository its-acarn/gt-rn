import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';

import { CenteredSpinner, CourseCard } from '@/components';
import { useCourses } from '@/features/courses/hooks';
import { colors } from '@/theme/colors';
import { Course } from '@/types/domain';

export default function CoursesScreen() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isRefetching, refetch } = useCourses({
    search: debouncedSearch || undefined,
    take: 50,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleClear = useCallback(() => {
    setSearchText('');
  }, []);

  const renderItem = useCallback(({ item }: { item: Course }) => {
    return <CourseCard course={item} />;
  }, []);

  const courses = data?.items ?? [];
  const totalCourses = data?.total ?? 0;

  const isSearching = isLoading && debouncedSearch.length > 0;
  const showEmptySearch = !isLoading && debouncedSearch.length > 0 && courses.length === 0;
  const showInitialState = !isLoading && debouncedSearch.length === 0 && courses.length === 0;

  if (isLoading && !isRefetching && debouncedSearch.length === 0) {
    return <CenteredSpinner message="Loading courses..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Courses</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.muted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses by name or city..."
          placeholderTextColor={colors.muted}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
        {isSearching && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.searchSpinner} />
        )}
      </View>

      {debouncedSearch.length > 0 && courses.length > 0 && (
        <Text style={styles.resultCount}>
          {totalCourses} {totalCourses === 1 ? 'course' : 'courses'} found
        </Text>
      )}

      <FlashList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          showEmptySearch ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyHeading}>No courses found</Text>
              <Text style={styles.emptyCopy}>
                Try adjusting your search or browse all courses.
              </Text>
            </View>
          ) : showInitialState ? (
            <View style={styles.emptyState}>
              <Ionicons name="golf-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyHeading}>Search for golf courses</Text>
              <Text style={styles.emptyCopy}>
                Find courses by name or city to start planning your next round.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchSpinner: {
    marginLeft: 8,
  },
  resultCount: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 12,
  },
  listContent: {
    gap: 16,
    paddingBottom: 32,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  emptyCopy: {
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 20,
  },
});
