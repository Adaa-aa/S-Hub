import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen() {
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const T = useThemeColors();

  const handleLogin = () => {
    router.replace('/(tabs)/home' as any);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.card }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.card} />

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: T.card }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>

        <Text style={[styles.heading, { color: T.text }]}>Welcome back! 👋</Text>
        <Text style={[styles.subheading, { color: T.subText }]}>Login to continue</Text>

        <View style={[styles.toggleWrap, { backgroundColor: T.inputBg }]}>
          <TouchableOpacity style={[styles.toggleBtn, role === 'customer' && styles.toggleBtnActive]} onPress={() => setRole('customer')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, { color: T.subText }, role === 'customer' && styles.toggleTextActive]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, role === 'worker' && styles.toggleBtnActive]} onPress={() => setRole('worker')} activeOpacity={0.8}>
            <Text style={[styles.toggleText, { color: T.subText }, role === 'worker' && styles.toggleTextActive]}>Worker</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrap}>
          <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
            <FontAwesome5 name="phone-alt" size={15} color={T.subText} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: T.text }]} placeholder="Phone number or email" placeholderTextColor={T.subText} value={credential} onChangeText={setCredential} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>
        </View>

        <View style={styles.inputWrap}>
          <View style={[styles.inputRow, { backgroundColor: T.inputBg }]}>
            <FontAwesome5 name="lock" size={15} color={T.subText} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: T.text }]} placeholder="Password" placeholderTextColor={T.subText} value={password} onChangeText={setPassword} secureTextEntry={!showPass} autoCapitalize="none" />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} activeOpacity={0.7}>
              <Ionicons name={showPass ? 'eye' : 'eye-off-outline'} size={18} color={T.subText} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
          <Text style={[styles.dividerText, { color: T.subText }]}>or continue with</Text>
          <View style={[styles.dividerLine, { backgroundColor: T.border }]} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: T.card, borderColor: T.border }]} activeOpacity={0.8}>
            <AntDesign name="google" size={18} color="#EA4335" />
            <Text style={[styles.socialBtnText, { color: T.text }]}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.appleSocialBtn, { backgroundColor: T.card, borderColor: T.border }]} activeOpacity={0.8}>
            <AntDesign name="apple" size={18} color={T.text} />
            <Text style={[styles.socialBtnText, { color: T.text }]}>Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerRow} onPress={() => router.push('/register' as any)} activeOpacity={0.7}>
          <Text style={[styles.registerText, { color: T.subText }]}>
            Don&apos;t have an account?{' '}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },

  /* Back */
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    marginLeft: -4,
  },

  /* Heading */
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 28,
  },

  /* Toggle */
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    padding: 4,
    marginBottom: 28,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  /* Inputs */
  inputWrap: {
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputIcon: {
    width: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  /* Forgot */
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* Login button */
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.muted,
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
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#fff',
  },
  appleSocialBtn: {
    borderColor: '#CCCCCC',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  /* Register */
  registerRow: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});