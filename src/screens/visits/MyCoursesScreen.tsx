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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CenteredSpinner } from '@/components/CenteredSpinner';
import { useCourses } from '@/features/courses/hooks';
import { useVisitedCourses } from '@/features/visits/hooks';
import { CoursesStackParamList, MainTabParamList, RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { Course, Visit } from '@/types/domain';

type TabsNavigation = BottomTabNavigationProp<MainTabParamList, 'MyCoursesTab'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const MyCoursesScreen = () => {
  const tabsNavigation = useNavigation<TabsNavigation>();
  const rootNavigation = useNavigation<RootNavigation>();
  const { data: courses } = useCourses();

  const { data, isLoading, refetch, isRefetching } = useVisitedCourses();

  const courseLookup = useMemo(() => {
    const map = new Map<string, Course>();
    courses?.forEach((course) => map.set(course.id, course));
    return map;
  }, [courses]);

  const visits = data ?? [];

  if (isLoading) {
    return <CenteredSpinner message="Loading your courses…" />;
  }

  const renderItem = ({ item }: { item: Visit }) => {
    const course = courseLookup.get(item.courseId);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          const params: NavigatorScreenParams<CoursesStackParamList> = {
            screen: 'CourseDetail',
            params: { courseId: item.courseId }
          };
          tabsNavigation.navigate('CoursesTab', params);
        }}
      >
        <Text style={styles.cardTitle}>{course?.name ?? 'Unknown course'}</Text>
        <Text style={styles.cardMeta}>Last visit {new Date(item.visitDate).toLocaleDateString()}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddVisit = () => {
    rootNavigation.navigate('AddVisitModal');
  };

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

      <FlatList
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text
  },
  subtitle: {
    color: colors.muted
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  cardMeta: {
    color: colors.muted
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  emptyCopy: {
    color: colors.muted,
    textAlign: 'center'
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600'
  }
});
