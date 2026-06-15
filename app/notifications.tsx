import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Types ─── */
type NotifType = 'job' | 'payment' | 'message' | 'system' | 'promo';

interface Notif {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

/* ─── Data ─── */
const INITIAL_NOTIFS: Notif[] = [
  { id: 1,  type: 'job',     title: 'Worker on the way!',         body: 'Kofi Mensah has accepted your plumbing job and is heading to your location.',       time: '2 min ago',  read: false },
  { id: 2,  type: 'message', title: 'New message from Kofi',      body: 'Hi! I\'m about 15 minutes away. Please make sure the main valve is accessible.',     time: '5 min ago',  read: false },
  { id: 3,  type: 'payment', title: 'Payment confirmed',           body: 'GH₵ 450 paid successfully to Kofi Mensah for plumbing service via MTN MoMo.',       time: '1 hr ago',   read: false },
  { id: 4,  type: 'promo',   title: 'You have a promo! 🎉',        body: 'Use code WELCOME50 to get GH₵ 50 off your next job. Expires Dec 31, 2025.',          time: '3 hrs ago',  read: true  },
  { id: 5,  type: 'job',     title: 'Job completed',               body: 'Your carpentry job with Yaw Boateng has been marked complete. How did it go?',        time: 'Yesterday',  read: true  },
  { id: 6,  type: 'system',  title: 'Verify your email',           body: 'Please verify your email address to unlock all Vaker features. Tap to verify.',      time: 'Yesterday',  read: true  },
  { id: 7,  type: 'message', title: 'Kwame Adjei sent a quote',   body: 'I can fix the electrical fault for GH₵ 380. Available from Thursday onwards.',       time: '2 days ago', read: true  },
  { id: 8,  type: 'payment', title: 'Refund processed',            body: 'A refund of GH₵ 200 has been returned to your MoMo wallet. Allow 24–48 hrs.',        time: '3 days ago', read: true  },
  { id: 9,  type: 'promo',   title: 'Weekend special 🔥',          body: '20% off all cleaning services this weekend. Limited time — book now!',                time: '4 days ago', read: true  },
  { id: 10, type: 'system',  title: 'App update available',        body: 'Vaker v1.1.0 is available with new features and bug fixes. Update now.',              time: '5 days ago', read: true  },
];

/* ─── Icon + color per type ─── */
const TYPE_META: Record<NotifType, { icon: string; bg: string; color: string }> = {
  job:     { icon: 'briefcase-outline',         bg: COLORS.primary + '18', color: COLORS.primary },
  payment: { icon: 'card-outline',              bg: '#E8F5E9',              color: '#2E7D32'      },
  message: { icon: 'chatbubble-ellipses-outline', bg: '#E3F2FD',            color: '#1565C0'      },
  system:  { icon: 'information-circle-outline', bg: '#FFF8E1',             color: '#F57F17'      },
  promo:   { icon: 'gift-outline',              bg: '#F3E5F5',              color: '#7B1FA2'      },
};

/* ─── Single notification row ─── */
function NotifRow({ notif, onPress, onDismiss }: {
  notif: Notif;
  onPress: () => void;
  onDismiss: () => void;
}) {
  const meta = TYPE_META[notif.type];
  return (
    <TouchableOpacity
      style={[nr.row, !notif.read && nr.rowUnread]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      {/* Unread dot */}
      {!notif.read && <View style={nr.unreadDot} />}

      {/* Icon */}
      <View style={[nr.iconWrap, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon as any} size={20} color={meta.color} />
      </View>

      {/* Content */}
      <View style={nr.content}>
        <Text style={nr.title} numberOfLines={1}>{notif.title}</Text>
        <Text style={nr.body} numberOfLines={2}>{notif.body}</Text>
        <Text style={nr.time}>{notif.time}</Text>
      </View>

      {/* Dismiss */}
      <TouchableOpacity style={nr.dismissBtn} onPress={onDismiss} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
        <Ionicons name="close-outline" size={18} color={COLORS.muted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const nr = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    gap: 12,
    position: 'relative',
  },
  rowUnread: { backgroundColor: COLORS.primary + '06' },
  unreadDot: {
    position: 'absolute',
    left: 6,
    top: 20,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 4,
  },
  content: { flex: 1 },
  title:   { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  body:    { fontSize: 13, color: '#555', lineHeight: 19, marginBottom: 4 },
  time:    { fontSize: 11, color: COLORS.muted, fontWeight: '500' },
  dismissBtn: { paddingTop: 2 },
});

/* ─── Filter tabs ─── */
const FILTERS: { key: 'all' | NotifType; label: string }[] = [
  { key: 'all',     label: 'All'      },
  { key: 'job',     label: 'Jobs'     },
  { key: 'message', label: 'Messages' },
  { key: 'payment', label: 'Payments' },
  { key: 'promo',   label: 'Promos'   },
];

/* ─── Main Screen ─── */
export default function NotificationsScreen() {
  const [notifs, setNotifs]   = useState<Notif[]>(INITIAL_NOTIFS);
  const [filter, setFilter]   = useState<'all' | NotifType>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const visible = filter === 'all'
    ? notifs
    : notifs.filter(n => n.type === filter);

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: number) =>
    setNotifs(ns => ns.filter(n => n.id !== id));

  const markAllRead = () =>
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));

  const clearAll = () =>
    setNotifs(ns => ns.filter(n => !n.read)); // keep only unread on clear

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} activeOpacity={0.7} disabled={unreadCount === 0}>
          <Text style={[s.markAllText, unreadCount === 0 && { opacity: 0.3 }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* ── FILTER TABS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterChip, filter === f.key && s.filterChipActive]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
              {f.label}
            </Text>
            {/* unread count badge per type */}
            {f.key !== 'all' && notifs.filter(n => n.type === f.key && !n.read).length > 0 && (
              <View style={s.chipBadge}>
                <Text style={s.chipBadgeText}>
                  {notifs.filter(n => n.type === f.key && !n.read).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── NOTIFICATION LIST ── */}
      {visible.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="notifications-off-outline" size={56} color={COLORS.primary + '50'} />
          <Text style={s.emptyTitle}>All caught up!</Text>
          <Text style={s.emptySub}>No notifications in this category yet.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          {visible.map((notif, i) => (
            <View key={notif.id}>
              {i > 0 && <View style={s.divider} />}
              <NotifRow
                notif={notif}
                onPress={() => markRead(notif.id)}
                onDismiss={() => dismiss(notif.id)}
              />
            </View>
          ))}

          {notifs.filter(n => n.read).length > 0 && (
            <TouchableOpacity style={s.clearBtn} onPress={clearAll} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={15} color={COLORS.muted} />
              <Text style={s.clearBtnText}>Clear read notifications</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  markAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  /* Filter row */
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  filterText:       { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  filterTextActive: { color: COLORS.primary },
  chipBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chipBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },

  /* List */
  list: { paddingBottom: 40 },
  divider: { height: 1, backgroundColor: '#F2F2F2' },

  /* Empty */
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  emptySub:   { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },

  /* Clear button */
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 16,
    marginTop: 8,
  },
  clearBtnText: { fontSize: 13, color: COLORS.muted, fontWeight: '500' },
});
