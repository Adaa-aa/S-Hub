import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
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
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Weekly Availability</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.summaryCard, { backgroundColor: COLORS.primaryLight }]}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
          <Text style={[s.summaryText, { color: COLORS.primary }]}>
            You&apos;re available {activeCount} day{activeCount === 1 ? '' : 's'} a week
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
                  trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },

  scroll: { padding: 16 },

  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, padding: 14, marginBottom: 16 },
  summaryText: { fontSize: 13, fontWeight: '700' },

  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  divider: { height: 1, marginHorizontal: 16 },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15 },
  dayName: { fontSize: 14, fontWeight: '600' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, padding: 16, paddingBottom: 28 },
  saveBtn: { borderRadius: 30, paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
