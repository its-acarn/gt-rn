import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import { CenteredSpinner } from '@/components';
import { useCourses } from '@/features/courses/hooks';
import { useVisitedCourses } from '@/features/visits/hooks';
import { colors } from '@/theme/colors';
import { Course, Visit } from '@/types/domain';

export default function MyCoursesScreen() {
  const router = useRouter();
  const { data: coursesResult } = useCourses();
  const { data, isLoading, refetch, isRefetching } = useVisitedCourses();

  const courseLookup = useMemo(() => {
    const map = new Map<string, Course>();
    coursesResult?.items.forEach((course) => map.set(course.id, course));
    return map;
  }, [coursesResult]);

  const visits = data ?? [];

  const renderItem = useCallback(
    ({ item }: { item: Visit }) => {
      const course = courseLookup.get(item.courseId);
      return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/course/${item.courseId}`)}>
          <Text style={styles.cardTitle}>{course?.name ?? 'Unknown course'}</Text>
          <Text style={styles.cardMeta}>Last visit {new Date(item.visitDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      );
    },
    [courseLookup, router]
  );

  const handleAddVisit = useCallback(() => {
    router.push('/modal/add-visit');
  }, [router]);

  if (isLoading) {
    return <CenteredSpinner message="Loading your courses…" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>My courses</Text>
          <Text style={styles.subtitle}>Latest visit per course shown below.</Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddVisit}>
          <Text style={styles.primaryButtonText}>Add visit</Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={visits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyHeading}>No visits yet</Text>
            <Text style={styles.emptyCopy}>
              Log your first round to start building your playing history.
            </Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleAddVisit}>
              <Text style={styles.secondaryButtonText}>Log a visit</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    color: colors.muted,
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyCopy: {
    color: colors.muted,
    textAlign: 'center',
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
