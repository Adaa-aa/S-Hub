import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const ACTIVITY = [
  { day: 'Mon', value: 62, color: COLORS.primary },
  { day: 'Tue', value: 34, color: COLORS.accent },
  { day: 'Wed', value: 78, color: COLORS.primary },
  { day: 'Thu', value: 28, color: COLORS.accent },
  { day: 'Fri', value: 100, color: COLORS.primary },
  { day: 'Sat', value: 45, color: COLORS.accent },
  { day: 'Sun', value: 20, color: COLORS.accent },
];

export default function EarningsScreen() {
  const T = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
        <Text style={styles.logo}>Earnings</Text>
        <TouchableOpacity style={[styles.switchRoleBtn, { backgroundColor: T.inputBg }]}>
          <Text style={[styles.switchRoleText, { color: T.text }]}>Switch Role</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.balanceCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <Text style={[styles.balanceLabel, { color: T.subText }]}>TOTAL BALANCE</Text>
          <Text style={styles.balanceValue}>
            <Text style={{ color: COLORS.primary }}>GH₵</Text> 4,850.00
          </Text>
          <View style={styles.deltaRow}>
            <Ionicons name="trending-up" size={14} color={COLORS.primary} />
            <Text style={styles.deltaText}>+12.5% vs last month</Text>
          </View>
        </View>

        <View style={[styles.jobsCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <View style={[styles.jobsIconWrap, { backgroundColor: COLORS.accentLight }]}>
            <Ionicons name="ribbon-outline" size={22} color={COLORS.accentDark} />
          </View>
          <Text style={[styles.jobsLabel, { color: T.subText }]}>Jobs Completed</Text>
          <Text style={[styles.jobsValue, { color: T.text }]}>28</Text>
        </View>

        <View style={[styles.activityCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: T.text }]}>7-Day Activity</Text>
            <Text style={[styles.activitySubtitle, { color: T.subText }]}>Past Week</Text>
          </View>
          <View style={styles.barsRow}>
            {ACTIVITY.map((a) => (
              <View key={a.day} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: `${a.value}%`, backgroundColor: a.color }]} />
                </View>
                <Text style={[styles.barLabel, { color: T.subText }]}>{a.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[styles.summaryLabel, { color: T.subText }]}>Weekly</Text>
            <Text style={[styles.summaryValue, { color: T.text }]}>GH₵ 1,420</Text>
            <Text style={styles.summaryDeltaUp}>↑ 5%</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[styles.summaryLabel, { color: T.subText }]}>Monthly</Text>
            <Text style={[styles.summaryValue, { color: T.text }]}>GH₵ 5,800</Text>
            <Text style={styles.summaryDeltaDown}>↓ 2%</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.withdrawButton} onPress={() => router.push('/withdraw' as any)} activeOpacity={0.85}>
          <Ionicons name="wallet-outline" size={20} color="#fff" />
          <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
        </TouchableOpacity>

        <Text style={[styles.lastWithdrawal, { color: T.subText }]}>
          Last withdrawal: 12 Oct 2023 • GH₵ 1,200.00
        </Text>
      </ScrollView>

      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/worker-dashboard', active: false },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'wallet-outline', iconFocused: 'wallet', label: 'Wallet', route: '/earnings', active: true },
          { icon: 'person-outline', iconFocused: 'person', label: 'Profile', route: '/profile', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
            <Ionicons name={(tab.active ? tab.iconFocused : tab.icon) as any} size={22} color={tab.active ? COLORS.primary : T.subText} />
            <Text style={[styles.navLabel, { color: T.subText }, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  avatarSmall: { width: 36, height: 36, borderRadius: 18 },
  switchRoleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  switchRoleText: { fontSize: 12, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, gap: 16 },
  balanceCard: { borderWidth: 1, borderRadius: 20, padding: 20, gap: 8 },
  balanceLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  balanceValue: { fontSize: 30, fontWeight: '900' },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deltaText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  jobsCard: { borderWidth: 1, borderRadius: 20, padding: 20, alignItems: 'center', gap: 6 },
  jobsIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  jobsLabel: { fontSize: 13 },
  jobsValue: { fontSize: 24, fontWeight: '800' },
  activityCard: { borderWidth: 1, borderRadius: 20, padding: 20 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
  activityTitle: { fontSize: 16, fontWeight: '800' },
  activitySubtitle: { fontSize: 12 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 140, alignItems: 'flex-end' },
  barCol: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: 18, height: '85%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, marginTop: 8 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 17, fontWeight: '800' },
  summaryDeltaUp: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  summaryDeltaDown: { fontSize: 11, fontWeight: '700', color: COLORS.danger },
  withdrawButton: {
    height: 56, borderRadius: 16, backgroundColor: COLORS.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  withdrawButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  lastWithdrawal: { fontSize: 12, textAlign: 'center' },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, flexDirection: 'row', alignItems: 'center',
    paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
});
