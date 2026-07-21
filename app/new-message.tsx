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
import { CONVERSATIONS } from './messages';
import { WORKERS } from './search';

export default function NewMessageScreen() {
  const T = useThemeColors();
  const [search, setSearch] = useState('');

  const filtered = WORKERS.filter(w =>
    search.trim() === '' ? true :
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.skill.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectWorker = (worker: typeof WORKERS[number]) => {
    const existing = CONVERSATIONS.find(c => c.workerName === worker.name);
    if (existing) {
      router.push(`/chat?id=${existing.id}` as any);
      return;
    }
    const newId = `c${CONVERSATIONS.length + 1}`;
    CONVERSATIONS.push({
      id: newId,
      workerName: worker.name,
      workerInitials: worker.initials,
      workerColor: worker.color,
      jobTitle: worker.skill,
      jobIcon: '💬',
      lastMessage: '',
      lastMessageTime: 'Just now',
      lastMessageMine: false,
      unread: 0,
      online: worker.available,
    });
    router.push(`/chat?id=${newId}` as any);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: T.text }]}>New Message</Text>
        <View style={s.backBtn} />
      </View>

      <View style={[s.searchWrap, { backgroundColor: T.inputBg }]}>
        <Ionicons name="search-outline" size={17} color={T.subText} />
        <TextInput
          style={[s.searchInput, { color: T.text }]}
          placeholder="Search workers by name or skill"
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

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="person-outline" size={48} color={COLORS.primary + '50'} />
          <Text style={[s.emptyTitle, { color: T.text }]}>No workers found</Text>
          <Text style={[s.emptySub, { color: T.subText }]}>Try a different name or skill.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
          renderItem={({ item: worker, index }) => (
            <View>
              {index > 0 && <View style={[s.divider, { backgroundColor: T.divider }]} />}
              <TouchableOpacity
                style={[s.row, { backgroundColor: T.card }]}
                onPress={() => handleSelectWorker(worker)}
                activeOpacity={0.78}
              >
                <View style={s.avatarWrap}>
                  <View style={[s.avatar, { backgroundColor: worker.color + '20' }]}>
                    <Text style={[s.initials, { color: worker.color }]}>{worker.initials}</Text>
                  </View>
                  {worker.available && <View style={[s.onlineDot, { borderColor: T.card }]} />}
                </View>
                <View style={s.content}>
                  <Text style={[s.name, { color: T.text }]}>{worker.name}</Text>
                  <Text style={[s.skill, { color: T.subText }]}>{worker.skill}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[s.metaText, { color: T.subText }]}>{worker.rating} · {worker.distance}</Text>
                  </View>
                </View>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, marginHorizontal: 16, marginBottom: 10, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14 },

  list: { paddingBottom: 40 },
  divider: { height: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 16, fontWeight: '800' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2 },
  content: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  skill: { fontSize: 12, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, textAlign: 'center' },
});
