import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
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
import { COLORS } from '../constants/theme';
import { useThemeColors } from '../context/ThemeContext';

const PRIMARY = COLORS.primary;

// Dark, near-black header to match the reference (independent of light/dark theme toggle)
const HEADER_BG: [string, string] = ['#1B1F27', '#0C0E12'];

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'worker'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const T = useThemeColors();

  const canSubmit = !!(name && email && password);

  const handleSignUp = () => {
    if (!canSubmit) return;
    if (role === 'worker') {
      router.replace('/become-worker');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#0C0E12' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0E12" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ══ DARK HEADER ══ */}
        <LinearGradient colors={HEADER_BG} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.heading}>Go ahead and{'\n'}set up your account</Text>
          <Text style={styles.subheading}>Sign up to enjoy the best managing experience</Text>
        </LinearGradient>

        {/* ══ WHITE CARD — slides up and overlaps the header ══ */}
        <View style={[styles.card, { backgroundColor: T.card }]}>

          {/* Role selector */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, { backgroundColor: T.inputBg, borderColor: T.border }, role === 'client' && [styles.roleCardActive, { borderColor: PRIMARY }]]}
              onPress={() => setRole('client')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleEmoji}>🔍</Text>
              <Text style={[styles.roleLabel, { color: T.text }]}>Find Workers</Text>
              <Text style={[styles.roleSub, { color: T.subText }]}>I need a service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleCard, { backgroundColor: T.inputBg, borderColor: T.border }, role === 'worker' && [styles.roleCardActive, { borderColor: PRIMARY }]]}
              onPress={() => setRole('worker')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleEmoji}>💼</Text>
              <Text style={[styles.roleLabel, { color: T.text }]}>Offer Services</Text>
              <Text style={[styles.roleSub, { color: T.subText }]}>I am a worker</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputWrap}>
            <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
              <View style={[styles.iconBadge, { backgroundColor: T.card }]}>
                <FontAwesome5 name="user" size={14} color={PRIMARY} />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={[styles.inputLabel, { color: T.subText }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={T.subText}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputWrap}>
            <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
              <View style={[styles.iconBadge, { backgroundColor: T.card }]}>
                <FontAwesome5 name="envelope" size={14} color={PRIMARY} />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={[styles.inputLabel, { color: T.subText }]}>Email or Phone</Text>
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="you@example.com"
                  placeholderTextColor={T.subText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
              <View style={[styles.iconBadge, { backgroundColor: T.card }]}>
                <FontAwesome5 name="lock" size={14} color={PRIMARY} />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={[styles.inputLabel, { color: T.subText }]}>Password</Text>
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={T.subText}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7} hitSlop={8}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off-outline'} size={18} color={T.subText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gradient Create Account button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={!canSubmit}
            activeOpacity={0.85}
            style={styles.btnWrap}
          >
            <LinearGradient
              colors={canSubmit ? [PRIMARY, COLORS.primaryDark] : ['#C8E6D0', '#B9DCC3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: T.subText }]}>
            By registering you agree to our{' '}
            <Text style={{ color: PRIMARY, fontWeight: '600' }}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={{ color: PRIMARY, fontWeight: '600' }}>Privacy Policy</Text>
          </Text>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: T.subText }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  /* Dark header */
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 90,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginLeft: -4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 19,
  },
  heading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },

  /* Card overlaps header via negative margin */
  card: {
    marginTop: -56,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    minHeight: 560,
  },

  /* Role selector */
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  roleCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  roleCardActive: {
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  roleEmoji: { fontSize: 22, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: '700' },
  roleSub: { fontSize: 11, marginTop: 2 },

  /* Inputs */
  inputWrap: { marginBottom: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTextCol: { flex: 1 },
  inputLabel: { fontSize: 11, marginBottom: 2 },
  input: { fontSize: 15, fontWeight: '600', padding: 0 },

  /* Button */
  btnWrap: {
    borderRadius: 30,
    marginTop: 6,
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 18,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});
