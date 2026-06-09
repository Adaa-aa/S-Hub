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

const PRIMARY = '#1B8B3A';
const MUTED = '#888';
const BORDER = '#E8E8E8';
const BG = '#F9F9F9';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'worker'>('client');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) return;
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={{ fontSize: 22 }}>🛠️</Text>
          </View>
          <Text style={styles.logoText}>SkillHub</Text>
        </View>

        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>Join thousands of workers and clients</Text>

        {/* Role selector */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'client' && styles.roleCardActive]}
            onPress={() => setRole('client')}
          >
            <Text style={styles.roleEmoji}>🔍</Text>
            <Text style={styles.roleLabel}>Find Workers</Text>
            <Text style={styles.roleSub}>I need a service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleCard, role === 'worker' && styles.roleCardActive]}
            onPress={() => setRole('worker')}
          >
            <Text style={styles.roleEmoji}>💼</Text>
            <Text style={styles.roleLabel}>Offer Services</Text>
            <Text style={styles.roleSub}>I am a worker</Text>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Akosua Mensah"
            placeholderTextColor={MUTED}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Email or Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={MUTED}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={MUTED}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.btn, (!name || !email || !password) && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={!name || !email || !password}
        >
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By registering you agree to our{' '}
          <Text style={{ color: PRIMARY }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: PRIMARY }}>Privacy Policy</Text>
        </Text>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
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
