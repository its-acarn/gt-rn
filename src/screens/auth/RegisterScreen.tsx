import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme/colors';
import { AuthStackParamList } from '@/navigation/types';

type RegisterNavigation = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterNavigation>();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!displayName || !email || !password) {
      Alert.alert('Missing information', 'All fields are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password
      });
    } catch (error) {
      Alert.alert('Unable to register', 'Try a different email or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subtitle}>Track courses, visits, stats, and more.</Text>

        <Text style={styles.label}>Display name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Andrew Carnaghan"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a secure password"
        />

        <Pressable style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSubmitting ? 'Creating account…' : 'Sign up'}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="button">
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center'
  },
  content: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    gap: 12,
    elevation: 2
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    fontSize: 16,
    color: colors.text
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  footerText: {
    color: colors.muted,
    fontSize: 14
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14
  }
});
