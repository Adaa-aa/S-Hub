// components/BottomNav.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';

type NavItem = {
  key: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
};

const ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: 'home', route: '/home' },
  { key: 'jobs', label: 'Jobs', icon: 'work', route: '/my-bookings' },
  { key: 'messages', label: 'Messages', icon: 'chat-bubble', route: '/messages' },
  { key: 'profile', label: 'Profile', icon: 'person', route: '/profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {ITEMS.map((item) => {
        const active = pathname?.includes(item.key === 'jobs' ? 'bookings' : item.key);
        return (
          <Pressable
            key={item.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => router.push(item.route as any)}
          >
            <MaterialIcons
              name={item.icon}
              size={22}
              color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 2,
  },
  tabActive: { backgroundColor: colors.primaryContainer + '22' },
  label: { ...typography.labelMd, fontSize: 11, color: colors.onSurfaceVariant },
  labelActive: { color: colors.onPrimaryContainer, fontWeight: '700' },
});
