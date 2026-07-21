import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
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

export interface Conversation {
  id: string; workerName: string; workerInitials: string; workerColor: string;
  jobTitle: string; jobIcon: string; lastMessage: string; lastMessageTime: string;
  lastMessageMine: boolean; unread: number; online: boolean;
}

export const CONVERSATIONS: Conversation[] = [
  { id: 'c1', workerName: 'Kofi Mensah', workerInitials: 'KM', workerColor: '#006B3F', jobTitle: 'Fix leaking bathroom pipe', jobIcon: '🔧', lastMessage: "I'm about 10 minutes away, please make sure the main valve is accessible.", lastMessageTime: '2 min ago', lastMessageMine: false, unread: 2, online: true },
  { id: 'c2', workerName: 'Kwame Adjei', workerInitials: 'KA', workerColor: '#1D6FBA', jobTitle: 'Rewire bedroom sockets', jobIcon: '⚡', lastMessage: "Great, I'll bring the extra wiring materials. See you Monday!", lastMessageTime: '1 hr ago', lastMessageMine: false, unread: 1, online: true },
  { id: 'c3', workerName: 'Yaw Boateng', workerInitials: 'YB', workerColor: '#92400E', jobTitle: 'Kitchen cabinet repair', jobIcon: '🪚', lastMessage: 'You: Sounds good, Thursday at 10 AM works perfectly.', lastMessageTime: 'Yesterday', lastMessageMine: true, unread: 0, online: false },
  { id: 'c4', workerName: 'Nana Asante', workerInitials: 'NA', workerColor: '#0891B2', jobTitle: 'Full house deep cleaning', jobIcon: '🧹', lastMessage: 'You: Can you bring your own cleaning supplies?', lastMessageTime: 'Yesterday', lastMessageMine: true, unread: 0, online: false },
  { id: 'c5', workerName: 'Ama Owusu', workerInitials: 'AO', workerColor: '#7C3AED', jobTitle: 'Paint living room walls', jobIcon: '🖌️', lastMessage: 'I can offer GH₵ 550 for a 2-coat finish with premium paint.', lastMessageTime: '2 days ago', lastMessageMine: false, unread: 0, online: false },
  { id: 'c6', workerName: 'Abena Frimpong', workerInitials: 'AF', workerColor: '#DC2626', jobTitle: 'Roof leak repair', jobIcon: '🏗️', lastMessage: 'You: Unfortunately I had to cancel this job. Sorry for the inconvenience.', lastMessageTime: '4 days ago', lastMessageMine: true, unread: 0, online: false },
];

export default function MessagesScreen() {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const T = useThemeColors();

  const totalUnread = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);
  const filtered = CONVERSATIONS.filter(c =>
    search.trim() === '' ? true :
      c.workerName.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header }]}>
        <View style={s.headerLeft}>
          <Text style={[s.title, { color: T.text }]}>Messages</Text>
          {totalUnread > 0 && (
            <View style={s.unreadBadge}><Text style={s.unreadBadgeText}>{totalUnread}</Text></View>
          )}
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.iconBtn}
            activeOpacity={0.8}
            onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearch('');
            }}
          >
            <Ionicons name={showSearch ? 'close' : 'search-outline'} size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} activeOpacity={0.8} onPress={() => router.push('/new-message' as any)}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={[s.searchWrap, { backgroundColor: T.inputBg }]}>
          <Ionicons name="search-outline" size={17} color={T.subText} />
          <TextInput
            style={[s.searchInput, { color: T.text }]}
            placeholder="Search"
            placeholderTextColor={T.subText}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={17} color={T.subText} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="chatbubbles-outline" size={54} color={COLORS.primary + '50'} />
          <Text style={[s.emptyTitle, { color: T.text }]}>No conversations</Text>
          <Text style={[s.emptySub, { color: T.subText }]}>Post a job and connect with workers to start chatting.</Text>
          <TouchableOpacity style={s.emptyCta} onPress={() => router.push('/post-a-job' as any)} activeOpacity={0.85}>
            <Text style={s.emptyCtaText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item: convo, index }) => (
            <View>
              {index > 0 && <View style={[s.divider, { backgroundColor: T.divider }]} />}
              <TouchableOpacity
                style={[s.row, { backgroundColor: T.card }]}
                onPress={() => router.push(`/chat?id=${convo.id}` as any)}
                activeOpacity={0.78}
              >
                <View style={s.avatarWrap}>
                  <View style={[s.avatar, { backgroundColor: convo.workerColor + '20' }]}>
                    <Text style={[s.initials, { color: convo.workerColor }]}>{convo.workerInitials}</Text>
                  </View>
                  {convo.online && <View style={[s.onlineDot, { borderColor: T.card }]} />}
                </View>
                <View style={s.content}>
                  <View style={s.topRow}>
                    <Text style={[s.name, { color: T.text }]}>{convo.workerName}</Text>
                    <Text style={[s.time, { color: convo.unread > 0 ? COLORS.primary : T.subText }, convo.unread > 0 && { fontWeight: '700' }]}>{convo.lastMessageTime}</Text>
                  </View>
                  <View style={[s.jobPill, { backgroundColor: T.inputBg }]}>
                    <Text style={s.jobIcon}>{convo.jobIcon}</Text>
                    <Text style={[s.jobTitle, { color: T.subText }]} numberOfLines={1}>{convo.jobTitle}</Text>
                  </View>
                  <View style={s.bottomRow}>
                    <Text style={[s.lastMsg, { color: convo.unread > 0 ? T.text : T.subText }, convo.unread > 0 && { fontWeight: '600' }]} numberOfLines={1}>{convo.lastMessage}</Text>
                    {convo.unread > 0 && (
                      <View style={s.badge}><Text style={s.badgeText}>{convo.unread}</Text></View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        />
      )}

      <View style={[s.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'add', iconActive: 'add', label: '', route: '/post-a-job', center: true },
          { icon: 'chatbubble', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: true },
          { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/profile', active: false },
        ].map(tab =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={s.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={s.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={tab.active ? (tab.iconActive as any) : (tab.icon as any)} size={22} color={tab.active ? COLORS.primary : T.subText} />
              <Text style={[s.navLabel, { color: T.subText }, tab.active && s.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  unreadBadge: { backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary + '12', borderRadius: 20 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, marginHorizontal: 16, marginVertical: 10, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  list: { paddingBottom: 100 },
  divider: { height: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 18, fontWeight: '800' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2 },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700' },
  time: { fontSize: 11 },
  jobPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 5 },
  jobIcon: { fontSize: 11 },
  jobTitle: { fontSize: 11, fontWeight: '500', maxWidth: 180 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lastMsg: { flex: 1, fontSize: 13 },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  emptyCta: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 6 },
  emptyCtaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10, elevation: 10 },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 },
});
