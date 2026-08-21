import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';

const TABS = [
  { key: 'home', icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/worker-dashboard' },
  { key: 'jobs', icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/worker-jobs' },
  { key: 'messages', icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/worker-messages' },
  { key: 'profile', icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/worker-profile-settings' },
] as const;

export default function WorkerNav({ active }: { active: 'home' | 'jobs' | 'messages' | 'profile' }) {
  const T = useThemeColors();

  return (
    <View style={[styles.bar, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
      <View style={styles.barInner}>
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => {
                if (!isActive) router.replace(tab.route as any);
              }}
            >
              <Ionicons
                name={(isActive ? tab.iconActive : tab.icon) as any}
                size={wms(21)}
                color={isActive ? COLORS.primary : T.subText}
              />
              <Text style={[styles.label, { color: isActive ? COLORS.primary : T.subText }, isActive && styles.labelActive]}>
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
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, alignItems: 'center',
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    paddingBottom: wvs(22), paddingTop: wvs(9), paddingHorizontal: ws(10),
  },
  barInner: { width: '100%', maxWidth: ws(544), flexDirection: 'row', alignItems: 'center' },
  tab: { flex: 1, alignItems: 'center', gap: wvs(3) },
  label: { fontSize: wms(10), fontWeight: '500' },
  labelActive: { fontWeight: '700' },
});
