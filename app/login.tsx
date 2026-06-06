import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const PRIMARY = '#1B8B3A';
const MUTED = '#666';
const BORDER = '#E5E5E5';
const BG = '#F7F7F7';

export default function LoginScreen() {
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [role, setRole] = useState<'client' | 'worker'>('client');

    const handleSendOTP = () => {
        if (!phone) return;
        // Bypass OTP verification for development, go straight to home
        router.replace('/home');
    };

    const handleVerify = () => {
        if (!otp) return;
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
            >
                {/* Logo */}
                <View style={styles.logoBox}>
                    <View style={styles.logoIcon}>
                        <Text style={{ fontSize: 32 }}>🛠️</Text>
                    </View>
                    <Text style={styles.logoText}>SkillHub</Text>
                    <Text style={styles.logoSub}>Your local skilled worker marketplace</Text>
                </View>

                {step === 'form' ? (
                    <View style={styles.card}>

                        {/* Tabs */}
                        <View style={styles.tabs}>
                            <TouchableOpacity
                                style={[styles.tab, tab === 'login' && styles.tabActive]}
                                onPress={() => setTab('login')}
                            >
                                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                                    Login
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, tab === 'signup' && styles.tabActive]}
                                onPress={() => setTab('signup')}
                            >
                                <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign up name field */}
                        {tab === 'signup' && (
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
                        )}

                        {/* Phone */}
                        <View style={styles.inputBox}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.phoneRow}>
                                <View style={styles.countryCode}>
                                    <Text style={styles.countryCodeText}>🇬🇭 +233</Text>
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="024 000 0000"
                                    placeholderTextColor={MUTED}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        {/* Sign up role selection */}
                        {tab === 'signup' && (
                            <View style={styles.inputBox}>
                                <Text style={styles.inputLabel}>I want to</Text>
                                <View style={styles.roleRow}>
                                    <TouchableOpacity
                                        style={[styles.roleCard, role === 'client' && { borderColor: PRIMARY }]}
                                        onPress={() => setRole('client')}
                                    >
                                        <Text style={{ fontSize: 24, marginBottom: 6 }}>🔍</Text>
                                        <Text style={styles.roleLabel}>Find Workers</Text>
                                        <Text style={styles.roleSub}>I need a service</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleCard, role === 'worker' && { borderColor: PRIMARY }]}
                                        onPress={() => setRole('worker')}
                                    >
                                        <Text style={{ fontSize: 24, marginBottom: 6 }}>💼</Text>
                                        <Text style={styles.roleLabel}>Offer Services</Text>
                                        <Text style={styles.roleSub}>I am a worker</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* OTP Button */}
                        <TouchableOpacity
                            style={[styles.btn, !phone && styles.btnDisabled]}
                            onPress={handleSendOTP}
                            disabled={!phone}
                        >
                            <Text style={styles.btnText}>
                                {tab === 'login' ? 'Send OTP Code' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            By continuing you agree to our{' '}
                            <Text style={{ color: PRIMARY }}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={{ color: PRIMARY }}>Privacy Policy</Text>
                        </Text>

                    </View>
                ) : (

                    /* OTP Step */
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => setStep('form')}
                        >
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.otpTitle}>Enter OTP Code</Text>
                        <Text style={styles.otpSub}>
                            We sent a 6-digit code to{'\n'}
                            <Text style={{ fontWeight: '700', color: '#111' }}>
                                +233 {phone}
                            </Text>
                        </Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="- - - - - -"
                            placeholderTextColor={MUTED}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            textAlign="center"
                        />

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
                                <Text style={{ color: PRIMARY, fontWeight: '700' }}>Resend OTP</Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, backgroundColor: BG,
        alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20,
    },

    logoBox: { alignItems: 'center', marginBottom: 32 },
    logoIcon: {
        width: 72, height: 72, borderRadius: 20,
        backgroundColor: PRIMARY + '20',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: { fontSize: 28, fontWeight: '800', color: '#111' },
    logoSub: { fontSize: 13, color: MUTED, marginTop: 4 },

    card: {
        backgroundColor: '#fff', borderRadius: 20,
        padding: 24, width: '100%',
        shadowColor: '#000', shadowOpacity: 0.06,
        shadowRadius: 12, elevation: 4,
    },

    tabs: {
        flexDirection: 'row', backgroundColor: BG,
        borderRadius: 12, padding: 4, marginBottom: 24,
    },
    tab: {
        flex: 1, paddingVertical: 10,
        borderRadius: 10, alignItems: 'center',
    },
    tabActive: { backgroundColor: '#fff', elevation: 2 },
    tabText: { fontSize: 14, fontWeight: '500', color: MUTED },
    tabTextActive: { color: '#111', fontWeight: '700' },

    inputBox: { marginBottom: 18 },
    inputLabel: {
        fontSize: 13, fontWeight: '600',
        color: '#111', marginBottom: 8,
    },
    input: {
        borderWidth: 1, borderColor: BORDER,
        borderRadius: 12, padding: 14,
        fontSize: 15, color: '#111', backgroundColor: BG,
    },

    phoneRow: { flexDirection: 'row', gap: 10 },
    countryCode: {
        borderWidth: 1, borderColor: BORDER,
        borderRadius: 12, paddingHorizontal: 14,
        justifyContent: 'center', backgroundColor: BG,
    },
    countryCodeText: { fontSize: 14, fontWeight: '600', color: '#111' },
    phoneInput: {
        flex: 1, borderWidth: 1, borderColor: BORDER,
        borderRadius: 12, padding: 14,
        fontSize: 15, color: '#111', backgroundColor: BG,
    },

    roleRow: { flexDirection: 'row', gap: 12 },
    roleCard: {
        flex: 1, borderWidth: 1.5, borderColor: BORDER,
        borderRadius: 14, padding: 14, alignItems: 'center',
    },
    roleLabel: { fontSize: 13, fontWeight: '700', color: '#111' },
    roleSub: { fontSize: 11, color: MUTED, marginTop: 2 },

    btn: {
        backgroundColor: PRIMARY, borderRadius: 14,
        padding: 16, alignItems: 'center', marginTop: 8,
    },
    btnDisabled: { backgroundColor: '#ccc' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    termsText: {
        fontSize: 12, color: MUTED,
        textAlign: 'center', marginTop: 16, lineHeight: 18,
    },

    backBtn: { marginBottom: 20 },
    backText: { fontSize: 15, color: MUTED, fontWeight: '500' },
    otpTitle: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 8 },
    otpSub: { fontSize: 14, color: MUTED, marginBottom: 28, lineHeight: 22 },
    otpInput: {
        borderWidth: 2, borderColor: PRIMARY,
        borderRadius: 14, padding: 18,
        fontSize: 28, fontWeight: '700',
        letterSpacing: 12, marginBottom: 24,
        color: '#111',
    },
    resendBtn: { marginTop: 16, alignItems: 'center' },
    resendText: { fontSize: 13, color: MUTED },
});
