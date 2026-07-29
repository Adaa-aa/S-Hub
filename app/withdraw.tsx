import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const AVAILABLE_BALANCE = 4250.0;
const FEE_RATE = 0; // TODO: replace with your real fee schedule

const PROVIDERS: { key: string; label: string; bg: string }[] = [
  { key: 'mtn', label: 'MTN', bg: '#FFCC08' },
  { key: 'vodafone', label: 'Vodafone', bg: COLORS.danger },
  { key: 'airteltigo', label: 'AirtelTigo', bg: '#0057B8' },
];

export default function WithdrawScreen() {
  const T = useThemeColors();
  const [provider, setProvider] = useState('mtn');
  const [phone, setPhone] = useState('');
  const [amountText, setAmountText] = useState('');

  const amount = parseFloat(amountText) || 0;
  const fee = useMemo(() => +(amount * FEE_RATE).toFixed(2), [amount]);
  const youReceive = Math.max(amount - fee, 0);

  const handleWithdrawMax = () => setAmountText(AVAILABLE_BALANCE.toFixed(2));

  const handleConfirm = () => {
    // TODO: POST withdrawal request to your API
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Withdraw Funds</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.balanceCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <Text style={[styles.balanceLabel, { color: T.subText }]}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceValue}>
            <Text style={{ color: COLORS.primary }}>GH₵</Text> {AVAILABLE_BALANCE.toFixed(2)}
          </Text>
          <View style={styles.verifiedRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        </View>

        <View>
          <Text style={[styles.sectionLabel, { color: T.text }]}>Select Provider</Text>
          <View style={styles.providerRow}>
            {PROVIDERS.map((p) => {
              const active = p.key === provider;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.providerCard,
                    { backgroundColor: T.card, borderColor: T.border },
                    active && { borderColor: COLORS.primary, borderWidth: 2 },
                  ]}
                  onPress={() => setProvider(p.key)}
                >
                  <View style={[styles.providerLogo, { backgroundColor: p.bg }]}>
                    <Text style={styles.providerLogoText}>{p.label.slice(0, 4).toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.providerLabel, { color: T.text }]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.sectionLabel, { color: T.text }]}>Phone Number</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Ionicons name="call-outline" size={18} color={T.subText} />
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="024 000 0000"
              placeholderTextColor={T.subText}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <Text style={[styles.helperText, { color: T.subText }]}>Enter the MoMo number for the withdrawal.</Text>
        </View>

        <View style={styles.field}>
          <Text style={[styles.sectionLabel, { color: T.text }]}>Withdrawal Amount</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Text style={styles.currencyPrefix}>GH₵</Text>
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="0.00"
              placeholderTextColor={T.subText}
              keyboardType="decimal-pad"
              value={amountText}
              onChangeText={setAmountText}
            />
          </View>
          <View style={styles.helperRow}>
            <Text style={[styles.helperText, { color: T.subText }]}>Available: GH₵ {AVAILABLE_BALANCE.toFixed(2)}</Text>
            <TouchableOpacity onPress={handleWithdrawMax}>
              <Text style={styles.maxLink}>Withdraw Max</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.feeBox, { backgroundColor: T.inputBg }]}>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabel, { color: T.subText }]}>Transaction Fee</Text>
            <Text style={[styles.feeValue, { color: T.subText }]}>GH₵ {fee.toFixed(2)}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeLabelBold, { color: T.text }]}>You will receive</Text>
            <Text style={[styles.feeValueBold, { color: T.text }]}>GH₵ {youReceive.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85} disabled={amount <= 0}>
          <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed-outline" size={14} color={T.subText} />
          <Text style={[styles.securityText, { color: T.subText }]}>Secure Bank-Level Encryption</Text>
        </View>
        <Text style={[styles.processingNote, { color: T.subText }]}>
          Processing may take up to 15 minutes depending on the network provider.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  avatarSmall: { width: 36, height: 36, borderRadius: 18 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  balanceCard: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 6 },
  balanceLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  balanceValue: { fontSize: 28, fontWeight: '900' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  verifiedText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  sectionLabel: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  providerRow: { flexDirection: 'row', gap: 10 },
  providerCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 8 },
  providerLogo: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  providerLogoText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  providerLabel: { fontSize: 12, fontWeight: '600' },
  field: { gap: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 14, height: 52, paddingHorizontal: 14 },
  currencyPrefix: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  input: { flex: 1, fontSize: 16, padding: 0 },
  helperText: { fontSize: 12 },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between' },
  maxLink: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  feeBox: { borderRadius: 16, padding: 14, gap: 8 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontSize: 13 },
  feeValue: { fontSize: 13 },
  feeLabelBold: { fontSize: 14, fontWeight: '800' },
  feeValueBold: { fontSize: 14, fontWeight: '800' },
  confirmButton: {
    height: 56, borderRadius: 16, backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  confirmButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 },
  securityText: { fontSize: 12, fontWeight: '600' },
  processingNote: { fontSize: 11, textAlign: 'center' },
});
