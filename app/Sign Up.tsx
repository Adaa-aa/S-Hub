import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useThemeColors } from '../context/ThemeContext';

const PRIMARY = '#1B8B3A';
const MUTED = '#888';
const BORDER = '#E8E8E8';
const BG = '#F9F9F9';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'worker'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const T = useThemeColors();

  const handleSignUp = () => {
    if (!name || !email || !password) return;
    if (role === 'worker') {
      router.replace('/become-worker');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.card }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: T.card }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.logoRow}>
          <View style={[styles.logoIcon, { backgroundColor: PRIMARY + '18' }]}>
            <Text style={{ fontSize: 22 }}>🛠️</Text>
          </View>
          <Text style={[styles.logoText, { color: T.text }]}>Vaker</Text>
        </View>

        <Text style={[styles.heading, { color: T.text }]}>Create your account</Text>
        <Text style={[styles.subheading, { color: T.subText }]}>Join thousands of workers and clients</Text>

        <View style={styles.roleRow}>
          <TouchableOpacity style={[styles.roleCard, { backgroundColor: T.inputBg, borderColor: T.border }, role === 'client' && styles.roleCardActive]} onPress={() => setRole('client')}>
            <Text style={styles.roleEmoji}>🔍</Text>
            <Text style={[styles.roleLabel, { color: T.text }]}>Find Workers</Text>
            <Text style={[styles.roleSub, { color: T.subText }]}>I need a service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleCard, { backgroundColor: T.inputBg, borderColor: T.border }, role === 'worker' && styles.roleCardActive]} onPress={() => setRole('worker')}>
            <Text style={styles.roleEmoji}>💼</Text>
            <Text style={[styles.roleLabel, { color: T.text }]}>Offer Services</Text>
            <Text style={[styles.roleSub, { color: T.subText }]}>I am a worker</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputLabel, { color: T.subText }]}>Full Name</Text>
          <TextInput style={[styles.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]} placeholder="e.g. Enter your Full Name" placeholderTextColor={T.subText} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputLabel, { color: T.subText }]}>Email or Phone</Text>
          <TextInput style={[styles.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]} placeholder="e.g. Enter your Phone Number or Email" placeholderTextColor={T.subText} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputBox}>
          <Text style={[styles.inputLabel, { color: T.subText }]}>Password</Text>
          <View style={[styles.passwordRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <TextInput style={[styles.passwordInput, { color: T.text }]} placeholder="Enter your Password" placeholderTextColor={T.subText} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.btn, (!name || !email || !password) && styles.btnDisabled]} onPress={handleRegister} disabled={!name || !email || !password}>
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: T.subText }]}>
          By registering you agree to our{' '}
          <Text style={{ color: PRIMARY }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: PRIMARY }}>Privacy Policy</Text>
        </Text>

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: T.subText }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 36,
  },
  logoIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: PRIMARY + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontWeight: '800', color: '#111' },

  heading: { fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 6 },
  subheading: { fontSize: 15, color: MUTED, marginBottom: 28 },

  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleCard: {
    flex: 1, borderWidth: 1.5, borderColor: BORDER,
    borderRadius: 14, padding: 14, alignItems: 'center',
    backgroundColor: BG,
  },
  roleCardActive: { borderColor: PRIMARY, backgroundColor: PRIMARY + '0D' },
  roleEmoji: { fontSize: 24, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: '700', color: '#111' },
  roleSub: { fontSize: 11, color: MUTED, marginTop: 2 },

  inputBox: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#111', backgroundColor: BG,
  },

  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 14, backgroundColor: BG,
    paddingHorizontal: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#111' },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 18 },

  btn: {
    backgroundColor: PRIMARY, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  btnDisabled: { backgroundColor: '#C8E6D0' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  termsText: {
    fontSize: 12, color: MUTED,
    textAlign: 'center', marginBottom: 28, lineHeight: 18,
  },

  loginRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  loginText: { fontSize: 14, color: MUTED },
  loginLink: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});
