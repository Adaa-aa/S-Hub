import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { s } from '@/lib/scaling';

const TABS = [
  { key: 'home', icon: 'home-outline', iconFocused: 'home', label: 'Home', route: '/home', center: false },
  { key: 'jobs', icon: 'briefcase-outline', iconFocused: 'briefcase', label: 'Jobs', route: '/bookings', center: false },
  { key: 'center', icon: 'add', iconFocused: 'add', label: '', route: '/post-a-job', center: true },
  { key: 'messages', icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Messages', route: '/messages', center: false },
  { key: 'profile', icon: 'person-outline', iconFocused: 'person', label: 'Profile', route: '/profile', center: false },
] as const;

export default function CustomerNav({ active }: { active?: 'home' | 'jobs' | 'messages' | 'profile' }) {
  const T = useThemeColors();

  return (
    <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
      <View style={styles.bottomNavInner}>
        {TABS.map((tab) => {
          if (tab.center) {
            return (
              <TouchableOpacity
                key="center"
                style={styles.centerBtn}
                activeOpacity={0.85}
                onPress={() => router.push(tab.route as any)}
              >
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            );
          }
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.navTab}
              activeOpacity={0.7}
              onPress={() => {
                if (!isActive) router.replace(tab.route as any);
              }}
            >
              <Ionicons
                name={(isActive ? tab.iconFocused : tab.icon) as any}
                size={22}
                color={isActive ? COLORS.primary : T.subText}
              />
              <Text style={[styles.navLabel, { color: T.subText }, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, alignItems: 'center',
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10,
  },
  bottomNavInner: { width: '100%', maxWidth: s(544), flexDirection: 'row', alignItems: 'center' },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8,
  },
});
