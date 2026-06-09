import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CATEGORIES = [
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Carpentry', icon: '🪚' },
  { name: 'Painting', icon: '🖌️' },
  { name: 'Cleaning', icon: '🧹' },
  { name: 'More', icon: '⋯' },
];

const RECOMMENDED = [
  {
    id: 1, name: 'Kofi Mensah', skill: 'Plumber',
    rating: 4.8, jobs: 120, distance: '2.2 km',
    price: 450, initials: 'KM', color: '#006B3F',
  },
  {
    id: 2, name: 'Kwame Adjei', skill: 'Electrician',
    rating: 4.7, jobs: 89, distance: '1.8 km',
    price: 400, initials: 'KA', color: '#1D6FBA',
  },
  {
    id: 3, name: 'Yaw Boateng', skill: 'Carpenter',
    rating: 4.6, jobs: 73, distance: '2.5 km',
    price: 350, initials: 'YB', color: '#D97706',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Kumasi, Ghana</Text>
            <Text style={styles.locationChevron}>⌄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>NK</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="What work do you need?"
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.searchGoBtn}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.searchGoBtnText}>Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── CATEGORIES ── */}
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              style={styles.catCard}
              onPress={() => router.push('/post-job')}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── EMERGENCY HIRE BANNER ── */}
        <TouchableOpacity
          style={styles.emergencyBanner}
          onPress={() => router.push('/emergency')}
        >
          <View style={styles.emergencyLeft}>
            <Text style={styles.emergencyTitle}>Need it urgently? ⚡</Text>
            <Text style={styles.emergencySubtitle}>
              Get fast responses from available workers near you.
            </Text>
            <View style={styles.emergencyBtn}>
              <Text style={styles.emergencyBtnText}>Emergency Hire</Text>
            </View>
          </View>
          <Text style={styles.emergencyEmoji}>🔥</Text>
        </TouchableOpacity>

        {/* ── RECOMMENDED ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {RECOMMENDED.map((worker) => (
          <TouchableOpacity
            key={worker.id}
            style={styles.workerCard}
            onPress={() => router.push(`/worker-profile?id=${worker.id}`)}
          >
            {/* Avatar */}
            <View style={[styles.workerAvatar, { backgroundColor: worker.color + '20' }]}>
              <Text style={[styles.workerInitials, { color: worker.color }]}>
                {worker.initials}
              </Text>
            </View>

            {/* Info */}
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.workerSkill}>{worker.skill}</Text>
              <View style={styles.workerMeta}>
                <Text style={styles.workerStar}>★</Text>
                <Text style={styles.workerRating}>{worker.rating}</Text>
                <Text style={styles.workerJobs}>({worker.jobs} jobs)</Text>
                <Text style={styles.workerDot}>·</Text>
                <Text style={styles.workerDist}>📍 {worker.distance}</Text>
              </View>
            </View>

            {/* Price + Save */}
            <View style={styles.workerRight}>
              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveIcon}>🤍</Text>
              </TouchableOpacity>
              <Text style={styles.workerPriceLabel}>From</Text>
              <Text style={styles.workerPrice}>
                GHC {worker.price}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home', route: '/home' },
          { icon: '💼', label: 'Jobs', route: '/bookings' },
          { icon: '➕', label: '', route: '/post-job', isCenter: true },
          { icon: '💬', label: 'Messages', route: '/messages' },
          { icon: '👤', label: 'Profile', route: '/profile' },
        ].map((tab) =>
          tab.isCenter ? (
            <TouchableOpacity
              key="center"
              style={styles.centerBtn}
              onPress={() => router.push(tab.route as any)}
            >
              <Text style={styles.centerBtnText}>➕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={tab.label}
              style={styles.navTab}
              onPress={() => router.push(tab.route as any)}
            >
              <Text style={styles.navIcon}>{tab.icon}</Text>
              <Text style={styles.navLabel}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  /* Header */
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 54, paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  locationRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  locationIcon: { fontSize: 14 },
  locationText: {
    fontSize: 15, fontWeight: '700', color: COLORS.text,
  },
  locationChevron: { fontSize: 16, color: COLORS.muted },
  avatarBtn: {},
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 13, fontWeight: '700', color: COLORS.primary,
  },

  /* Search */
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgGrey, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: COLORS.border, gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1, fontSize: 14, color: COLORS.text,
  },
  searchGoBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 8,
  },
  searchGoBtnText: {
    color: '#fff', fontSize: 12, fontWeight: '700',
  },

  scrollContent: { paddingBottom: 100 },

  /* Categories */
  categoriesGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, paddingTop: 20,
    gap: 10, marginBottom: 20,
  },
  catCard: {
    width: '15%', minWidth: 54,
    alignItems: 'center', gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: 14, padding: 10,
    borderWidth: 1, borderColor: COLORS.border,
    flex: 1,
  },
  catIcon: { fontSize: 22 },
  catLabel: {
    fontSize: 11, fontWeight: '500',
    color: COLORS.text, textAlign: 'center',
  },

  /* Emergency banner */
  emergencyBanner: {
    marginHorizontal: 16, marginBottom: 24,
    backgroundColor: COLORS.dark,
    borderRadius: 16, padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyLeft: { flex: 1 },
  emergencyTitle: {
    fontSize: 16, fontWeight: '800',
    color: '#fff', marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)',
    lineHeight: 18, marginBottom: 14,
  },
  emergencyBtn: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  emergencyBtnText: {
    color: '#fff', fontSize: 13, fontWeight: '700',
  },
  emergencyEmoji: { fontSize: 48, marginLeft: 10 },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: COLORS.text,
  },
  seeAll: {
    fontSize: 13, color: COLORS.primary, fontWeight: '600',
  },

  /* Worker cards */
  workerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
    gap: 12,
  },
  workerAvatar: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  workerInitials: {
    fontSize: 16, fontWeight: '800',
  },
  workerInfo: { flex: 1 },
  workerName: {
    fontSize: 14, fontWeight: '700', color: COLORS.text,
  },
  workerSkill: {
    fontSize: 12, color: COLORS.muted, marginBottom: 4,
  },
  workerMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  workerStar: { color: COLORS.accent, fontSize: 12 },
  workerRating: {
    fontSize: 12, fontWeight: '700', color: COLORS.text,
  },
  workerJobs: { fontSize: 11, color: COLORS.muted },
  workerDot: { fontSize: 11, color: COLORS.muted },
  workerDist: { fontSize: 11, color: COLORS.muted },

  workerRight: { alignItems: 'flex-end', gap: 4 },
  saveBtn: { marginBottom: 4 },
  saveIcon: { fontSize: 18 },
  workerPriceLabel: {
    fontSize: 10, color: COLORS.muted, fontWeight: '500',
  },
  workerPrice: {
    fontSize: 15, fontWeight: '800', color: COLORS.primary,
  },

  /* Bottom nav */
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 20, paddingTop: 10,
    paddingHorizontal: 10,
  },
  navTab: {
    flex: 1, alignItems: 'center', gap: 3,
  },
  navIcon: { fontSize: 22 },
  navLabel: {
    fontSize: 10, fontWeight: '500', color: COLORS.muted,
  },
  centerBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  centerBtnText: { fontSize: 22, color: '#fff' },
});