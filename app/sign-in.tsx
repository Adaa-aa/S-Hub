import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

export default function SignInScreen() {
  const T = useThemeColors();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleLogin = () => {
    // TODO: wire up to your auth API
    setStatus('loading');
    setTimeout(() => {
      setStatus('idle');
      router.replace('/home' as any);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: T.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <View style={[styles.logoBox, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={styles.logoLetter}>W</Text>
        </View>
        <Text style={styles.appName}>Waker</Text>
        <Text style={[styles.tagline, { color: T.subText }]}>
          Connecting Ghana&apos;s finest workers with your daily needs.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: T.subText }]}>Email or Phone Number</Text>
          <View style={[styles.inputRow, { borderBottomColor: T.border }]}>
            <Ionicons name="person-outline" size={20} color={T.subText} />
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="Enter your details"
              placeholderTextColor={T.subText}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: T.subText }]}>Password</Text>
          <View style={[styles.inputRow, { borderBottomColor: T.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={T.subText} />
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="••••••••"
              placeholderTextColor={T.subText}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={T.subText} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/reset-password' as any)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={status === 'loading'} activeOpacity={0.85}>
          {status === 'loading' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>Log In</Text>
              <Ionicons name="log-in-outline" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: T.subText }]}>
          Don&apos;t have an account?{' '}
          <Text style={styles.footerLink} onPress={() => router.push('/sign-up' as any)}>
            Sign Up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 48 },
  header: { alignItems: 'center', gap: 12 },
  logoBox: { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { fontSize: 40, fontWeight: '900', color: COLORS.primary },
  appName: { fontSize: 34, fontWeight: '900', color: COLORS.primary, marginTop: 4 },
  tagline: { fontSize: 14, textAlign: 'center', maxWidth: 260, lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: 24, padding: 24, gap: 20, marginVertical: 32 },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', paddingHorizontal: 4, textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingHorizontal: 4, paddingVertical: 10, gap: 12 },
  input: { flex: 1, fontSize: 16, padding: 0 },
  forgotRow: { alignItems: 'flex-end' },
  forgotText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  submitButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
