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
import { supabase } from '@/lib/supabase';

type Mode = 'phone' | 'email';

export default function SignUpScreen() {
  const T = useThemeColors();
  const [mode, setMode] = useState<Mode>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!fullName.trim() || !password) {
      setError('Please fill in your name and password.');
      return;
    }
    if (mode === 'email' && !email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (mode === 'phone' && !phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setSubmitting(true);

    if (mode === 'email') {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      router.push({
        pathname: '/otp-verification',
        params: { identifier: email.trim(), mode: 'email' },
      } as any);
    } else {
      const digitsOnly = phone.replace(/\D/g, '').replace(/^0/, '');
      const fullPhone = `+233${digitsOnly}`;
      const { error: signUpError } = await supabase.auth.signUp({
        phone: fullPhone,
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      setSubmitting(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      router.push({
        pathname: '/otp-verification',
        params: { identifier: fullPhone, mode: 'phone' },
      } as any);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: T.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: T.text }]}>Join the Community</Text>
          <Text style={[styles.heroSubtitle, { color: T.subText }]}>
            Find reliable help or start earning as a trusted worker.
          </Text>
        </View>

        <View style={[styles.toggleRow, { backgroundColor: T.inputBg }]}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'phone' && [styles.toggleButtonActive, { backgroundColor: T.card }]]}
            onPress={() => setMode('phone')}
          >
            <Text style={[styles.toggleText, { color: T.subText }, mode === 'phone' && { color: COLORS.primary }]}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'email' && [styles.toggleButtonActive, { backgroundColor: T.card }]]}
            onPress={() => setMode('email')}
          >
            <Text style={[styles.toggleText, { color: T.subText }, mode === 'email' && { color: COLORS.primary }]}>Email</Text>
          </TouchableOpacity>
        </View>

        {mode === 'phone' ? (
          <View style={styles.field}>
            <Text style={[styles.label, { color: T.subText }]}>Phone Number</Text>
            <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
              <View style={[styles.countryPrefix, { borderRightColor: T.border }]}>
                <View style={styles.flagChip} />
                <Text style={[styles.prefixText, { color: T.text }]}>+233</Text>
              </View>
              <TextInput
                style={[styles.input, { color: T.text }]}
                placeholder="50 000 0000"
                placeholderTextColor={T.subText}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>
        ) : (
          <View style={styles.field}>
            <Text style={[styles.label, { color: T.subText }]}>Email Address</Text>
            <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
              <Ionicons name="mail-outline" size={20} color={T.subText} />
              <TextInput
                style={[styles.input, { color: T.text }]}
                placeholder="kofi@example.com"
                placeholderTextColor={T.subText}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        )}

        <View style={styles.field}>
          <Text style={[styles.label, { color: T.subText }]}>Full Name</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Ionicons name="person-outline" size={20} color={T.subText} />
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="Kofi Mensah"
              placeholderTextColor={T.subText}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: T.subText }]}>Password</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
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

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed((v) => !v)}>
          <Ionicons
            name={agreed ? 'checkbox' : 'square-outline'}
            size={18}
            color={agreed ? COLORS.primary : T.subText}
          />
          <Text style={[styles.termsText, { color: T.subText }]}>
            By signing up, I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, !agreed && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!agreed || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>Sign Up</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: T.subText }]}>
            Already have an account?{' '}
            <Text style={styles.footerLink} onPress={() => router.replace('/sign-in' as any)}>
              Log In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  hero: { marginBottom: 4 },
  heroTitle: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, lineHeight: 20 },
  toggleRow: { flexDirection: 'row', borderRadius: 24, padding: 4, marginBottom: 8 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  toggleButtonActive: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  toggleText: { fontSize: 15, fontWeight: '700' },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', marginLeft: 4, textTransform: 'uppercase' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, height: 56, paddingHorizontal: 14, gap: 10 },
  countryPrefix: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 10, borderRightWidth: 1, height: 32 },
  flagChip: { width: 20, height: 14, borderRadius: 2, backgroundColor: COLORS.primary },
  prefixText: { fontSize: 14, fontWeight: '600' },
  input: { flex: 1, fontSize: 16, padding: 0 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  termsText: { fontSize: 12, flex: 1, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: '700' },
  errorText: { color: '#DC2626', fontSize: 13, textAlign: 'center' },
  submitButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  footer: { alignItems: 'center', marginTop: 12 },
  footerText: { fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
