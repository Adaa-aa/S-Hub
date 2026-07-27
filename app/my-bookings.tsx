// app/my-bookings.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../constants/theme';
import BottomNav from '../components/BottomNav';

type Status = 'ongoing' | 'upcoming' | 'completed' | 'cancelled';
type Filter = 'all' | 'upcoming' | 'completed';

type Booking = {
  id: string;
  service: string;
  worker: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  status: Status;
  date: string;
  price: string;
};

const BOOKINGS: Booking[] = [
  { id: '1', service: 'Electrical Repair', worker: 'Kwame Appiah', icon: 'bolt', status: 'ongoing', date: 'Oct 24, 2023', price: 'GH₵ 250' },
  { id: '2', service: 'Pipe Leakage', worker: 'Abena Mensah', icon: 'plumbing', status: 'upcoming', date: 'Oct 26, 2023', price: 'GH₵ 180' },
  { id: '3', service: 'House Cleaning', worker: 'Kojo Boateng', icon: 'cleaning-services', status: 'completed', date: 'Oct 20, 2023', price: 'GH₵ 400' },
  { id: '4', service: 'Wall Painting', worker: 'Efua Asare', icon: 'format-paint', status: 'cancelled', date: 'Oct 18, 2023', price: 'GH₵ 1,200' },
];

const STATUS_STYLES: Record<Status, { bg: string; fg: string; label: string }> = {
  ongoing: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Ongoing' },
  upcoming: { bg: colors.tertiaryContainer + '33', fg: colors.tertiary, label: 'Upcoming' },
  completed: { bg: colors.tertiaryContainer + '1A', fg: colors.tertiary, label: 'Completed' },
  cancelled: { bg: colors.surfaceContainerHigh, fg: colors.onSurfaceVariant, label: 'Cancelled' },
};

export default function MyBookingsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return BOOKINGS;
    if (filter === 'upcoming') return BOOKINGS.filter((b) => b.status === 'upcoming' || b.status === 'ongoing');
    return BOOKINGS.filter((b) => b.status === 'completed');
  }, [filter]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={8}>
          <MaterialIcons name="menu" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.logo}>Waker</Text>
        <View style={styles.avatarSmall} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>My Bookings</Text>
          <Text style={styles.subtitle}>Manage your scheduled services</Text>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {(['all', 'upcoming', 'completed'] as Filter[]).map((f) => (
            <Pressable
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f === 'all' ? 'All' : f === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Booking cards */}
        <View style={{ gap: spacing.sm }}>
          {filteredBookings.map((booking) => {
            const statusStyle = STATUS_STYLES[booking.status];
            return (
              <Pressable
                key={booking.id}
                style={[styles.card, booking.status === 'cancelled' && styles.cardMuted]}
                onPress={() => router.push({ pathname: '/booking-detail', params: { id: booking.id } })}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.cardLeft}>
                    <View style={styles.iconWrap}>
                      <MaterialIcons name={booking.icon} size={22} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.serviceName}>{booking.service}</Text>
                      <Text style={styles.workerName}>{booking.worker}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusPillText, { color: statusStyle.fg }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={styles.metaLabel}>Date</Text>
                    <Text style={styles.metaValue}>{booking.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.metaLabel}>Price</Text>
                    <Text
                      style={[
                        styles.metaValuePrice,
                        booking.status === 'cancelled' && styles.priceStrikethrough,
                        booking.status === 'completed' && { color: colors.tertiary },
                      ]}
                    >
                      {booking.price}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Promo card */}
          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>Need more help?</Text>
            <Text style={styles.promoBody}>
              Book a trusted professional for your next home project in minutes.
            </Text>
            <Pressable
              style={styles.promoButton}
              onPress={() => router.push('/create-request')}
            >
              <Text style={styles.promoButtonText}>Post a Job</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.base,
  },
  logo: { ...typography.display, fontSize: 20, color: colors.primary },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
  },
  scrollContent: { paddingHorizontal: spacing.containerMargin, paddingBottom: 120 },
  titleBlock: { marginTop: spacing.xs, marginBottom: spacing.md },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  chipRow: { marginBottom: spacing.lg },
  chip: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primaryContainer },
  chipText: { ...typography.labelMd, color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.onPrimary },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardMuted: { opacity: 0.7 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flexDirection: 'row', gap: spacing.sm, flex: 1 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: { ...typography.button, fontSize: 16, color: colors.onSurface },
  workerName: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  statusPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.full },
  statusPillText: { ...typography.labelMd, fontSize: 11, fontWeight: '700' },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    paddingTop: spacing.sm,
  },
  metaLabel: { fontSize: 11, textTransform: 'uppercase', color: colors.onSurfaceVariant, fontWeight: '700' },
  metaValue: { ...typography.labelMd, color: colors.onSurface },
  metaValuePrice: { ...typography.labelMd, color: colors.primary, fontWeight: '700' },
  priceStrikethrough: { textDecorationLine: 'line-through', color: colors.onSurfaceVariant },
  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    minHeight: 180,
    justifyContent: 'center',
  },
  promoTitle: { ...typography.headlineMd, color: '#fff' },
  promoBody: { ...typography.bodyMd, color: '#fff', maxWidth: '80%' },
  promoButton: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  promoButtonText: { ...typography.button, color: colors.primary },
});
