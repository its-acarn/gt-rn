import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CenteredSpinner } from '@/components/CenteredSpinner';
import { useCourses } from '@/features/courses/hooks';
import { CoursesStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { Course } from '@/types/domain';

type CoursesNavigation = NativeStackNavigationProp<CoursesStackParamList, 'CoursesList'>;

export const CoursesListScreen = () => {
  const navigation = useNavigation<CoursesNavigation>();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState<string | undefined>(undefined);
  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      country
    }),
    [country, search]
  );

  const { data, isLoading, isRefetching, refetch } = useCourses(params);

  const courses = data ?? [];

  if (isLoading) {
    return <CenteredSpinner message="Loading courses…" />;
  }

  const handlePressCourse = (course: Course) => {
    navigation.navigate('CourseDetail', { courseId: course.id });
  };

  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePressCourse(item)}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardMeta}>
        {item.city}
        {item.stateRegion ? `, ${item.stateRegion}` : ''}
        {` • ${item.country}`}
      </Text>
      {item.website ? <Text style={styles.website}>{item.website}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.heading}>Courses</Text>
        <Text style={styles.subtitle}>Search the curated catalog or filter by region.</Text>
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
      <FlatList
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
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text
  },
  subtitle: {
    color: colors.muted
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
    gap: 6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 14
  },
  website: {
    color: colors.primary,
    fontSize: 13
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center'
  }
});
