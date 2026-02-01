import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CenteredSpinner } from '@/components';
import { useStatsOverview, useStatsTimeline } from '@/features/stats/hooks';
import { useSync } from '@/features/sync/useSync';
import { colors } from '@/theme/colors';

export default function StatsScreen() {
  const { isSyncing, lastSyncAt, triggerSync } = useSync();
  const [groupBy, setGroupBy] = useState<'year' | 'month'>('year');
  const { data, isLoading } = useStatsOverview();
  const { data: timeline } = useStatsTimeline({ groupBy });

  if (isLoading || !data) {
    return <CenteredSpinner message="Loading stats…" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Stats</Text>
          <Text style={styles.subtitle}>Track totals, regions, and streaks across visits.</Text>
        </View>
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={() => triggerSync()}
        >
          <Text style={styles.syncButtonText}>{isSyncing ? 'Syncing…' : 'Sync now'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.meta}>
        Last sync: {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}
      </Text>

      <View style={styles.cardRow}>
        <StatCard label="Courses played" value={data.totalCourses.toString()} />
        <StatCard label="Total visits" value={data.totalVisits.toString()} />
      </View>

      <View style={styles.cardRow}>
        <StatCard label="Longest streak (months)" value={data.longestMonthStreak.toString()} />
        <StatCard
          label="Most recent round"
          value={
            data.mostRecentVisitDate ? new Date(data.mostRecentVisitDate).toLocaleDateString() : '—'
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visits by region</Text>
        {data.visitsByRegion.map((region) => (
          <View key={`${region.country}-${region.region ?? 'all'}`} style={styles.listItem}>
            <Text style={styles.listLabel}>
              {region.country}
              {region.region ? ` • ${region.region}` : ''}
            </Text>
            <Text style={styles.listValue}>{region.count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.timelineHeader}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleButton, groupBy === 'year' && styles.toggleButtonActive]}
              onPress={() => setGroupBy('year')}
            >
              <Text style={[styles.toggleLabel, groupBy === 'year' && styles.toggleLabelActive]}>
                Year
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, groupBy === 'month' && styles.toggleButtonActive]}
              onPress={() => setGroupBy('month')}
            >
              <Text style={[styles.toggleLabel, groupBy === 'month' && styles.toggleLabelActive]}>
                Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {timeline?.map((entry) => (
          <View key={entry.period} style={styles.listItem}>
            <Text style={styles.listLabel}>{entry.period}</Text>
            <Text style={styles.listValue}>{entry.visits} visits</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  syncButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  syncButtonDisabled: {
    opacity: 0.7,
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  toggleLabel: {
    color: colors.muted,
    fontWeight: '600',
  },
  toggleLabelActive: {
    color: colors.primary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  listValue: {
    color: colors.muted,
  },
});
