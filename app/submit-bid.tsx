import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const SERVICE_FEE_RATE = 0.1;
const ARRIVAL_OPTIONS = ['15 min', '30 min', '1 hr', '2 hr+'];

export default function SubmitBidScreen() {
  const T = useThemeColors();
  const params = useLocalSearchParams<{ requestId?: string }>();
  const [bidAmountText, setBidAmountText] = useState('');
  const [arrival, setArrival] = useState('30 min');
  const [note, setNote] = useState('');

  const bidAmount = parseFloat(bidAmountText) || 0;
  const serviceFee = useMemo(() => +(bidAmount * SERVICE_FEE_RATE).toFixed(2), [bidAmount]);

  const handleSubmit = () => {
    // TODO: POST bid to your API, referencing params.requestId
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: T.text }]}>Leaking kitchen tap</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={T.subText} />
              <Text style={[styles.locationText, { color: T.subText }]}>East Legon, Accra</Text>
            </View>
          </View>
          <View style={styles.verifiedPill}>
            <Ionicons name="shield-checkmark-outline" size={12} color={COLORS.primary} />
            <Text style={styles.verifiedPillText}>Verified</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
          <Text style={[styles.label, { color: T.subText }]}>YOUR BID AMOUNT</Text>
          <View style={[styles.inputBox, { backgroundColor: T.inputBg, borderColor: T.border }]}>
            <Text style={styles.currencyPrefix}>GH₵</Text>
            <TextInput
              style={[styles.input, { color: T.text }]}
              placeholder="0.00"
              placeholderTextColor={T.subText}
              keyboardType="decimal-pad"
              value={bidAmountText}
              onChangeText={setBidAmountText}
            />
          </View>

          <View style={[styles.suggestedBox, { backgroundColor: COLORS.accentLight }]}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.accentDark} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.suggestedTitle, { color: COLORS.accentDark }]}>Suggested range</Text>
              <Text style={[styles.suggestedBody, { color: T.text }]}>GH₵150 - GH₵250 for this job type.</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={[styles.label, { color: T.subText }]}>ESTIMATED ARRIVAL</Text>
          <View style={styles.arrivalRow}>
            {ARRIVAL_OPTIONS.map((opt) => {
              const active = opt === arrival;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.arrivalChip,
                    { backgroundColor: T.card, borderColor: T.border },
                    active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                  ]}
                  onPress={() => setArrival(opt)}
                >
                  <Text style={[styles.arrivalChipText, { color: T.text }, active && { color: '#fff' }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={[styles.label, { color: T.subText }]}>NOTE TO CUSTOMER (OPTIONAL)</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
            multiline
            placeholder="I have the tools ready and I'm just around the corner. I can fix this quickly for you…"
            placeholderTextColor={T.subText}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: T.card, borderTopColor: T.border }]}>
        <View style={styles.feeRow}>
          <Text style={[styles.feeLabel, { color: T.subText }]}>Service Fee (10%)</Text>
          <Text style={[styles.feeValue, { color: T.text }]}>GH₵{serviceFee.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85} disabled={bidAmount <= 0}>
          <Ionicons name="send" size={18} color="#fff" />
          <Text style={styles.submitButtonText}>Submit Bid</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  avatarSmall: { width: 36, height: 36, borderRadius: 18 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 13 },
  verifiedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
  },
  verifiedPillText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 14, height: 56, paddingHorizontal: 14 },
  currencyPrefix: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  input: { flex: 1, fontSize: 22, fontWeight: '700', padding: 0 },
  suggestedBox: { flexDirection: 'row', gap: 10, borderRadius: 14, padding: 12 },
  suggestedTitle: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
  suggestedBody: { fontSize: 13 },
  arrivalRow: { flexDirection: 'row', gap: 8 },
  arrivalChip: { flex: 1, borderWidth: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  arrivalChipText: { fontSize: 13, fontWeight: '700' },
  textArea: { minHeight: 120, borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14, textAlignVertical: 'top' },
  footer: { borderTopWidth: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, gap: 12 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontSize: 13 },
  feeValue: { fontSize: 14, fontWeight: '800' },
  submitButton: {
    height: 56, borderRadius: 16, backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
