import { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CenteredSpinner } from '@/components/CenteredSpinner';
import { useCourseDetail } from '@/features/courses/hooks';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/features/wishlist/hooks';
import { CoursesStackParamList, RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

type CourseDetailRoute = RouteProp<CoursesStackParamList, 'CourseDetail'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const CourseDetailScreen = () => {
  const {
    params: { courseId }
  } = useRoute<CourseDetailRoute>();
  const rootNavigation = useNavigation<RootNavigation>();

  const { data, isLoading } = useCourseDetail(courseId);
  const { data: wishlist } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = useMemo(
    () => Boolean(wishlist?.some((entry) => entry.courseId === courseId)),
    [courseId, wishlist]
  );

  if (isLoading || !data) {
    return <CenteredSpinner message="Loading course…" />;
  }

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist.mutateAsync(courseId);
      } else {
        await addToWishlist.mutateAsync(courseId);
      }
    } catch (error) {
      console.error('Wishlist update failed', error);
    }
  };

  const handleAddVisit = () => {
    rootNavigation.navigate('AddVisitModal', { courseId });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.meta}>
        {data.address1}
        {data.address2 ? `, ${data.address2}` : ''}
      </Text>
      <Text style={styles.meta}>
        {data.city}
        {data.stateRegion ? `, ${data.stateRegion}` : ''}
        {` • ${data.country}`}
      </Text>
      {data.website ? <Text style={styles.link}>{data.website}</Text> : null}
      {data.phone ? <Text style={styles.meta}>{data.phone}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddVisit}>
          <Text style={styles.primaryButtonText}>Log a visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, isWishlisted && styles.secondaryButtonActive]}
          onPress={handleToggleWishlist}
        >
          <Text style={[styles.secondaryButtonText, isWishlisted && styles.secondaryButtonTextActive]}>
            {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tee boxes</Text>
        {data.teeBoxes?.length ? (
          data.teeBoxes.map((tee) => (
            <View key={tee.id} style={styles.teeCard}>
              <Text style={styles.teeName}>{tee.name}</Text>
              <Text style={styles.teeDetails}>
                Par {tee.parTotal ?? '—'} • {tee.yardageTotal ?? '—'} yds
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyCopy}>No tee boxes recorded yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text
  },
  meta: {
    color: colors.muted,
    fontSize: 14
  },
  link: {
    color: colors.primary,
    fontSize: 14
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  secondaryButtonActive: {
    backgroundColor: '#fff8f0',
    borderColor: colors.secondary
  },
  secondaryButtonText: {
    color: colors.muted,
    fontWeight: '600'
  },
  secondaryButtonTextActive: {
    color: colors.secondary
  },
  section: {
    marginTop: 16,
    gap: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text
  },
  teeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  teeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text
  },
  teeDetails: {
    color: colors.muted,
    marginTop: 4
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 14
  }
});
