import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotifType = 'job' | 'payment' | 'message' | 'system' | 'promo';

interface Notif {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notif[] = [
  { id: 1, type: 'job', title: 'Worker on the way!', body: 'Kofi Mensah has accepted your plumbing job and is heading to your location.', time: '2 min ago', read: false },
  { id: 2, type: 'message', title: 'New message from Kofi', body: "Hi! I'm about 15 minutes away. Please make sure the main valve is accessible.", time: '5 min ago', read: false },
  { id: 3, type: 'payment', title: 'Payment confirmed', body: 'GH₵ 450 paid successfully to Kofi Mensah for plumbing service via MTN MoMo.', time: '1 hr ago', read: false },
  { id: 4, type: 'promo', title: 'You have a promo! 🎉', body: 'Use code WELCOME50 to get GH₵ 50 off your next job. Expires Dec 31, 2025.', time: '3 hrs ago', read: true },
  { id: 5, type: 'job', title: 'Job completed', body: 'Your carpentry job with Yaw Boateng has been marked complete. How did it go?', time: 'Yesterday', read: true },
  { id: 6, type: 'system', title: 'Verify your email', body: 'Please verify your email address to unlock all Vaker features. Tap to verify.', time: 'Yesterday', read: true },
  { id: 7, type: 'message', title: 'Kwame Adjei sent a quote', body: 'I can fix the electrical fault for GH₵ 380. Available from Thursday onwards.', time: '2 days ago', read: true },
  { id: 8, type: 'payment', title: 'Refund processed', body: 'A refund of GH₵ 200 has been returned to your MoMo wallet. Allow 24–48 hrs.', time: '3 days ago', read: true },
  { id: 9, type: 'promo', title: 'Weekend special 🔥', body: '20% off all cleaning services this weekend. Limited time — book now!', time: '4 days ago', read: true },
  { id: 10, type: 'system', title: 'App update available', body: 'Vaker v1.1.0 is available with new features and bug fixes. Update now.', time: '5 days ago', read: true },
];

const TYPE_META: Record<NotifType, { icon: string; bg: string; color: string }> = {
  job: { icon: 'briefcase-outline', bg: COLORS.primary + '18', color: COLORS.primary },
  payment: { icon: 'card-outline', bg: '#E8F5E9', color: '#2E7D32' },
  message: { icon: 'chatbubble-ellipses-outline', bg: '#E3F2FD', color: '#1565C0' },
  system: { icon: 'information-circle-outline', bg: '#FFF8E1', color: '#F57F17' },
  promo: { icon: 'gift-outline', bg: '#F3E5F5', color: '#7B1FA2' },
};

const FILTERS: { key: 'all' | NotifType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'job', label: 'Jobs' },
  { key: 'message', label: 'Messages' },
  { key: 'payment', label: 'Payments' },
  { key: 'promo', label: 'Promos' },
];

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<'all' | NotifType>('all');
  const T = useThemeColors();

  const unreadCount = notifs.filter(n => !n.read).length;
  const visible = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  const markRead = (id: number) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number) => setNotifs(ns => ns.filter(n => n.id !== id));
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifs(ns => ns.filter(n => !n.read));

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header, borderColor: T.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={[s.title, { color: T.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={s.badge}><Text style={s.badgeText}>{unreadCount}</Text></View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead} activeOpacity={0.7} disabled={unreadCount === 0}>
          <Text style={[s.markAllText, unreadCount === 0 && { opacity: 0.3 }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.filterRow, { backgroundColor: T.header, borderColor: T.border, alignItems: 'center' }]}>
        {FILTERS.map(f => (
          <Pressable
            key={f.key}
            style={({ pressed }) => [
              s.filterChip,
              { backgroundColor: T.card, borderColor: T.border },
              filter === f.key && s.filterChipActive,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[s.filterText, { color: T.subText }, filter === f.key && s.filterTextActive]}>{f.label}</Text>
            {f.key !== 'all' && notifs.filter(n => n.type === f.key && !n.read).length > 0 && (
              <View style={s.chipBadge}>
                <Text style={s.chipBadgeText}>{notifs.filter(n => n.type === f.key && !n.read).length}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {visible.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="notifications-off-outline" size={56} color={COLORS.primary + '50'} />
          <Text style={[s.emptyTitle, { color: T.text }]}>All caught up!</Text>
          <Text style={[s.emptySub, { color: T.subText }]}>No notifications in this category yet.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
          {(() => {
            const unread = visible.filter((n) => !n.read);
            const read = visible.filter((n) => n.read);
            const renderNotif = (notif: Notif, bordered: boolean) => {
              const meta = TYPE_META[notif.type];
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    s.row,
                    bordered
                      ? { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 14, marginBottom: 10 }
                      : { backgroundColor: COLORS.primary + '08', borderRadius: 14, marginBottom: 10 },
                  ]}
                  onPress={() => markRead(notif.id)}
                  activeOpacity={0.78}
                >
                  {!notif.read && <View style={s.unreadDot} />}
                  <View style={[s.iconWrap, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                  </View>
                  <View style={s.content}>
                    <Text style={[s.notifTitle, { color: T.text }]} numberOfLines={1}>{notif.title}</Text>
                    <Text style={[s.notifBody, { color: T.subText }]} numberOfLines={2}>{notif.body}</Text>
                    <Text style={[s.notifTime, { color: T.subText }]}>{notif.time}</Text>
                  </View>
                  <TouchableOpacity style={s.dismissBtn} onPress={() => dismiss(notif.id)} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                    <Ionicons name="close-outline" size={18} color={T.subText} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            };
            return (
              <>
                {unread.length > 0 && (
                  <>
                    <Text style={s.sectionLabel}>NEW</Text>
                    {unread.map((n) => renderNotif(n, false))}
                  </>
                )}
                {read.length > 0 && (
                  <>
                    <Text style={[s.sectionLabel, { color: T.subText }]}>EARLIER</Text>
                    {read.map((n) => renderNotif(n, true))}
                  </>
                )}
              </>
            );
          })()}
          {notifs.filter(n => n.read).length > 0 && (
            <TouchableOpacity style={s.clearBtn} onPress={clearAll} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={15} color={T.subText} />
              <Text style={[s.clearBtnText, { color: T.subText }]}>Clear read notifications</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 17, fontWeight: '700' },
  badge: { backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  markAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderBottomWidth: 1 },
  filterChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, flexShrink: 0, outlineStyle: 'none' } as any,
  filterChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  filterText: { fontSize: 13, fontWeight: '600', includeFontPadding: false, textAlign: 'center' },
  filterTextActive: { color: COLORS.primary, fontWeight: '600' },
  chipBadge: { backgroundColor: COLORS.danger, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  chipBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  list: { paddingBottom: 40 },
  divider: { height: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, gap: 12, position: 'relative' },
  unreadDot: { position: 'absolute', left: 6, top: 20, width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 4 },
  content: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  notifBody: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
  notifTime: { fontSize: 11, fontWeight: '500' },
  dismissBtn: { paddingTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 16, marginTop: 8 },
  clearBtnText: { fontSize: 13, fontWeight: '500' },
});
