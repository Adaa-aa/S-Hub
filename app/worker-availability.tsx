import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MY_PROFILE } from './worker-setup';
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

const FULL_DAY_NAMES: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

export default function WorkerAvailabilityScreen() {
  const T = useThemeColors();
  const [days, setDays] = useState(MY_PROFILE.availability.map(d => ({ ...d })));

  const toggleDay = (day: string) => {
    setDays(days.map(d => d.day === day ? { ...d, on: !d.on } : d));
  };

  const activeCount = days.filter(d => d.on).length;

  const handleSave = () => {
    MY_PROFILE.availability = days;
    Alert.alert('Saved', 'Your availability has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <RequireVerifiedWorker>
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={wms(22)} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Weekly Availability</Text>
        <View style={s.backBtn} />
      </View>

      <View style={s.pageInner}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.summaryCard, { backgroundColor: COLORS.primaryLight }]}>
          <Ionicons name="calendar-outline" size={wms(18)} color={COLORS.primary} />
          <Text style={[s.summaryText, { color: COLORS.primary }]}>
            You're available {activeCount} day{activeCount === 1 ? '' : 's'} a week
          </Text>
        </View>

        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
          {days.map((d, i) => (
            <View key={d.day}>
              {i > 0 && <View style={[s.divider, { backgroundColor: T.divider }]} />}
              <View style={s.dayRow}>
                <Text style={[s.dayName, { color: T.text }]}>{FULL_DAY_NAMES[d.day] ?? d.day}</Text>
                <Switch
                  value={d.on}
                  onValueChange={() => toggleDay(d.day)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: wvs(100) }} />
      </ScrollView>

      <View style={[s.footer, { backgroundColor: T.card, borderColor: T.border }]}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.saveBtn}
          >
            <Text style={s.saveBtnText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(14), paddingVertical: wvs(12) },
  backBtn: { width: ws(38), height: ws(38), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wms(16), fontWeight: '700', color: '#fff' },

  scroll: { padding: ws(16) },

  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: ws(10), borderRadius: ws(14), padding: ws(14), marginBottom: wvs(16) },
  summaryText: { fontSize: wms(13), fontWeight: '700' },

  card: { borderRadius: ws(16), borderWidth: ws(1), overflow: 'hidden' },
  divider: { height: wvs(1), marginHorizontal: ws(16) },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(16), paddingVertical: wvs(15) },
  dayName: { fontSize: wms(14), fontWeight: '600' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: ws(1), padding: ws(16), paddingBottom: wvs(28) },
  saveBtn: { borderRadius: ws(30), paddingVertical: wvs(15), alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: wms(15), fontWeight: '700' },
});