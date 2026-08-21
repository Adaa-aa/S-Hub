import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

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
    <RequireVerifiedWorker>
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={wms(24)} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>AdwumaGo</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <View style={styles.pageInner}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: T.text }]}>Leaking kitchen tap</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={wms(14)} color={T.subText} />
              <Text style={[styles.locationText, { color: T.subText }]}>East Legon, Accra</Text>
            </View>
          </View>
          <View style={styles.verifiedPill}>
            <Ionicons name="shield-checkmark-outline" size={wms(12)} color={COLORS.primary} />
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
            <Ionicons name="information-circle-outline" size={wms(18)} color={COLORS.accentDark} />
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
          <Ionicons name="send" size={wms(18)} color="#fff" />
          <Text style={styles.submitButtonText}>Submit Bid</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(20), paddingVertical: wvs(12) },
  logo: { fontSize: wms(20), fontWeight: '900', color: COLORS.primary },
  avatarSmall: { width: ws(36), height: ws(36), borderRadius: ws(18) },
  scrollContent: { paddingHorizontal: ws(20), paddingBottom: wvs(40), gap: ws(20) },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: wms(22), fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: ws(4), marginTop: wvs(4) },
  locationText: { fontSize: wms(13) },
  verifiedPill: {
    flexDirection: 'row', alignItems: 'center', gap: ws(4),
    backgroundColor: COLORS.primaryLight, paddingHorizontal: ws(10), paddingVertical: wvs(5), borderRadius: ws(999),
  },
  verifiedPillText: { fontSize: wms(11), fontWeight: '700', color: COLORS.primary },
  card: { borderWidth: ws(1), borderRadius: ws(20), padding: ws(16), gap: ws(12) },
  label: { fontSize: wms(11), fontWeight: '700', letterSpacing: wms(0.5), marginBottom: wvs(8) },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: ws(10), borderWidth: ws(1), borderRadius: ws(14), height: wvs(56), paddingHorizontal: ws(14) },
  currencyPrefix: { fontSize: wms(18), fontWeight: '800', color: COLORS.primary },
  input: { flex: 1, fontSize: wms(22), fontWeight: '700', padding: 0 },
  suggestedBox: { flexDirection: 'row', gap: ws(10), borderRadius: ws(14), padding: ws(12) },
  suggestedTitle: { fontSize: wms(13), fontWeight: '800', marginBottom: wvs(2) },
  suggestedBody: { fontSize: wms(13) },
  arrivalRow: { flexDirection: 'row', gap: ws(8) },
  arrivalChip: { flex: 1, borderWidth: ws(1), borderRadius: ws(14), paddingVertical: wvs(12), alignItems: 'center' },
  arrivalChipText: { fontSize: wms(13), fontWeight: '700' },
  textArea: { minHeight: wvs(120), borderWidth: ws(1), borderRadius: ws(16), padding: ws(14), fontSize: wms(14), textAlignVertical: 'top' },
  footer: { borderTopWidth: ws(1), paddingHorizontal: ws(20), paddingTop: wvs(14), paddingBottom: wvs(24), gap: ws(12) },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  feeLabel: { fontSize: wms(13) },
  feeValue: { fontSize: wms(14), fontWeight: '800' },
  submitButton: {
    height: wvs(56), borderRadius: ws(16), backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ws(8),
  },
  submitButtonText: { fontSize: wms(16), fontWeight: '700', color: '#fff' },
});