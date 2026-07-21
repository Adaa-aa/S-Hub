import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SERVICES = [
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Carpentry', icon: '🪚' },
  { name: 'Painting', icon: '🖌️' },
  { name: 'Cleaning', icon: '🧹' },
  { id: 'masonry', icon: '🧱' },
  { id: 'welding', icon: '🔩' },
  { id: 'ac', icon: '❄️' },
  { id: 'tiling', icon: '🏗️' },
  { id: 'roofing', icon: '🏚️' },
  { id: 'security', icon: '📷' },
  { id: 'other', icon: '⋯' },
];

const RECOMMENDED = [
  {
    id: 1, name: 'Kofi Mensah', skill: 'Plumber',
    rating: 4.8, reviews: 20, distance: '2.1 km',
    price: 450, initials: 'KM', color: '#006B3F',
  },
  {
    id: 2, name: 'Kwame Adjei', skill: 'Electrician',
    rating: 4.7, reviews: 35, distance: '1.8 km',
    price: 400, initials: 'KA', color: '#1D6FBA',
  },
  {
    id: 3, name: 'Yaw Boateng', skill: 'Carpenter',
    rating: 4.6, reviews: 18, distance: '2.5 km',
    price: 350, initials: 'YB', color: '#D97706',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<number[]>([]);
  const T = useThemeColors();

  const toggleSave = (id: number) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      {/* ── HEADER ── */}
      <View style={[styles.header, { backgroundColor: T.header }]}>
        {/* Brand row */}
        <View style={styles.brandRow}>
          <View style={styles.logoGroup}>
            {/* Small lightning mark */}
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>⚡</Text>
            </View>
            <Text style={[styles.brandName, { color: T.text }]}>Vaker</Text>
          </View>
          <TouchableOpacity style={[styles.bellBtn, { backgroundColor: T.inputBg }]} activeOpacity={0.7} onPress={() => router.push('/notifications' as any)}>
            <Ionicons name="notifications-outline" size={22} color={T.text} />
            {/* Notification dot */}
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Location row */}
        <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
          <Ionicons name="location-sharp" size={15} color={COLORS.primary} />
          <Text style={[styles.locationText, { color: T.text }]}>Kumasi, Ghana</Text>
          <Ionicons name="chevron-down" size={14} color={T.subText} />
        </TouchableOpacity>

        {/* Search bar */}
        <View style={[styles.searchBar, { backgroundColor: T.inputBg }]}>
          <Ionicons name="search-outline" size={18} color={T.subText} />
          <TextInput
            style={[styles.searchInput, { color: T.text }]}
            placeholder="What work do you need done?"
            placeholderTextColor={T.subText}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => search.length > 0 && router.push('/search')}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.searchGoBtn}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.searchGoBtnText}>Go</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── POPULAR SERVICES ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: T.text }]}>Popular Services</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesRow}
        >
          {SERVICES.map((svc) => (
            <TouchableOpacity
              key={svc.name}
              style={styles.svcCard}
              activeOpacity={0.75}
              onPress={() => router.push('/search')}
            >
              <View style={[styles.svcIconWrap, { backgroundColor: T.card, borderColor: T.border }]}>
                <Text style={styles.svcIcon}>{svc.icon}</Text>
              </View>
              <Text style={[styles.svcLabel, { color: T.text }]}>{svc.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── EMERGENCY HIRE BANNER ── */}
        <TouchableOpacity
          style={styles.emergencyBanner}
          activeOpacity={0.85}
          onPress={() => router.push('/emergency')}
        >
          {/* Left text */}
          <View style={styles.emergencyLeft}>
            <Text style={styles.emergencyTitle}>Need it urgently?</Text>
            <Text style={styles.emergencySubtitle}>
              Get fast responses from{'\n'}available workers near you.
            </Text>
            <View style={styles.emergencyBtn}>
              <Text style={styles.emergencyBtnText}>Emergency Hire</Text>
            </View>
          </View>

          {/* Right — lightning graphic */}
          <View style={styles.emergencyRight}>
            <View style={styles.boltCircleOuter}>
              <View style={styles.boltCircleInner}>
                <Text style={styles.boltEmoji}>⚡</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── RECOMMENDED FOR YOU ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: T.text }]}>Recommended for you</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {RECOMMENDED.map((worker) => (
          <TouchableOpacity
            key={worker.id}
            style={[styles.workerCard, { backgroundColor: T.card }]}
            activeOpacity={0.8}
            onPress={() => router.push(`/worker-profile?id=${worker.id}` as any)}
          >
            {/* Avatar */}
            <View style={[styles.workerAvatar, { backgroundColor: worker.color + '18' }]}>
              <Text style={[styles.workerInitials, { color: worker.color }]}>
                {worker.initials}
              </Text>
            </View>

            {/* Info */}
            <View style={styles.workerInfo}>
              <Text style={[styles.workerName, { color: T.text }]}>{worker.name}</Text>
              <Text style={[styles.workerSkill, { color: T.subText }]}>{worker.skill}</Text>
              <View style={styles.workerMeta}>
                <Ionicons name="star" size={11} color={COLORS.accent} />
                <Text style={[styles.workerRating, { color: T.text }]}> {worker.rating}</Text>
                <Text style={[styles.workerReviews, { color: T.subText }]}> ({worker.reviews})</Text>
                <Text style={[styles.workerDot, { color: T.subText }]}> · </Text>
                <Ionicons name="location-outline" size={11} color={T.subText} />
                <Text style={[styles.workerDist, { color: T.subText }]}> {worker.distance}</Text>
              </View>
            </View>

            {/* Right: heart + price */}
            <View style={styles.workerRight}>
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={(e) => { e.stopPropagation(); toggleSave(worker.id); }}
              >
                <Ionicons
                  name={saved.includes(worker.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={saved.includes(worker.id) ? COLORS.danger : T.subText}
                />
              </TouchableOpacity>
              <Text style={[styles.workerFrom, { color: T.subText }]}>From</Text>
              <Text style={styles.workerPrice}>GH₵ {worker.price}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home', iconFocused: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'add', iconFocused: 'add', label: '', route: '/post-job', center: true },
          { icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person-outline', iconFocused: 'person', label: 'Profile', route: '/profile', active: false },
        ].map((tab) =>
          (tab as any).center ? (
            <TouchableOpacity
              key="center"
              style={styles.centerBtn}
              activeOpacity={0.85}
              onPress={() => router.push(tab.route as any)}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={tab.label}
              style={styles.navTab}
              activeOpacity={0.7}
              onPress={() => router.push(tab.route as any)}
            >
              <Ionicons
                name={(tab.active ? tab.iconFocused : tab.icon) as any}
                size={22}
                color={tab.active ? COLORS.primary : T.subText}
              />
              <Text style={[styles.navLabel, { color: T.subText }, tab.active && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* ── Header ── */
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  /* Brand row */
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoMark: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: { fontSize: 14 },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },

  /* Location */
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  /* Search */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  searchGoBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  searchGoBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  scrollContent: { paddingBottom: 110 },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* Services row */
  servicesRow: {
    paddingHorizontal: 18,
    gap: 12,
  },
  svcCard: {
    alignItems: 'center',
    gap: 7,
  },
  svcIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  svcIcon: { fontSize: 26 },
  svcLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },

  /* Emergency banner */
  emergencyBanner: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: '#1A1A2E',
    borderRadius: 18,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  emergencyLeft: { flex: 1, paddingRight: 10 },
  emergencyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  emergencySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
    marginBottom: 16,
  },
  emergencyBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  emergencyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  emergencyRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(252,209,22,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltCircleInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(252,209,22,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltEmoji: { fontSize: 30 },

  /* Worker cards */
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  workerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  workerInitials: {
    fontSize: 17,
    fontWeight: '800',
  },
  workerInfo: { flex: 1 },
  workerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  workerSkill: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 5,
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerRating: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  workerReviews: {
    fontSize: 11,
    color: COLORS.muted,
  },
  workerDot: {
    fontSize: 11,
    color: COLORS.muted,
  },
  workerDist: {
    fontSize: 11,
    color: COLORS.muted,
  },
  workerRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  heartBtn: {
    marginBottom: 6,
    padding: 2,
  },
  workerFrom: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '500',
  },
  workerPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },

  /* Bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 22,
    paddingTop: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.muted,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
});