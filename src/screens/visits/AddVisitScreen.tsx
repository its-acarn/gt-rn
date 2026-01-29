import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCreateVisit } from '@/features/visits/hooks';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { generateId } from '@/utils/id';

type AddVisitRoute = RouteProp<RootStackParamList, 'AddVisitModal'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const AddVisitScreen = () => {
  const navigation = useNavigation<RootNavigation>();
  const route = useRoute<AddVisitRoute>();
  const createVisit = useCreateVisit();

  const [courseId, setCourseId] = useState(route.params?.courseId ?? '');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [holesPlayed, setHolesPlayed] = useState<9 | 18>(18);
  const [grossScore, setGrossScore] = useState('');
  const [teeName, setTeeName] = useState('');

  const handleSubmit = async () => {
    if (!courseId) {
      Alert.alert('Course missing', 'Enter the course ID from the catalog.');
      return;
    }

    try {
      await createVisit.mutateAsync({
        id: generateId(),
        courseId,
        visitDate,
        holesPlayed,
        grossScore: grossScore ? Number(grossScore) : undefined,
        teeName: teeName || undefined
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not save visit', 'Try again when you have a stable connection.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Log a visit</Text>
      <Text style={styles.subtitle}>Track your rounds even while offline.</Text>

      <Text style={styles.label}>Course ID</Text>
      <TextInput
        value={courseId}
        onChangeText={setCourseId}
        placeholder="COURSE-123"
        style={styles.input}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Visit date</Text>
      <TextInput
        value={visitDate}
        onChangeText={setVisitDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.toggleButton, holesPlayed === 9 && styles.toggleButtonActive]}
          onPress={() => setHolesPlayed(9)}
        >
          <Text
            style={[styles.toggleText, holesPlayed === 9 && styles.toggleTextActive]}
          >
            9 holes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, holesPlayed === 18 && styles.toggleButtonActive]}
          onPress={() => setHolesPlayed(18)}
        >
          <Text
            style={[styles.toggleText, holesPlayed === 18 && styles.toggleTextActive]}
          >
            18 holes
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Gross score (optional)</Text>
      <TextInput
        value={grossScore}
        onChangeText={setGrossScore}
        placeholder="86"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Tee name</Text>
      <TextInput
        value={teeName}
        onChangeText={setTeeName}
        placeholder="Blue"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.primaryButton, createVisit.isPending && styles.primaryButtonDisabled]}
        onPress={handleSubmit}
      >
        <Text style={styles.primaryButtonText}>
          {createVisit.isPending ? 'Saving…' : 'Save visit'}
        </Text>
      </TouchableOpacity>
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
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text
  },
  subtitle: {
    color: colors.muted,
    marginBottom: 12
  },
  label: {
    fontWeight: '600',
    color: colors.muted
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  toggleButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary
  },
  toggleText: {
    color: colors.muted,
    fontWeight: '600'
  },
  toggleTextActive: {
    color: colors.primary
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  primaryButtonDisabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
