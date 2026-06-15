import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Types ─── */
export interface Conversation {
  id: string;
  workerName: string;
  workerInitials: string;
  workerColor: string;
  jobTitle: string;
  jobIcon: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageMine: boolean;
  unread: number;
  online: boolean;
}

/* ─── Sample conversations ─── */
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    workerName: 'Kofi Mensah',
    workerInitials: 'KM',
    workerColor: '#006B3F',
    jobTitle: 'Fix leaking bathroom pipe',
    jobIcon: '🔧',
    lastMessage: 'I\'m about 10 minutes away, please make sure the main valve is accessible.',
    lastMessageTime: '2 min ago',
    lastMessageMine: false,
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    workerName: 'Kwame Adjei',
    workerInitials: 'KA',
    workerColor: '#1D6FBA',
    jobTitle: 'Rewire bedroom sockets',
    jobIcon: '⚡',
    lastMessage: 'Great, I\'ll bring the extra wiring materials. See you Monday!',
    lastMessageTime: '1 hr ago',
    lastMessageMine: false,
    unread: 1,
    online: true,
  },
  {
    id: 'c3',
    workerName: 'Yaw Boateng',
    workerInitials: 'YB',
    workerColor: '#92400E',
    jobTitle: 'Kitchen cabinet repair',
    jobIcon: '🪚',
    lastMessage: 'You: Sounds good, Thursday at 10 AM works perfectly.',
    lastMessageTime: 'Yesterday',
    lastMessageMine: true,
    unread: 0,
    online: false,
  },
  {
    id: 'c4',
    workerName: 'Nana Asante',
    workerInitials: 'NA',
    workerColor: '#0891B2',
    jobTitle: 'Full house deep cleaning',
    jobIcon: '🧹',
    lastMessage: 'You: Can you bring your own cleaning supplies?',
    lastMessageTime: 'Yesterday',
    lastMessageMine: true,
    unread: 0,
    online: false,
  },
  {
    id: 'c5',
    workerName: 'Ama Owusu',
    workerInitials: 'AO',
    workerColor: '#7C3AED',
    jobTitle: 'Paint living room walls',
    jobIcon: '🖌️',
    lastMessage: 'I can offer GH₵ 550 for a 2-coat finish with premium paint.',
    lastMessageTime: '2 days ago',
    lastMessageMine: false,
    unread: 0,
    online: false,
  },
  {
    id: 'c6',
    workerName: 'Abena Frimpong',
    workerInitials: 'AF',
    workerColor: '#DC2626',
    jobTitle: 'Roof leak repair',
    jobIcon: '🏗️',
    lastMessage: 'You: Unfortunately I had to cancel this job. Sorry for the inconvenience.',
    lastMessageTime: '4 days ago',
    lastMessageMine: true,
    unread: 0,
    online: false,
  },
];

/* ─── Conversation row ─── */
function ConvoRow({ convo }: { convo: Conversation }) {
  return (
    <TouchableOpacity
      style={cr.row}
      onPress={() => router.push(`/chat?id=${convo.id}` as any)}
      activeOpacity={0.78}
    >
      {/* Avatar */}
      <View style={cr.avatarWrap}>
        <View style={[cr.avatar, { backgroundColor: convo.workerColor + '20' }]}>
          <Text style={[cr.initials, { color: convo.workerColor }]}>{convo.workerInitials}</Text>
        </View>
        {convo.online && <View style={cr.onlineDot} />}
      </View>

      {/* Content */}
      <View style={cr.content}>
        <View style={cr.topRow}>
          <Text style={cr.name}>{convo.workerName}</Text>
          <Text style={[cr.time, convo.unread > 0 && cr.timeUnread]}>{convo.lastMessageTime}</Text>
        </View>

        {/* Job context */}
        <View style={cr.jobPill}>
          <Text style={cr.jobIcon}>{convo.jobIcon}</Text>
          <Text style={cr.jobTitle} numberOfLines={1}>{convo.jobTitle}</Text>
        </View>

        <View style={cr.bottomRow}>
          <Text style={[cr.lastMsg, convo.unread > 0 && cr.lastMsgUnread]} numberOfLines={1}>
            {convo.lastMessage}
          </Text>
          {convo.unread > 0 && (
            <View style={cr.badge}>
              <Text style={cr.badgeText}>{convo.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', gap: 12 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 18, fontWeight: '800' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#fff' },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  time: { fontSize: 11, color: COLORS.muted },
  timeUnread: { color: COLORS.primary, fontWeight: '700' },
  jobPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5F5F5', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 5 },
  jobIcon: { fontSize: 11 },
  jobTitle: { fontSize: 11, color: COLORS.muted, fontWeight: '500', maxWidth: 180 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lastMsg: { flex: 1, fontSize: 13, color: COLORS.muted },
  lastMsgUnread: { color: '#1A1A1A', fontWeight: '600' },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
});

/* ─── Main Screen ─── */
export default function MessagesScreen() {
  const [search, setSearch] = useState('');

  const totalUnread = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  const filtered = CONVERSATIONS.filter(c =>
    search.trim() === '' ? true :
      c.workerName.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.title}>Messages</Text>
          {totalUnread > 0 && (
            <View style={s.unreadBadge}>
              <Text style={s.unreadBadgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={s.newBtn} activeOpacity={0.8} onPress={() => router.push('/search' as any)}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* ── SEARCH ── */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={17} color={COLORS.muted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={17} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── LIST ── */}
      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="chatbubbles-outline" size={54} color={COLORS.primary + '50'} />
          <Text style={s.emptyTitle}>No conversations</Text>
          <Text style={s.emptySub}>Post a job and connect with workers to start chatting.</Text>
          <TouchableOpacity style={s.emptyCta} onPress={() => router.push('/post-job' as any)} activeOpacity={0.85}>
            <Text style={s.emptyCtaText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View>
              {index > 0 && <View style={s.divider} />}
              <ConvoRow convo={item} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        />
      )}

      {/* ── BOTTOM NAV ── */}
      <View style={s.bottomNav}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'add', iconActive: 'add', label: '', route: '/post-job', center: true },
          { icon: 'chatbubble', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: true },
          { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/profile', active: false },
        ].map(tab =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={s.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={s.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={tab.active ? (tab.iconActive as any) : (tab.icon as any)} size={22} color={tab.active ? COLORS.primary : COLORS.muted} />
              <Text style={[s.navLabel, tab.active && s.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  unreadBadge: { backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  newBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary + '12', borderRadius: 20 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 12, marginHorizontal: 16, marginVertical: 10, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  list: { paddingBottom: 100 },
  divider: { height: 1, backgroundColor: '#F5F5F5' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  emptySub: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },
  emptyCta: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 6 },
  emptyCtaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ECECEC', flexDirection: 'row', alignItems: 'center', paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10, elevation: 10 },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500', color: COLORS.muted },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 },
});
