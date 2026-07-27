import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 59;

export default function OtpVerificationScreen() {
  const T = useThemeColors();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(RESEND_SECONDS);
    // TODO: call your resend-OTP endpoint
  };

  const handleVerify = () => {
    // TODO: verify code with your API
    router.replace('/sign-in' as any);
  };

  const formattedTime = `(00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft})`;

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.intro}>
          <Text style={[styles.title, { color: T.text }]}>Verify Phone Number</Text>
          <Text style={[styles.subtitle, { color: T.subText }]}>
            We&apos;ve sent a 6-digit verification code to{' '}
            <Text style={[styles.bold, { color: T.text }]}>+233 24 567 8901</Text>. Please enter it below.
          </Text>
        </View>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputRefs.current[i] = ref)}
              style={[styles.otpInput, { backgroundColor: T.inputBg, borderBottomColor: T.border, color: T.text }]}
              value={d}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
            />
          ))}
        </View>

        <View style={styles.resendBlock}>
          <Text style={[styles.resendLabel, { color: T.subText }]}>Didn&apos;t receive the code?</Text>
          <TouchableOpacity onPress={handleResend} disabled={timeLeft > 0}>
            <Text style={[styles.resendButton, timeLeft > 0 && { color: T.subText }]}>
              Resend Code {timeLeft > 0 ? formattedTime : ''}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} activeOpacity={0.85}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>

        <View style={[styles.securityNote, { backgroundColor: T.inputBg, borderColor: T.border }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.securityText, { color: T.subText }]}>
            Your security is our priority. Waker uses bank-grade encryption to protect your data.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 24 },
  intro: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  bold: { fontWeight: '700' },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    borderBottomWidth: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  resendBlock: { alignItems: 'center', gap: 6, marginBottom: 28 },
  resendLabel: { fontSize: 13 },
  resendButton: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  verifyButton: { minHeight: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  verifyText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  securityNote: { marginTop: 28, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  securityText: { fontSize: 12, textAlign: 'center', lineHeight: 17 },
});
