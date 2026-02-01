import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CenteredSpinner } from '@/components';
import { useAuth } from '@/providers/AuthProvider';
import { usePublicStats, usePublicVisitedCourses } from '@/features/profile/hooks';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const slug = user?.publicSlug;
  const { data: stats, isLoading: statsLoading } = usePublicStats(slug);
  const { data: visits, isLoading: visitsLoading } = usePublicVisitedCourses(slug);

  if (statsLoading || visitsLoading) {
    return <CenteredSpinner message="Loading profile…" />;
  }

  if (!stats) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyHeading}>Profile unavailable</Text>
        <Text style={styles.emptyCopy}>
          Check the slug or ask the user to make their profile public.
        </Text>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{user?.displayName || slug}</Text>
          <Text style={styles.subtitle}>Public stats for this community member.</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        <Text style={styles.row}>Courses played: {stats.totalCourses}</Text>
        <Text style={styles.row}>Total visits: {stats.totalVisits}</Text>
        <Text style={styles.row}>Longest streak: {stats.longestMonthStreak} months</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visited courses</Text>
        {visits?.map((visit) => (
          <View key={visit.id} style={styles.visitCard}>
            <Text style={styles.visitCourse}>{visit.courseId}</Text>
            <Text style={styles.visitMeta}>
              {new Date(visit.visitDate).toLocaleDateString()} • {visit.holesPlayed} holes
            </Text>
          </View>
        ))}
        {!visits?.length ? <Text style={styles.row}>No public visits yet.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  signOutButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  signOutButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  row: {
    color: colors.muted,
  },
  visitCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  visitCourse: {
    fontWeight: '600',
    color: colors.text,
  },
  visitMeta: {
    color: colors.muted,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
    gap: 12,
  },
  emptyHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptyCopy: {
    color: colors.muted,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
