import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type NearbyRequest = {
  id: string;
  title: string;
  distanceKm: number;
  budgetLow: number;
  budgetHigh: number;
  postedBy: string;
  tag?: 'verified' | 'urgent' | 'top_client';
};

const REQUESTS: NearbyRequest[] = [
  { id: '1', title: 'Leaking kitchen tap', distanceKm: 2.5, budgetLow: 150, budgetHigh: 250, postedBy: 'Ama A.', tag: 'verified' },
  { id: '2', title: 'Fuse box replacement', distanceKm: 4.8, budgetLow: 400, budgetHigh: 600, postedBy: 'Kwame B.', tag: 'urgent' },
  { id: '3', title: 'Living room painting', distanceKm: 1.2, budgetLow: 800, budgetHigh: 1200, postedBy: 'Yaw O.', tag: 'top_client' },
];

const TAG_STYLES: Record<NonNullable<NearbyRequest['tag']>, { label: string; icon: string; color: string }> = {
  verified: { label: 'Verified', icon: 'checkmark-circle', color: COLORS.primary },
  urgent: { label: 'Urgent', icon: 'time', color: COLORS.danger },
  top_client: { label: 'Top Client', icon: 'star', color: COLORS.star },
};

export default function WorkerDashboardScreen() {
  const T = useThemeColors();
  const [online, setOnline] = useState(true);

  const handleAccept = (requestId: string) => {
    router.push({ pathname: '/submit-bid', params: { requestId } } as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Ionicons name="menu" size={24} color={T.text} />
        <Text style={styles.logo}>Waker</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.statusCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <View>
            <Text style={[styles.statusTitle, { color: T.text }]}>Welcome back, Kofi</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: online ? COLORS.primary : T.subText }]} />
              <Text style={[styles.statusText, { color: T.subText }]}>
                Your Status: {online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false: T.border, true: COLORS.primaryLight }}
            thumbColor={online ? COLORS.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[styles.statLabel, { color: T.subText }]}>Today&apos;s Earnings</Text>
            <Text style={[styles.statValue, { color: T.text }]}>GH₵ 250.00</Text>
            <Text style={styles.statDelta}>+12%</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[styles.statLabel, { color: T.subText }]}>Jobs Done</Text>
            <Text style={[styles.statValue, { color: T.text }]}>28</Text>
            <Text style={[styles.statDelta, { color: T.subText }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[styles.statLabel, { color: T.subText }]}>Avg Rating</Text>
            <Text style={[styles.statValue, { color: T.text }]}>4.9</Text>
            <Text style={[styles.statDelta, { color: COLORS.accentDark }]}>Elite</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: T.text }]}>Nearby Requests</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View Map</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12 }}>
          {REQUESTS.map((req) => {
            const tag = req.tag ? TAG_STYLES[req.tag] : null;
            return (
              <View key={req.id} style={[styles.reqCard, { backgroundColor: T.card, borderColor: T.border }]}>
                <View style={styles.reqTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reqTitle, { color: T.text }]}>{req.title}</Text>
                    <View style={styles.reqMetaRow}>
                      <Text style={[styles.reqMeta, { color: T.subText }]}>{req.distanceKm} km away</Text>
                      {tag && (
                        <View style={styles.reqTagRow}>
                          <Ionicons name={tag.icon as any} size={12} color={tag.color} />
                          <Text style={[styles.reqTagText, { color: tag.color }]}>{tag.label}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.budgetLabel, { color: T.subText }]}>Budget</Text>
                    <Text style={styles.budgetValue}>
                      GH₵{req.budgetLow}-{req.budgetHigh}
                    </Text>
                  </View>
                </View>
                <View style={[styles.reqBottomRow, { borderTopColor: T.border }]}>
                  <Text style={[styles.postedByText, { color: T.subText }]}>Posted by {req.postedBy}</Text>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(req.id)} activeOpacity={0.85}>
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/worker-dashboard', active: true },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'wallet-outline', iconFocused: 'wallet', label: 'Wallet', route: '/earnings', active: false },
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110, gap: 16 },
  statusCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: 20, padding: 16,
  },
  statusTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 12, gap: 4 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statDelta: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  reqCard: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 10 },
  reqTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  reqTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  reqMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reqMeta: { fontSize: 12 },
  reqTagRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reqTagText: { fontSize: 11, fontWeight: '700' },
  budgetLabel: { fontSize: 11 },
  budgetValue: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  reqBottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, paddingTop: 10,
  },
  postedByText: { fontSize: 12 },
  acceptButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  acceptButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },
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
