import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/theme/colors';
import { Course } from '@/types/domain';

type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/course/${course.id}`)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{course.name}</Text>
      <Text style={styles.cardMeta}>
        {course.city}
        {course.stateRegion ? `, ${course.stateRegion}` : ''}
        {course.country ? ` • ${course.country}` : ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    color: colors.muted,
  },
});
