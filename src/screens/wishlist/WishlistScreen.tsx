import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { CenteredSpinner } from '@/components/CenteredSpinner';
import { useCourses } from '@/features/courses/hooks';
import { useRemoveFromWishlist, useWishlist } from '@/features/wishlist/hooks';
import { CoursesStackParamList, MainTabParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { Course } from '@/types/domain';

type Navigation = BottomTabNavigationProp<MainTabParamList, 'WishlistTab'>;

export const WishlistScreen = () => {
  const { data: courses } = useCourses();
  const navigation = useNavigation<Navigation>();
  const { data, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const courseLookup = useMemo(() => {
    const map = new Map<string, Course>();
    courses?.forEach((course) => map.set(course.id, course));
    return map;
  }, [courses]);

  const wishlist = data ?? [];

  if (isLoading) {
    return <CenteredSpinner message="Loading wishlist…" />;
  }

  const handleRemove = async (courseId: string) => {
    try {
      await removeFromWishlist.mutateAsync(courseId);
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wishlist</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyHeading}>No saved courses yet</Text>
            <Text style={styles.emptyCopy}>
              Browse the catalog and tap “Add to wishlist” on a course you want to play.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const course = courseLookup.get(item.courseId);
          const courseDetailParams: NavigatorScreenParams<CoursesStackParamList> = {
            screen: 'CourseDetail',
            params: { courseId: item.courseId }
          };
          return (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CoursesTab', courseDetailParams)}
              >
                <Text style={styles.cardTitle}>{course?.name ?? 'Unknown course'}</Text>
                <Text style={styles.cardMeta}>
                  {course?.city ?? ''}
                  {course?.stateRegion ? `, ${course.stateRegion}` : ''}
                  {course?.country ? ` • ${course.country}` : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.courseId)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 24,
    paddingHorizontal: 20
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16
  },
  listContent: {
    gap: 16,
    paddingBottom: 32
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  cardMeta: {
    color: colors.muted
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff5f5'
  },
  removeButtonText: {
    color: colors.danger,
    fontWeight: '600'
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
    gap: 12
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  emptyCopy: {
    textAlign: 'center',
    color: colors.muted
  }
});
