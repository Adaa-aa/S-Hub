import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type Step = 1 | 2 | 'success';

export default function ResetPasswordScreen() {
  const T = useThemeColors();
  const [step, setStep] = useState<Step>(1);
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = () => {
    // TODO: call your send-reset-code API
    setStep(2);
  };

  const handleResetPassword = () => {
    // TODO: call your reset-password API, validate newPassword === confirmPassword
    setStep('success');
  };

  return (
    <ScrollView
      style={{ backgroundColor: T.bg }}
      contentContainerStyle={styles.container}
    >
      <StatusBar barStyle={T.statusBar} />
      <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
        {step === 1 && (
          <View>
            <View style={styles.stepHeader}>
              <Text style={[styles.title, { color: T.text }]}>Forgot Password?</Text>
              <Text style={[styles.subtitle, { color: T.subText }]}>
                Enter your registered phone number or email and we&apos;ll send you a code to reset your password.
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: T.subText }]}>Phone or Email</Text>
              <View style={[styles.inputRow, { borderBottomColor: T.border }]}>
                <Ionicons name="mail-outline" size={20} color={T.subText} />
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="e.g. hello@waker.gh"
                  placeholderTextColor={T.subText}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSendCode} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Send Reset Code</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: T.subText }]}>
                Remembered your password?{' '}
                <Text style={styles.footerLink} onPress={() => router.replace('/sign-in' as any)}>
                  Log In
                </Text>
              </Text>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.primary} />
              <Text style={styles.verifiedText}>CODE VERIFIED</Text>
            </View>
            <View style={styles.stepHeader}>
              <Text style={[styles.title, { color: T.text }]}>New Password</Text>
              <Text style={[styles.subtitle, { color: T.subText }]}>
                Please choose a strong password with at least 8 characters.
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: T.subText }]}>New Password</Text>
              <View style={[styles.inputRow, { borderBottomColor: T.border }]}>
                <Ionicons name="lock-open-outline" size={20} color={T.subText} />
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={T.subText}
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={T.subText} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: T.subText }]}>Confirm Password</Text>
              <View style={[styles.inputRow, { borderBottomColor: T.border }]}>
                <Ionicons name="refresh-outline" size={20} color={T.subText} />
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={T.subText}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backRow} onPress={() => setStep(1)}>
              <Ionicons name="arrow-undo-outline" size={16} color={T.subText} />
              <Text style={[styles.backText, { color: T.subText }]}>Change email/phone</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'success' && (
          <View style={styles.successBlock}>
            <View style={[styles.successIconWrap, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="checkmark-circle" size={48} color={COLORS.primary} />
            </View>
            <Text style={[styles.title, { color: T.text }]}>Success!</Text>
            <Text style={[styles.subtitle, { color: T.subText, marginBottom: 24 }]}>
              Your password has been reset successfully. You can now log in with your new credentials.
            </Text>
            <TouchableOpacity style={styles.darkButton} onPress={() => router.replace('/sign-in' as any)} activeOpacity={0.85}>
              <Text style={styles.darkButtonText}>Proceed to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 48, justifyContent: 'center' },
  card: { borderWidth: 1, borderRadius: 24, padding: 24 },
  stepHeader: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  field: { marginBottom: 20, gap: 6 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, paddingBottom: 8 },
  input: { flex: 1, fontSize: 16, padding: 0 },
  primaryButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  footerRow: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: '700' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  verifiedText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' },
  backRow: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  backText: { fontSize: 13 },
  successBlock: { alignItems: 'center', paddingVertical: 20 },
  successIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  darkButton: { width: '100%', minHeight: 56, borderRadius: 16, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center' },
  darkButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
