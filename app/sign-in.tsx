import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
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

// Dark, near-black header to match the reference (independent of light/dark theme toggle)
const HEADER_BG: [string, string] = ['#1B1F27', '#0C0E12'];

export default function LoginScreen() {
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const T = useThemeColors();

  const handleLogin = () => {
    if (role === 'worker') {
      router.replace('/worker-setup' as any);
    } else {
      router.replace('/(tabs)/home' as any);
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
          <Text style={styles.heading}>Go ahead and{'\n'}Log In to your account</Text>
          <Text style={styles.subheading}>Login to continue using the app.</Text>
        </LinearGradient>

        {/* ══ WHITE CARD — slides up and overlaps the header ══ */}
        <View style={[styles.card, { backgroundColor: T.card }]}>

          <View style={[styles.toggleWrap, { backgroundColor: T.inputBg }]}>
            <TouchableOpacity
              style={[styles.toggleBtn, role === 'customer' && [styles.toggleBtnActive, { backgroundColor: T.card }]]}
              onPress={() => setRole('customer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, { color: T.subText }, role === 'customer' && [styles.toggleTextActive, { color: T.text }]]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, role === 'worker' && [styles.toggleBtnActive, { backgroundColor: T.card }]]}
              onPress={() => setRole('worker')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, { color: T.subText }, role === 'worker' && [styles.toggleTextActive, { color: T.text }]]}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Email field with floating label */}
          <View style={styles.inputWrap}>
            <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
              <View style={[styles.iconBadge, { backgroundColor: T.card }]}>
                <FontAwesome5 name="envelope" size={14} color={COLORS.primary} />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={[styles.inputLabel, { color: T.subText }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="you@example.com"
                  placeholderTextColor={T.subText}
                  value={credential}
                  onChangeText={setCredential}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
          </View>

          {/* Password field with floating label */}
          <View style={styles.inputWrap}>
            <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
              <View style={[styles.iconBadge, { backgroundColor: T.card }]}>
                <FontAwesome5 name="lock" size={14} color={COLORS.primary} />
              </View>
              <View style={styles.inputTextCol}>
                <Text style={[styles.inputLabel, { color: T.subText }]}>Password</Text>
                <TextInput
                  style={[styles.input, { color: T.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={T.subText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity onPress={() => setShowPass(!showPass)} activeOpacity={0.7} hitSlop={8}>
                <Ionicons name={showPass ? 'eye' : 'eye-off-outline'} size={18} color={T.subText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember me + Forgot password */}
          <View style={styles.rememberRow}>
            <TouchableOpacity style={styles.rememberLeft} onPress={() => setRememberMe(!rememberMe)} activeOpacity={0.7}>
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={18}
                color={rememberMe ? COLORS.primary : T.subText}
              />
              <Text style={[styles.rememberText, { color: T.subText }]}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Gradient Login button */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} style={styles.loginBtnWrap}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
            <Text style={[styles.dividerText, { color: T.subText }]}>Or login with</Text>
            <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: T.card, borderColor: T.border }]} activeOpacity={0.8}>
              <AntDesign name="google" size={18} color="#EA4335" />
              <Text style={[styles.socialBtnText, { color: T.text }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: T.card, borderColor: T.border }]} activeOpacity={0.8}>
              <FontAwesome name="facebook" size={18} color="#1877F2" />
              <Text style={[styles.socialBtnText, { color: T.text }]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerRow} onPress={() => router.push('/sign-up' as any)} activeOpacity={0.7}>
            <Text style={[styles.registerText, { color: T.subText }]}>
              Don&apos;t have an account?{' '}
              <Text style={styles.registerLink}>Register</Text>
            </Text>
          </TouchableOpacity>
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

  /* Toggle */
  toggleWrap: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 4,
    marginBottom: 26,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: 'center',
  },
  toggleBtnActive: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    fontWeight: '700',
  },

  /* Inputs */
  inputWrap: {
    marginBottom: 14,
  },
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
  inputTextCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  input: {
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },

  /* Remember me / Forgot */
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 4,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 13,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* Login button */
  loginBtnWrap: {
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Social */
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 13,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* Register */
  registerRow: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
