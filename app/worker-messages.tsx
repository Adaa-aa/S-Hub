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
import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
import WorkerNav from '@/components/WorkerNav';
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

/* ─── Conversation data (worker-side) ─── */
interface WorkerConversation {
  id: string;
  clientName: string;
  clientInitials: string;
  clientColor: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

const CONVERSATIONS: WorkerConversation[] = [
  {
    id: 'wc1', clientName: 'Akosua Badu', clientInitials: 'AB', clientColor: '#7C3AED',
    jobTitle: 'Fix leaking bathroom pipe', lastMessage: 'When can you come? The leak is getting worse.',
    lastMessageTime: '2 min ago', unread: 2, online: true,
  },
  {
    id: 'wc2', clientName: 'Ernest Ofori', clientInitials: 'EO', clientColor: '#1D6FBA',
    jobTitle: 'Bathroom installation', lastMessage: "I'll bring the materials on Monday morning.",
    lastMessageTime: '1 hr ago', unread: 0, online: true,
  },
  {
    id: 'wc3', clientName: 'Mabel Asante', clientInitials: 'MA', clientColor: '#D97706',
    jobTitle: 'Gutter cleaning & repair', lastMessage: 'Thanks for the quick response!',
    lastMessageTime: 'Yesterday', unread: 1, online: false,
  },
  {
    id: 'wc4', clientName: 'Linda Owusu', clientInitials: 'LO', clientColor: '#DC2626',
    jobTitle: 'Kitchen sink repair', lastMessage: 'Job completed. Please leave a review 🙏',
    lastMessageTime: '2 days ago', unread: 0, online: false,
  },
  {
    id: 'wc5', clientName: 'Kojo Antwi', clientInitials: 'KA', clientColor: '#0891B2',
    jobTitle: 'Water heater installation', lastMessage: 'Can you share a cost estimate first?',
    lastMessageTime: '3 days ago', unread: 0, online: false,
  },
];

export default function WorkerMessagesScreen() {
  const T = useThemeColors();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filtered = CONVERSATIONS.filter((c) =>
    search.trim() === ''
      ? true
      : c.clientName.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RequireVerifiedWorker>
    <SafeAreaView style={[styles.safe, { backgroundColor: T.bg }]} edges={['top']}>
      <StatusBar barStyle={T.statusBar} />

      <View style={styles.pageInner}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: T.text }]}>Messages</Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: T.inputBg }]}
          activeOpacity={0.8}
          onPress={() => {
            setShowSearch(!showSearch);
            if (showSearch) setSearch('');
          }}
        >
          <Ionicons name={showSearch ? 'close' : 'search-outline'} size={wms(17)} color={T.text} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View style={[styles.searchWrap, { backgroundColor: T.inputBg, borderColor: T.border }]}>
          <Ionicons name="search-outline" size={wms(15)} color={T.subText} />
          <TextInput
            style={[styles.searchInput, { color: T.text }]}
            placeholder="Search conversations"
            placeholderTextColor={T.subText}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoFocus
          />
        </View>
      )}

      {/* Conversations */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbubbles-outline" size={wms(44)} color={T.subText + '50'} />
          <Text style={[styles.emptyTitle, { color: T.text }]}>No messages yet</Text>
          <Text style={[styles.emptySub, { color: T.subText }]}>
            When clients contact you about jobs, conversations will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: T.divider }]} />}
          renderItem={({ item: convo }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/chat?id=${convo.id}` as any)}
              activeOpacity={0.75}
            >
              <View style={styles.avatarWrap}>
                <View style={[styles.avatar, { backgroundColor: convo.clientColor + '18' }]}>
                  <Text style={[styles.initials, { color: convo.clientColor }]}>{convo.clientInitials}</Text>
                </View>
                {convo.online && <View style={[styles.onlineDot, { borderColor: T.bg }]} />}
              </View>

              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.name, { color: T.text }]} numberOfLines={1}>{convo.clientName}</Text>
                  <Text style={[styles.time, { color: convo.unread > 0 ? COLORS.primary : T.subText }]}>
                    {convo.lastMessageTime}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.lastMsg,
                    { color: convo.unread > 0 ? T.text : T.subText },
                    convo.unread > 0 && { fontWeight: '600' },
                  ]}
                  numberOfLines={1}
                >
                  {convo.lastMessage}
                </Text>
              </View>

              {convo.unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{convo.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
      </View>

      <WorkerNav active="messages" />
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: ws(20), paddingTop: wvs(6), paddingBottom: wvs(10),
  },
  title: { fontSize: wms(22), fontWeight: '800' },
  iconBtn: {
    width: ws(36), height: ws(36), borderRadius: ws(18),
    alignItems: 'center', justifyContent: 'center',
  },

  /* Search */
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: ws(8),
    marginHorizontal: ws(20), marginBottom: wvs(10),
    borderRadius: ws(12), paddingHorizontal: ws(12), paddingVertical: wvs(9),
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: wms(13.5) },

  /* List */
  list: { paddingBottom: wvs(100) },
  divider: { height: 1, marginLeft: ws(72) },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: ws(20), paddingVertical: wvs(12), gap: ws(12),
  },

  /* Avatar */
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: ws(46), height: ws(46), borderRadius: ws(23),
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { fontSize: wms(14.5), fontWeight: '800' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: ws(11), height: ws(11), borderRadius: ws(5.5),
    backgroundColor: '#22C55E', borderWidth: 2,
  },

  /* Content */
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: wvs(3), gap: ws(8),
  },
  name: { flex: 1, fontSize: wms(14.5), fontWeight: '700' },
  time: { fontSize: wms(11) },
  lastMsg: { fontSize: wms(12.5) },
  badge: {
    backgroundColor: COLORS.primary, borderRadius: ws(10),
    minWidth: ws(20), height: ws(20), alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: ws(5),
  },
  badgeText: { fontSize: wms(11), fontWeight: '800', color: '#fff' },

  /* Empty */
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: ws(40), gap: wvs(10),
  },
  emptyTitle: { fontSize: wms(16), fontWeight: '700' },
  emptySub: { fontSize: wms(12.5), textAlign: 'center', lineHeight: wms(18) },
});
