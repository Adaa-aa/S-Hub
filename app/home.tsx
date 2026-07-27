import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline' },
  { key: 'plumbing', label: 'Plumbing', icon: 'water-outline' },
  { key: 'electrical', label: 'Electrical', icon: 'flash-outline' },
  { key: 'carpentry', label: 'Carpentry', icon: 'hammer-outline' },
  { key: 'painting', label: 'Painting', icon: 'color-palette-outline' },
  { key: 'mechanic', label: 'Mechanic', icon: 'car-outline' },
  { key: 'beauty', label: 'Beauty', icon: 'cut-outline' },
  { key: 'gardening', label: 'Gardening', icon: 'leaf-outline' },
  { key: 'appliances', label: 'Appliances', icon: 'build-outline' },
  { key: 'moving', label: 'Moving', icon: 'car-sport-outline' },
];

export default function HomeScreen() {
  const T = useThemeColors();

  const handleSelectCategory = (categoryKey: string) => {
    router.push({ pathname: '/post-a-job', params: { category: categoryKey } } as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: T.text }]}>All Categories</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="search-outline" size={22} color={T.subText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={styles.heroTitle}>Pro Services</Text>
          <Text style={[styles.heroSubtitle, { color: T.subText }]}>
            Connecting you to Ghana&apos;s most trusted professionals.
          </Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryCard, { backgroundColor: T.card, borderColor: T.border }]}
              onPress={() => handleSelectCategory(cat.key)}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconWrap, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name={cat.icon as any} size={26} color={COLORS.primary} />
              </View>
              <Text style={[styles.categoryLabel, { color: T.text }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.trustBanner, { backgroundColor: T.inputBg, borderColor: T.border }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.trustTitle, { color: T.text }]}>Vetted Professionals</Text>
            <Text style={[styles.trustBody, { color: T.subText }]}>
              All service providers undergo a rigorous background check and identity verification.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
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
  headerTitle: { fontSize: 20, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
  hero: { borderRadius: 20, padding: 20, marginBottom: 20, height: 110, justifyContent: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  heroSubtitle: { fontSize: 14, maxWidth: 260 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  categoryCard: { width: '31%', aspectRatio: 1, borderWidth: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 8 },
  categoryIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { fontSize: 13, fontWeight: '600' },
  trustBanner: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 16, marginTop: 20, borderRadius: 20, borderWidth: 1 },
  trustTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  trustBody: { fontSize: 13, lineHeight: 18 },
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
