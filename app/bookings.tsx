import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type Status = 'ongoing' | 'upcoming' | 'completed' | 'cancelled';
type Filter = 'all' | 'upcoming' | 'completed';

type Booking = {
  id: string;
  service: string;
  worker: string;
  icon: string;
  status: Status;
  date: string;
  price: string;
};

const BOOKINGS: Booking[] = [
  { id: '1', service: 'Electrical Repair', worker: 'Kwame Appiah', icon: 'flash-outline', status: 'ongoing', date: 'Oct 24, 2023', price: 'GH₵ 250' },
  { id: '2', service: 'Pipe Leakage', worker: 'Abena Mensah', icon: 'water-outline', status: 'upcoming', date: 'Oct 26, 2023', price: 'GH₵ 180' },
  { id: '3', service: 'House Cleaning', worker: 'Kojo Boateng', icon: 'sparkles-outline', status: 'completed', date: 'Oct 20, 2023', price: 'GH₵ 400' },
  { id: '4', service: 'Wall Painting', worker: 'Efua Asare', icon: 'color-palette-outline', status: 'cancelled', date: 'Oct 18, 2023', price: 'GH₵ 1,200' },
];

export default function BookingsScreen() {
  const T = useThemeColors();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return BOOKINGS;
    if (filter === 'upcoming') return BOOKINGS.filter((b) => b.status === 'upcoming' || b.status === 'ongoing');
    return BOOKINGS.filter((b) => b.status === 'completed');
  }, [filter]);

  const statusStyle = (status: Status) => {
    switch (status) {
      case 'ongoing':
        return { bg: COLORS.accentLight, fg: COLORS.accentDark, label: 'Ongoing' };
      case 'upcoming':
        return { bg: COLORS.primaryLight, fg: COLORS.primary, label: 'Upcoming' };
      case 'completed':
        return { bg: COLORS.primaryLight, fg: COLORS.primary, label: 'Completed' };
      default:
        return { bg: T.inputBg, fg: T.subText, label: 'Cancelled' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Text style={styles.logo}>Waker</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: T.text }]}>My Bookings</Text>
          <Text style={[styles.subtitle, { color: T.subText }]}>Manage your scheduled services</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {(['all', 'upcoming', 'completed'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, { backgroundColor: T.inputBg }, filter === f && { backgroundColor: COLORS.primary }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, { color: T.subText }, filter === f && { color: '#fff' }]}>
                {f === 'all' ? 'All' : f === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ gap: 12 }}>
          {filteredBookings.map((booking) => {
            const s = statusStyle(booking.status);
            return (
              <TouchableOpacity
                key={booking.id}
                style={[styles.card, { backgroundColor: T.card, borderColor: T.border }, booking.status === 'cancelled' && { opacity: 0.7 }]}
                activeOpacity={0.85}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconWrap, { backgroundColor: T.inputBg }]}>
                      <Ionicons name={booking.icon as any} size={22} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text style={[styles.serviceName, { color: T.text }]}>{booking.service}</Text>
                      <Text style={[styles.workerName, { color: T.subText }]}>{booking.worker}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                    <Text style={[styles.statusPillText, { color: s.fg }]}>{s.label}</Text>
                  </View>
                </View>
                <View style={[styles.cardBottomRow, { borderTopColor: T.border }]}>
                  <View>
                    <Text style={[styles.metaLabel, { color: T.subText }]}>Date</Text>
                    <Text style={[styles.metaValue, { color: T.text }]}>{booking.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.metaLabel, { color: T.subText }]}>Price</Text>
                    <Text
                      style={[
                        styles.metaValuePrice,
                        booking.status === 'cancelled' && { textDecorationLine: 'line-through', color: T.subText },
                      ]}
                    >
                      {booking.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>Need more help?</Text>
            <Text style={styles.promoBody}>Book a trusted professional for your next home project in minutes.</Text>
            <TouchableOpacity style={styles.promoButton} onPress={() => router.push('/post-a-job' as any)} activeOpacity={0.85}>
              <Text style={styles.promoButtonText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/home', active: false },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: true },
          { icon: 'add', iconFocused: 'add', label: '', route: '/post-a-job', center: true },
          { icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person-outline', iconFocused: 'person', label: 'Profile', route: '/profile', active: false },
        ].map((tab) =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={styles.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={styles.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={(tab.active ? tab.iconFocused : tab.icon) as any} size={22} color={tab.active ? COLORS.primary : T.subText} />
              <Text style={[styles.navLabel, { color: T.subText }, tab.active && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  avatarSmall: { width: 40, height: 40, borderRadius: 20 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  titleBlock: { marginTop: 4, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14 },
  chipRow: { marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 12 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  serviceName: { fontSize: 16, fontWeight: '700' },
  workerName: { fontSize: 14 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 12 },
  metaLabel: { fontSize: 11, textTransform: 'uppercase', fontWeight: '700' },
  metaValue: { fontSize: 14, fontWeight: '600' },
  metaValuePrice: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  promoCard: { backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, gap: 6, minHeight: 180, justifyContent: 'center' },
  promoTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  promoBody: { fontSize: 14, color: '#fff', maxWidth: '80%' },
  promoButton: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, marginTop: 12 },
  promoButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, flexDirection: 'row', alignItems: 'center',
    paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8,
  },
});
