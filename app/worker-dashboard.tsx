import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import WorkerNav from '@/components/WorkerNav';
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

type NearbyRequest = {
  id: string;
  title: string;
  distanceKm: number;
  budgetLow: number;
  budgetHigh: number;
  timeAgo: string;
  urgent?: boolean;
};

const REQUESTS: NearbyRequest[] = [
  { id: '1', title: 'Leaking kitchen tap', distanceKm: 2.5, budgetLow: 150, budgetHigh: 250, timeAgo: '5 min ago' },
  { id: '2', title: 'Fuse box replacement', distanceKm: 4.8, budgetLow: 400, budgetHigh: 600, timeAgo: '12 min ago', urgent: true },
  { id: '3', title: 'Living room painting', distanceKm: 1.2, budgetLow: 800, budgetHigh: 1200, timeAgo: '20 min ago' },
];

export default function WorkerDashboardScreen() {
  const T = useThemeColors();
  const [online, setOnline] = useState(true);

  const handleAccept = (requestId: string) => {
    router.push({ pathname: '/submit-bid', params: { requestId } } as any);
  };

  return (
    <RequireVerifiedWorker>
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.pageInner}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarSmall, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={styles.avatarInitials}>KM</Text>
          </View>
          <View>
            <Text style={[styles.greeting, { color: T.subText }]}>Good afternoon</Text>
            <Text style={[styles.userName, { color: T.text }]}>Kofi Mensah</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.notifBtn, { backgroundColor: T.inputBg }]}>
          <Ionicons name="notifications-outline" size={wms(19)} color={T.text} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* ── Online status ── */}
      <View style={styles.statusRow}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusDot, { backgroundColor: online ? '#22C55E' : T.subText }]} />
          <Text style={[styles.statusText, { color: T.text }]}>
            {online ? "You're online" : "You're offline"}
          </Text>
        </View>
        <Switch
          value={online}
          onValueChange={setOnline}
          trackColor={{ false: T.border, true: COLORS.primaryLight }}
          thumbColor={online ? COLORS.primary : '#ccc'}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Quick Stats ── */}
        <View style={[styles.statsStrip, { backgroundColor: T.card, borderColor: T.border }]}>
          {[
            { label: 'Today', value: 'GH₵ 250' },
            { label: 'Jobs Done', value: '28' },
            { label: 'Rating', value: '4.9 ★' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={[styles.statCol, i < arr.length - 1 && [styles.statBorder, { borderColor: T.border }]]}>
              <Text style={[styles.statValue, { color: T.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: T.subText }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Nearby Requests ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: T.text }]}>Nearby Requests</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requestsList}>
          {REQUESTS.map((req) => (
            <View key={req.id} style={[styles.reqCard, { backgroundColor: T.card, borderColor: T.border }]}>
              <View style={styles.reqTop}>
                <Text style={[styles.reqTitle, { color: T.text }]} numberOfLines={1}>{req.title}</Text>
                {req.urgent && (
                  <View style={styles.urgentPill}>
                    <Text style={styles.urgentText}>Urgent</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.reqMeta, { color: T.subText }]}>
                {req.distanceKm} km away · {req.timeAgo}
              </Text>

              <View style={styles.reqBottom}>
                <Text style={styles.budgetValue}>GH₵ {req.budgetLow}–{req.budgetHigh}</Text>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAccept(req.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptBtnText}>Place Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      </View>

      <WorkerNav active="home" />
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: ws(20), paddingTop: wvs(6), paddingBottom: wvs(10),
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: ws(12) },
  avatarSmall: {
    width: ws(42), height: ws(42), borderRadius: ws(21),
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: wms(15), fontWeight: '800', color: COLORS.primary },
  greeting: { fontSize: wms(11.5), fontWeight: '500' },
  userName: { fontSize: wms(16), fontWeight: '700' },
  notifBtn: {
    width: ws(38), height: ws(38), borderRadius: ws(19),
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: wvs(9), right: ws(10),
    width: ws(6), height: ws(6), borderRadius: ws(3),
    backgroundColor: COLORS.danger,
  },

  /* Status row */
  statusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: ws(20), paddingBottom: wvs(12),
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: ws(8) },
  statusDot: { width: ws(8), height: ws(8), borderRadius: ws(4) },
  statusText: { fontSize: wms(13.5), fontWeight: '600' },

  /* Scroll */
  scroll: { paddingHorizontal: ws(20), paddingBottom: wvs(100), gap: wvs(20) },

  /* Stats */
  statsStrip: {
    flexDirection: 'row', borderWidth: 1, borderRadius: ws(16),
  },
  statCol: { flex: 1, alignItems: 'center', paddingVertical: wvs(14) },
  statBorder: { borderRightWidth: 1 },
  statValue: { fontSize: wms(15), fontWeight: '800', marginBottom: wvs(2) },
  statLabel: { fontSize: wms(10.5), fontWeight: '500' },

  /* Section */
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontSize: wms(16), fontWeight: '800' },
  seeAll: { fontSize: wms(12.5), fontWeight: '600', color: COLORS.primary },

  /* Requests */
  requestsList: { gap: wvs(10), marginTop: wvs(-8) },
  reqCard: {
    borderWidth: 1, borderRadius: ws(16), padding: ws(14), gap: wvs(4),
  },
  reqTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: ws(8) },
  reqTitle: { flex: 1, fontSize: wms(14.5), fontWeight: '700' },
  urgentPill: {
    backgroundColor: COLORS.dangerLight, borderRadius: ws(20),
    paddingHorizontal: ws(8), paddingVertical: wvs(3),
  },
  urgentText: { fontSize: wms(10), fontWeight: '700', color: COLORS.danger },
  reqMeta: { fontSize: wms(12) },
  reqBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: wvs(8),
  },
  budgetValue: { fontSize: wms(14.5), fontWeight: '800', color: COLORS.primary },
  acceptBtn: {
    backgroundColor: COLORS.primary, borderRadius: ws(10),
    paddingHorizontal: ws(16), paddingVertical: wvs(9),
  },
  acceptBtnText: { fontSize: wms(12.5), fontWeight: '700', color: '#fff' },
});
