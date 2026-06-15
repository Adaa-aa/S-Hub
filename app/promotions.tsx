import { COLORS } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';

const PROMOS = [
  { code: 'WELCOME50', discount: 'GH₵ 50 off', description: 'First job posted', expires: 'Dec 31, 2025', used: false },
  { code: 'VAKER10',   discount: '10% off',     description: 'Any service booking', expires: 'Sep 30, 2025', used: false },
  { code: 'KUMASI20',  discount: 'GH₵ 20 off',  description: 'Kumasi area jobs',    expires: 'Jun 01, 2025', used: true  },
];

export default function PromotionsScreen() {
  const [code, setCode] = useState('');

  const applyCode = () => {
    if (!code.trim()) return;
    const found = PROMOS.find(p => p.code === code.toUpperCase() && !p.used);
    if (found) {
      Alert.alert('🎉 Code Applied!', `${found.discount} has been added to your account.`);
      setCode('');
    } else {
      Alert.alert('Invalid Code', 'The promo code you entered is invalid or has already been used.');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={s.title}>Promotions</Text>
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Enter promo code */}
          <View style={s.inputCard}>
            <MaterialCommunityIcons name="tag-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={s.codeInput}
              placeholder="Enter promo code"
              placeholderTextColor={COLORS.muted}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={applyCode}
            />
            <TouchableOpacity style={s.applyBtn} onPress={applyCode} activeOpacity={0.85}>
              <Text style={s.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Active promos */}
          <Text style={s.sectionLabel}>Your Promotions</Text>
          {PROMOS.map((promo) => (
            <View key={promo.code} style={[s.promoCard, promo.used && s.promoCardUsed]}>
              <View style={s.promoLeft}>
                <View style={[s.promoIconWrap, { backgroundColor: promo.used ? '#F5F5F5' : COLORS.primary + '18' }]}>
                  <MaterialCommunityIcons name="ticket-percent-outline" size={22} color={promo.used ? COLORS.muted : COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.promoTop}>
                    <Text style={[s.promoCode, promo.used && s.textUsed]}>{promo.code}</Text>
                    {promo.used && <View style={s.usedBadge}><Text style={s.usedBadgeText}>Used</Text></View>}
                  </View>
                  <Text style={s.promoDiscount}>{promo.discount}</Text>
                  <Text style={s.promoDesc}>{promo.description}</Text>
                  <Text style={s.promoExpiry}>Expires {promo.expires}</Text>
                </View>
              </View>
              {!promo.used && (
                <TouchableOpacity
                  style={s.promoUseBtn}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Use Code', `${promo.code} will be applied to your next job.`)}
                >
                  <Text style={s.promoUseBtnText}>Use</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  scroll: { padding: 16, paddingBottom: 40 },
  inputCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 24 },
  codeInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A', letterSpacing: 1 },
  applyBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  applyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 12, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  promoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E8E8E8', flexDirection: 'row', alignItems: 'center', gap: 12 },
  promoCardUsed: { opacity: 0.6 },
  promoLeft: { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  promoIconWrap: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  promoTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  promoCode: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5 },
  textUsed: { color: COLORS.muted },
  usedBadge: { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  usedBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.muted },
  promoDiscount: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  promoDesc: { fontSize: 12, color: COLORS.muted },
  promoExpiry: { fontSize: 11, color: '#BBBBBB', marginTop: 4 },
  promoUseBtn: { backgroundColor: COLORS.primary + '18', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  promoUseBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});
