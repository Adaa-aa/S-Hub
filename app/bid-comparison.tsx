import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

type Badge = 'best_value' | 'expiring_soon' | null;
type BidStatus = 'pending' | 'accepting' | 'accepted';

type Bid = {
  id: string;
  workerName: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  eta: string;
  price: number;
  priceNote: string;
  badge: Badge;
};

const BIDS: Bid[] = [
  { id: '1', workerName: 'Kofi Mensah', verified: true, rating: 4.9, reviewCount: 124, eta: 'Arrives in 20 mins', price: 85, priceNote: 'Fixed price', badge: 'best_value' },
  { id: '2', workerName: 'Abena Osei', verified: false, rating: 4.7, reviewCount: 89, eta: 'Arrives in 15 mins', price: 110, priceNote: 'Includes parts', badge: 'expiring_soon' },
  { id: '3', workerName: 'Kwame Boateng', verified: false, rating: 4.5, reviewCount: 210, eta: 'Arrives in 45 mins', price: 75, priceNote: 'Service only', badge: null },
];

export default function BidComparisonScreen() {
  const T = useThemeColors();
  const [statuses, setStatuses] = useState<Record<string, BidStatus>>({});

  const handleAccept = (bidId: string) => {
    setStatuses((s) => ({ ...s, [bidId]: 'accepting' }));
    setTimeout(() => {
      setStatuses((s) => ({ ...s, [bidId]: 'accepted' }));
      // TODO: POST accept to your API
      router.push('/bookings' as any);
    }, 900);
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.logo}>Waker</Text>
        <View style={[styles.avatarSmall, { backgroundColor: T.inputBg }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contextBlock}>
          <View style={[styles.activePill, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={styles.activePillText}>ACTIVE REQUEST</Text>
          </View>
          <Text style={[styles.requestTitle, { color: T.text }]}>Leaking kitchen tap</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={T.subText} />
            <Text style={[styles.locationText, { color: T.subText }]}>East Legon, Accra</Text>
          </View>
        </View>

        <View style={{ gap: 16 }}>
          {BIDS.map((bid) => {
            const status = statuses[bid.id] ?? 'pending';
            return (
              <View
                key={bid.id}
                style={[
                  styles.bidCard,
                  { backgroundColor: T.card, borderColor: T.border },
                  bid.badge === 'best_value' && { borderWidth: 2, borderColor: COLORS.accent },
                ]}
              >
                {bid.badge === 'best_value' && (
                  <View style={styles.bestValueRibbon}>
                    <Text style={styles.bestValueRibbonText}>BEST VALUE</Text>
                  </View>
                )}
                {bid.badge === 'expiring_soon' && (
                  <View style={styles.expiringPill}>
                    <Ionicons name="alarm-outline" size={12} color={COLORS.danger} />
                    <Text style={styles.expiringPillText}>EXPIRING SOON</Text>
                  </View>
                )}

                <View style={styles.bidTopRow}>
                  <View style={[styles.avatarLg, { backgroundColor: T.inputBg }]}>
                    <Ionicons name="person" size={28} color={T.subText} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.workerName, { color: T.text }]}>{bid.workerName}</Text>
                      {bid.verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.verified} />}
                    </View>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={16} color={COLORS.star} />
                      <Text style={styles.ratingText}>{bid.rating} ({bid.reviewCount} reviews)</Text>
                    </View>
                    <View style={styles.etaRow}>
                      <Ionicons name="time-outline" size={14} color={T.subText} />
                      <Text style={[styles.etaText, { color: T.subText }]}>{bid.eta}</Text>
                    </View>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.priceText}>GH₵ {bid.price}</Text>
                    <Text style={[styles.priceNote, { color: T.subText }]}>{bid.priceNote}</Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.acceptButton, status === 'accepted' && { backgroundColor: COLORS.primaryLight }]}
                    onPress={() => handleAccept(bid.id)}
                    disabled={status !== 'pending'}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.acceptButtonText}>
                      {status === 'accepting' ? 'Confirming…' : status === 'accepted' ? 'Confirmed!' : 'Accept'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.messageButton, { borderColor: T.text }]} activeOpacity={0.85}>
                    <Text style={[styles.messageButtonText, { color: T.text }]}>Message</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.counterOfferRow}>
                  <Text style={[styles.counterOfferText, { color: T.subText }]}>Counter-offer</Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  avatarSmall: { width: 40, height: 40, borderRadius: 20 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120, gap: 16 },
  contextBlock: { gap: 4, marginBottom: 4 },
  activePill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginBottom: 4 },
  activePillText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  requestTitle: { fontSize: 22, fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14 },
  bidCard: { borderWidth: 1, borderRadius: 20, padding: 16, overflow: 'hidden' },
  bestValueRibbon: { position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 4, borderBottomLeftRadius: 16 },
  bestValueRibbonText: { fontSize: 11, fontWeight: '700', color: COLORS.accentDark },
  expiringPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.dangerLight, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, marginBottom: 12 },
  expiringPillText: { fontSize: 11, color: COLORS.danger, fontWeight: '700' },
  bidTopRow: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 16 },
  avatarLg: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workerName: { fontSize: 18, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: 13, color: COLORS.text },
  etaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  etaText: { fontSize: 13 },
  priceCol: { alignItems: 'flex-end' },
  priceText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  priceNote: { fontSize: 11 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  acceptButton: { flex: 1, height: 52, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  acceptButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  messageButton: { flex: 1, height: 52, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  messageButtonText: { fontSize: 15, fontWeight: '700' },
  counterOfferRow: { alignItems: 'center', marginTop: 8 },
  counterOfferText: { fontSize: 13, textDecorationLine: 'underline' },
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
