import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type CenteredSpinnerProps = {
  message?: string;
};

export const CenteredSpinner = ({ message }: CenteredSpinnerProps) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center'
  }
});
