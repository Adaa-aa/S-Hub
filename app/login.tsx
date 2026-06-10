import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'client' | 'worker'>('client');
    const [showPass, setShowPass] = useState(false);
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [otp, setOtp] = useState('');

    const handleContinue = () => {
        if (tab === 'login') {
            router.replace('/home');
        } else {
            setStep('otp');
        }
    };

    const handleVerify = () => {
        if (otp.length < 6) return;
        router.replace('/home');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                {/* ── LOGO ── */}
                <View style={styles.logoBox}>
                    <View style={styles.logoIcon}>
                        <Text style={{ fontSize: 34 }}>🛠️</Text>
                    </View>
                    <Text style={styles.logoText}>SkillHub</Text>
                    <Text style={styles.logoSub}>Your local skilled worker marketplace</Text>
                </View>

                {step === 'form' ? (
                    <View style={styles.card}>

                        {/* ── TABS (only shown after tapping Register) ── */}
                        {tab === 'signup' && (
                            <View style={styles.tabs}>
                                {/* Login tab — never active here since tab is already 'signup' */}
                                <TouchableOpacity
                                    style={styles.tab}
                                    onPress={() => setTab('login')}
                                >
                                    <Text style={styles.tabText}>
                                        Login
                                    </Text>
                                </TouchableOpacity>
                                {/* Sign Up tab — always active here */}
                                <TouchableOpacity
                                    style={[styles.tab, styles.tabActive]}
                                    onPress={() => setTab('signup')}
                                >
                                    <Text style={[styles.tabText, styles.tabTextActive]}>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ── SOCIAL BUTTONS ── */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <AntDesign name="google" size={18} color="#EA4335" />
                                <Text style={styles.socialBtnText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.socialBtn, styles.appleBtnBorder]}>
                                <AntDesign name="apple" size={18} color="#000" />
                                <Text style={styles.socialBtnText}>Apple</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ── DIVIDER ── */}
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* ── SIGNUP ONLY: Full Name ── */}
                        {tab === 'signup' && (
                            <View style={styles.inputBox}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <View style={styles.inputRow}>
                                    <FontAwesome name="user-o" size={16} color={COLORS.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Akosua Mensah"
                                        placeholderTextColor={COLORS.muted}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>
                        )}

                        {/* ── EMAIL / PHONE ── */}
                        <View style={styles.inputBox}>
                            <Text style={styles.inputLabel}>
                                {tab === 'login' ? 'Email or Phone' : 'Phone Number'}
                            </Text>
                            {tab === 'login' ? (
                                <View style={styles.inputRow}>
                                    <FontAwesome name="envelope-o" size={16} color={COLORS.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="email@example.com or 024..."
                                        placeholderTextColor={COLORS.muted}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            ) : (
                                <View style={styles.phoneRow}>
                                    <View style={styles.countryCode}>
                                        <Text style={styles.flag}>🇬🇭</Text>
                                        <Text style={styles.countryCodeText}>+233</Text>
                                    </View>
                                    <TextInput
                                        style={styles.phoneInput}
                                        placeholder="024 000 0000"
                                        placeholderTextColor={COLORS.muted}
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>
                            )}
                        </View>

                        {/* ── PASSWORD (login only) ── */}
                        {tab === 'login' && (
                            <View style={styles.inputBox}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.inputRow}>
                                    <FontAwesome name="lock" size={16} color={COLORS.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.muted}
                                        secureTextEntry={!showPass}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                        <FontAwesome
                                            name={showPass ? 'eye' : 'eye-slash'}
                                            size={16} color={COLORS.muted}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.forgotBtn}>
                                    <Text style={styles.forgotText}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ── SIGNUP ONLY: Role ── */}
                        {tab === 'signup' && (
                            <View style={styles.inputBox}>
                                <Text style={styles.inputLabel}>I am a</Text>
                                <View style={styles.roleRow}>
                                    <TouchableOpacity
                                        style={[styles.roleCard, role === 'client' && styles.roleActive]}
                                        onPress={() => setRole('client')}
                                    >
                                        <Text style={{ fontSize: 26, marginBottom: 6 }}>🔍</Text>
                                        <Text style={[styles.roleLabel, role === 'client' && styles.roleLabelActive]}>
                                            Customer
                                        </Text>
                                        <Text style={styles.roleSub}>I want to hire workers</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.roleCard, role === 'worker' && styles.roleActive]}
                                        onPress={() => setRole('worker')}
                                    >
                                        <Text style={{ fontSize: 26, marginBottom: 6 }}>💼</Text>
                                        <Text style={[styles.roleLabel, role === 'worker' && styles.roleLabelActive]}>
                                            Worker
                                        </Text>
                                        <Text style={styles.roleSub}>I want to offer my services</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* ── MAIN BUTTON ── */}
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                tab === 'login' ? !email && styles.btnDisabled : !phone && styles.btnDisabled,
                            ]}
                            onPress={handleContinue}
                            disabled={tab === 'login' ? !email : !phone}
                        >
                            <Text style={styles.btnText}>
                                {tab === 'login' ? 'Login' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        {/* ── SWITCH TAB LINK ── */}
                        <TouchableOpacity
                            style={styles.switchRow}
                            onPress={() => setTab(tab === 'login' ? 'signup' : 'login')}
                        >
                            <Text style={styles.switchText}>
                                {tab === 'login'
                                    ? "Don't have an account? "
                                    : 'Already have an account? '}
                                <Text style={styles.switchLink}>
                                    {tab === 'login' ? 'Register' : 'Login'}
                                </Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                ) : (

                    /* ── OTP STEP ── */
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => setStep('form')}
                        >
                            <AntDesign name="arrow-left" size={18} color={COLORS.muted} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        {/* Icon */}
                        <View style={styles.otpIconBox}>
                            <Text style={{ fontSize: 40 }}>📱</Text>
                        </View>

                        <Text style={styles.otpTitle}>Enter OTP Code</Text>
                        <Text style={styles.otpSub}>
                            We sent a 6-digit code to{'\n'}
                            <Text style={{ fontWeight: '700', color: COLORS.text }}>
                                +233 {phone}
                            </Text>
                        </Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="- - - - - -"
                            placeholderTextColor={COLORS.muted}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            textAlign="center"
                        />

                        {/* OTP progress dots */}
                        <View style={styles.otpDots}>
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <View
                                    key={i}
                                    style={[
                                        styles.otpDot,
                                        i < otp.length && styles.otpDotFilled,
                                    ]}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, otp.length < 6 && styles.btnDisabled]}
                            onPress={handleVerify}
                            disabled={otp.length < 6}
                        >
                            <Text style={styles.btnText}>Verify & Continue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.resendBtn}>
                            <Text style={styles.resendText}>
                                Didn't receive it?{' '}
                                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>
                                    Resend OTP
                                </Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Terms */}
                <Text style={styles.termsText}>
                    By continuing you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, backgroundColor: COLORS.background,
        alignItems: 'center', paddingVertical: 60,
        paddingHorizontal: 20,
    },

    /* Logo */
    logoBox: { alignItems: 'center', marginBottom: 28 },
    logoIcon: {
        width: 76, height: 76, borderRadius: 22,
        backgroundColor: COLORS.primary + '18',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1, borderColor: COLORS.primary + '30',
    },
    logoText: { fontSize: 28, fontWeight: '800', color: COLORS.text },
    logoSub: { fontSize: 13, color: COLORS.muted, marginTop: 4 },

    /* Card */
    card: {
        backgroundColor: COLORS.card, borderRadius: 20,
        padding: 22, width: '100%',
        shadowColor: '#000', shadowOpacity: 0.07,
        shadowRadius: 14, elevation: 4,
        marginBottom: 16,
    },

    /* Tabs */
    tabs: {
        flexDirection: 'row', backgroundColor: COLORS.bgGrey,
        borderRadius: 12, padding: 4, marginBottom: 20,
    },
    tab: {
        flex: 1, paddingVertical: 10,
        borderRadius: 10, alignItems: 'center',
    },
    tabActive: { backgroundColor: COLORS.card, elevation: 2 },
    tabText: { fontSize: 14, fontWeight: '500', color: COLORS.muted },
    tabTextActive: { color: COLORS.text, fontWeight: '700' },

    /* Social buttons */
    socialRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
    socialBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        borderWidth: 1.5, borderColor: COLORS.border,
        borderRadius: 12, paddingVertical: 12,
        backgroundColor: COLORS.card,
    },
    appleBtnBorder: { borderColor: '#000' },
    socialBtnText: {
        fontSize: 14, fontWeight: '600', color: COLORS.text,
    },

    /* Divider */
    dividerRow: {
        flexDirection: 'row', alignItems: 'center',
        gap: 10, marginBottom: 20,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    dividerText: { fontSize: 12, color: COLORS.muted, fontWeight: '500' },

    /* Inputs */
    inputBox: { marginBottom: 16 },
    inputLabel: {
        fontSize: 13, fontWeight: '600',
        color: COLORS.text, marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, paddingHorizontal: 14,
        paddingVertical: 12, backgroundColor: COLORS.bgGrey, gap: 10,
    },
    inputIcon: { width: 18 },
    input: {
        flex: 1, fontSize: 14, color: COLORS.text,
    },

    phoneRow: { flexDirection: 'row', gap: 10 },
    countryCode: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, paddingHorizontal: 12,
        backgroundColor: COLORS.bgGrey,
    },
    flag: { fontSize: 18 },
    countryCodeText: {
        fontSize: 14, fontWeight: '600', color: COLORS.text,
    },
    phoneInput: {
        flex: 1, borderWidth: 1, borderColor: COLORS.border,
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 14, color: COLORS.text, backgroundColor: COLORS.bgGrey,
    },

    forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
    forgotText: {
        fontSize: 13, color: COLORS.primary, fontWeight: '600',
    },

    /* Role selection */
    roleRow: { flexDirection: 'row', gap: 12 },
    roleCard: {
        flex: 1, borderWidth: 1.5, borderColor: COLORS.border,
        borderRadius: 14, padding: 14, alignItems: 'center',
        backgroundColor: COLORS.bgGrey,
    },
    roleActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    roleLabel: {
        fontSize: 13, fontWeight: '700', color: COLORS.text,
    },
    roleLabelActive: { color: COLORS.primary },
    roleSub: {
        fontSize: 11, color: COLORS.muted,
        marginTop: 2, textAlign: 'center',
    },

    /* Button */
    btn: {
        backgroundColor: COLORS.primary, borderRadius: 14,
        paddingVertical: 15, alignItems: 'center', marginTop: 6,
    },
    btnDisabled: { backgroundColor: COLORS.muted },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    /* Switch tab */
    switchRow: { alignItems: 'center', marginTop: 16 },
    switchText: { fontSize: 13, color: COLORS.muted },
    switchLink: { color: COLORS.primary, fontWeight: '700' },

    /* OTP */
    backBtn: {
        flexDirection: 'row', alignItems: 'center',
        gap: 6, marginBottom: 20,
    },
    backText: { fontSize: 14, color: COLORS.muted, fontWeight: '500' },
    otpIconBox: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'center', marginBottom: 16,
    },
    otpTitle: {
        fontSize: 22, fontWeight: '800',
        color: COLORS.text, marginBottom: 8, textAlign: 'center',
    },
    otpSub: {
        fontSize: 14, color: COLORS.muted,
        marginBottom: 24, lineHeight: 22, textAlign: 'center',
    },
    otpInput: {
        borderWidth: 2, borderColor: COLORS.primary,
        borderRadius: 14, paddingVertical: 16,
        fontSize: 26, fontWeight: '700',
        letterSpacing: 14, color: COLORS.text,
        backgroundColor: COLORS.bgGrey,
    },
    otpDots: {
        flexDirection: 'row', justifyContent: 'center',
        gap: 8, marginTop: 12, marginBottom: 24,
    },
    otpDot: {
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: COLORS.border,
    },
    otpDotFilled: { backgroundColor: COLORS.primary },

    resendBtn: { alignItems: 'center', marginTop: 16 },
    resendText: { fontSize: 13, color: COLORS.muted },

    /* Terms */
    termsText: {
        fontSize: 12, color: COLORS.muted,
        textAlign: 'center', lineHeight: 18, paddingHorizontal: 10,
    },
    termsLink: { color: COLORS.primary, fontWeight: '600' },
});