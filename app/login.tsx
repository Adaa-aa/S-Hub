import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from 'react-native';

const PRIMARY = '#1B8B3A';
const MUTED = '#888';
const BORDER = '#E8E8E8';
const BG = '#F9F9F9';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email || !password) return;
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
                {/* Logo */}
                <View style={styles.logoRow}>
                    <View style={styles.logoIcon}>
                        <Text style={{ fontSize: 22 }}>🛠️</Text>
                    </View>
                    <Text style={styles.logoText}>SkillHub</Text>
                </View>

                {/* Heading */}
                <Text style={styles.heading}>Welcome back 👋</Text>
                <Text style={styles.subheading}>Login to continue</Text>

                {/* Email / Phone */}
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

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.btn, (!email || !password) && styles.btnDisabled]}
                    onPress={handleLogin}
                    disabled={!email || !password}
                >
                    <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Text style={styles.socialIcon}>G</Text>
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}>
                        <Text style={styles.socialIcon}></Text>
                        <Text style={styles.socialText}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Register Link */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.registerLink}>Register</Text>
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
    logoText: {
        fontSize: 22, fontWeight: '800', color: '#111',
    },

    heading: {
        fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 6,
    },
    subheading: {
        fontSize: 15, color: MUTED, marginBottom: 32,
    },

    inputBox: { marginBottom: 20 },
    inputLabel: {
        fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8,
    },
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
    passwordInput: {
        flex: 1, paddingVertical: 14,
        fontSize: 15, color: '#111',
    },
    eyeBtn: { padding: 4 },
    eyeText: { fontSize: 18 },

    forgotBtn: { alignSelf: 'flex-end', marginBottom: 28 },
    forgotText: { fontSize: 13, color: PRIMARY, fontWeight: '600' },

    btn: {
        backgroundColor: PRIMARY, borderRadius: 14,
        paddingVertical: 16, alignItems: 'center', marginBottom: 28,
    },
    btnDisabled: { backgroundColor: '#C8E6D0' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    dividerRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
    dividerText: { fontSize: 13, color: MUTED },

    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 36 },
    socialBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        borderWidth: 1, borderColor: BORDER,
        borderRadius: 14, paddingVertical: 13,
        backgroundColor: '#fff',
    },
    socialIcon: { fontSize: 16, fontWeight: '700', color: '#111' },
    socialText: { fontSize: 14, fontWeight: '600', color: '#111' },

    registerRow: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    registerText: { fontSize: 14, color: MUTED },
    registerLink: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
});
