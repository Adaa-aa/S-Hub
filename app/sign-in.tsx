import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { signInWithOAuthProvider } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { s, vs, ms } from '@/lib/scaling';

type Role = 'user' | 'customer';

export default function SignInScreen() {
  const T = useThemeColors();
  const [role, setRole] = useState<Role>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setError('');
    setOauthLoading(provider);
    const result = await signInWithOAuthProvider(provider);
    setOauthLoading(null);
    if (!result.success) {
      setError(result.error ?? 'Authentication failed.');
      return;
    }
    router.replace({ pathname: '/home', params: { role } } as any);
  };

  const handleLogin = async () => {
    setError('');
    if (!identifier.trim() || !password) {
      setError('Enter your email/phone and password.');
      return;
    }

    setStatus('loading');
    const isEmail = identifier.includes('@');
    const { error: signInError } = await supabase.auth.signInWithPassword(
      isEmail
        ? { email: identifier.trim(), password }
        : { phone: identifier.trim(), password }
    );
    setStatus('idle');

    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace({ pathname: '/home', params: { role } } as any);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: T.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={ms(24)} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={{ width: s(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: T.text }]}>Welcome Back</Text>
          <Text style={[styles.heroSubtitle, { color: T.subText }]}>
            Log in to continue finding trusted workers or earning on Waker.
          </Text>
        </View>

        <View style={[styles.roleToggleRow, { backgroundColor: T.inputBg }]}>
          <TouchableOpacity
            style={[styles.roleToggleButton, role === 'user' && [styles.roleToggleButtonActive, { backgroundColor: T.card }]]}
            onPress={() => setRole('user')}
          >
            <Ionicons name="person-outline" size={ms(16)} color={role === 'user' ? COLORS.primary : T.subText} />
            <Text style={[styles.roleToggleText, { color: T.subText }, role === 'user' && { color: COLORS.primary }]}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleToggleButton, role === 'customer' && [styles.roleToggleButtonActive, { backgroundColor: T.card }]]}
            onPress={() => setRole('customer')}
          >
            <Ionicons name="briefcase-outline" size={ms(16)} color={role === 'customer' ? COLORS.primary : T.subText} />
            <Text style={[styles.roleToggleText, { color: T.subText }, role === 'customer' && { color: COLORS.primary }]}>Customer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: T.subText }]}>Email or Phone Number</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Ionicons name="person-outline" size={ms(20)} color={T.subText} />
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
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Ionicons name="lock-closed-outline" size={ms(20)} color={T.subText} />
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="••••••••"
              placeholderTextColor={T.subText}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={ms(20)} color={T.subText} />
            </TouchableOpacity>
          </View>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/reset-password' as any)}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleLogin}
          disabled={status === 'loading'}
          activeOpacity={0.85}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>Log In</Text>
              <Ionicons name="log-in-outline" size={ms(20)} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.oauthSection}>
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
            <Text style={[styles.dividerText, { color: T.subText }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
          </View>

          <View style={styles.oauthRow}>
            <TouchableOpacity
              style={[styles.oauthButton, { backgroundColor: T.inputBg, borderColor: T.border }]}
              onPress={() => handleOAuth('google')}
              disabled={oauthLoading !== null}
              activeOpacity={0.85}
            >
              {oauthLoading === 'google' ? (
                <ActivityIndicator size="small" color={T.text} />
              ) : (
                <Ionicons name="logo-google" size={ms(22)} color={T.text} />
              )}
              <Text style={[styles.oauthText, { color: T.text }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.oauthButton, { backgroundColor: T.inputBg, borderColor: T.border }]}
              onPress={() => handleOAuth('apple')}
              disabled={oauthLoading !== null}
              activeOpacity={0.85}
            >
              {oauthLoading === 'apple' ? (
                <ActivityIndicator size="small" color={T.text} />
              ) : (
                <Ionicons name="logo-apple" size={ms(22)} color={T.text} />
              )}
              <Text style={[styles.oauthText, { color: T.text }]}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: T.subText }]}>
            Don't have an account?{' '}
            <Text style={styles.footerLink} onPress={() => router.push('/sign-up' as any)}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: s(20), paddingVertical: vs(12) },
  logo: { fontSize: ms(22), fontWeight: '900', color: COLORS.primary },
  scrollContent: { paddingHorizontal: s(20), paddingBottom: vs(40), gap: vs(20), alignItems: 'center' },
  hero: { width: '100%', maxWidth: s(544), marginBottom: vs(4), alignItems: 'center' },
  heroTitle: { fontSize: ms(26), fontWeight: '800', marginBottom: vs(6) },
  heroSubtitle: { fontSize: ms(14), lineHeight: ms(20), textAlign: 'center' },
  roleToggleRow: { width: '100%', maxWidth: s(544), flexDirection: 'row', borderRadius: s(24), padding: s(4), marginBottom: vs(8) },
  roleToggleButton: { flex: 1, flexDirection: 'row', paddingVertical: vs(10), borderRadius: s(20), alignItems: 'center', justifyContent: 'center', gap: s(6) },
  roleToggleButtonActive: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  roleToggleText: { fontSize: ms(15), fontWeight: '700' },
  field: { width: '100%', maxWidth: s(544), gap: vs(6) },
  label: { fontSize: ms(12), fontWeight: '600', marginLeft: s(4), textTransform: 'uppercase' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: s(16), borderWidth: s(1), height: vs(56), paddingHorizontal: s(14), gap: s(10) },
  input: { flex: 1, fontSize: ms(16), padding: 0 },
  forgotRow: { width: '100%', maxWidth: s(544), alignItems: 'flex-end' },
  forgotText: { fontSize: ms(13), fontWeight: '700', color: COLORS.primary },
  errorText: { color: '#DC2626', fontSize: ms(13), textAlign: 'center' },
  submitButton: {
    width: '100%',
    maxWidth: s(544),
    height: vs(56),
    borderRadius: s(16),
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    marginTop: vs(4),
  },
  submitText: { fontSize: ms(16), fontWeight: '700', color: '#fff' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  dividerLine: { flex: 1, height: s(1) },
  dividerText: { fontSize: ms(12), fontWeight: '600' },
  oauthRow: { flexDirection: 'row', gap: s(12) },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
    height: vs(52),
    borderRadius: s(16),
    borderWidth: s(1),
  },
  oauthText: { fontSize: ms(15), fontWeight: '600' },
  oauthSection: { width: '100%', maxWidth: s(544), gap: vs(16), marginTop: vs(8) },
  footer: { alignItems: 'center', width: '100%', maxWidth: s(544), marginTop: vs(12) },
  footerText: { fontSize: ms(14) },
  footerLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});