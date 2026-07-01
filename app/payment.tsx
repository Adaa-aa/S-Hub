import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const METHODS = [
  { id: 1, type: 'momo',  label: 'MTN Mobile Money', detail: '024 *** *890', icon: '📱', default: true  },
  { id: 2, type: 'card',  label: 'Visa Card',         detail: '**** **** **** 4242', icon: '💳', default: false },
  { id: 3, type: 'vodafone', label: 'Vodafone Cash', detail: '050 *** *120', icon: '📲', default: false },
];

export default function PaymentScreen() {
  const [methods, setMethods] = useState(METHODS);
  const T = useThemeColors();

  const setDefault = (id: number) => {
    setMethods(m => m.map(x => ({ ...x, default: x.id === id })));
  };

  const remove = (id: number) => {
    Alert.alert('Remove', 'Remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setMethods(m => m.filter(x => x.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />
      <View style={[s.header, { backgroundColor: T.header, borderColor: T.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: T.text }]}>Payment Methods</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.sectionLabel, { color: T.subText }]}>Saved Methods</Text>
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
          {methods.map((m, i) => (
            <View key={m.id}>
              {i > 0 && <View style={[s.divider, { backgroundColor: T.divider }]} />}
              <View style={s.methodRow}>
                <Text style={s.methodIcon}>{m.icon}</Text>
                <View style={s.methodInfo}>
                  <View style={s.methodTop}>
                    <Text style={[s.methodLabel, { color: T.text }]}>{m.label}</Text>
                    {m.default && (
                      <View style={s.defaultBadge}>
                        <Text style={s.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[s.methodDetail, { color: T.subText }]}>{m.detail}</Text>
                </View>
                <View style={s.methodActions}>
                  {!m.default && (
                    <TouchableOpacity onPress={() => setDefault(m.id)} style={s.actionBtn}>
                      <Text style={s.actionLink}>Set default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => remove(m.id)} style={s.actionBtn}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={[s.sectionLabel, { color: T.subText }]}>Add New</Text>
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
          {[
            { label: 'MTN Mobile Money', icon: '📱' },
            { label: 'Vodafone Cash',    icon: '📲' },
            { label: 'AirtelTigo Money', icon: '📶' },
            { label: 'Visa / Mastercard', icon: '💳' },
          ].map((opt, i) => (
            <View key={opt.label}>
              {i > 0 && <View style={[s.divider, { backgroundColor: T.divider }]} />}
              <TouchableOpacity style={s.addRow} activeOpacity={0.7} onPress={() => Alert.alert('Add Payment', `${opt.label} integration coming soon.`)}>
                <Text style={s.methodIcon}>{opt.icon}</Text>
                <Text style={[s.addLabel, { color: T.text }]}>{opt.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#BBB" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={s.infoBox}>
          <MaterialCommunityIcons name="shield-lock-outline" size={16} color={COLORS.primary} />
          <Text style={s.infoText}>Your payment details are encrypted and securely stored.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { borderRadius: 16, marginBottom: 20, borderWidth: 1, overflow: 'hidden' },
  divider: { height: 1, marginLeft: 56 },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  methodIcon: { fontSize: 26, width: 36, textAlign: 'center' },
  methodInfo: { flex: 1 },
  methodTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  methodLabel: { fontSize: 14, fontWeight: '600' },
  methodDetail: { fontSize: 12 },
  defaultBadge: { backgroundColor: COLORS.primary + '18', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  defaultBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  methodActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionBtn: { padding: 4 },
  actionLink: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  addRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  addLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14 },
  infoText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '500', lineHeight: 18 },
});
