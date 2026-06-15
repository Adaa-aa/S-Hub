import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONVERSATIONS } from './messages';

/* ─── Types ─── */
interface Message {
  id: string;
  text: string;
  mine: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

/* ─── Sample chat histories keyed by conversation id ─── */
const CHAT_DATA: Record<string, Message[]> = {
  c1: [
    { id: 'm1',  mine: false, text: 'Hello! I saw your job posting for a leaking bathroom pipe. I can help.', time: '9:02 AM', status: 'read' },
    { id: 'm2',  mine: true,  text: 'Hi Kofi! Great, how soon can you come?', time: '9:05 AM', status: 'read' },
    { id: 'm3',  mine: false, text: 'I can be there by 11 AM today. Is that okay?', time: '9:06 AM', status: 'read' },
    { id: 'm4',  mine: true,  text: 'Yes, that works! The pipe is under the bathroom sink.', time: '9:08 AM', status: 'read' },
    { id: 'm5',  mine: false, text: 'Alright. Just so you know, I\'ll need to check the main water valve too to isolate the leak properly.', time: '9:10 AM', status: 'read' },
    { id: 'm6',  mine: true,  text: 'Sure, no problem. I\'ll make sure it\'s accessible.', time: '9:11 AM', status: 'read' },
    { id: 'm7',  mine: false, text: 'Perfect. My rate is GH₵ 450 for standard pipe repair. Materials included.', time: '9:13 AM', status: 'read' },
    { id: 'm8',  mine: true,  text: 'That\'s fine. See you at 11.', time: '9:14 AM', status: 'read' },
    { id: 'm9',  mine: false, text: 'I\'m about 10 minutes away, please make sure the main valve is accessible.', time: '10:52 AM', status: 'delivered' },
  ],
  c2: [
    { id: 'm1', mine: false, text: 'Good day! I\'m a certified electrician. I can rewire your bedroom sockets.', time: 'Mon 2:00 PM', status: 'read' },
    { id: 'm2', mine: true,  text: 'Hello Kwame. How long will the job take?', time: 'Mon 2:10 PM', status: 'read' },
    { id: 'm3', mine: false, text: 'For 4 sockets it should take about 3 hours. I\'ll need to cut power to the room temporarily.', time: 'Mon 2:12 PM', status: 'read' },
    { id: 'm4', mine: true,  text: 'That\'s fine. Can you come on Monday?', time: 'Mon 2:15 PM', status: 'read' },
    { id: 'm5', mine: false, text: 'Monday works. What time?', time: 'Mon 2:16 PM', status: 'read' },
    { id: 'm6', mine: true,  text: '2 PM on Monday is perfect.', time: 'Mon 2:18 PM', status: 'read' },
    { id: 'm7', mine: false, text: 'Great, I\'ll bring the extra wiring materials. See you Monday!', time: 'Mon 2:20 PM', status: 'delivered' },
  ],
  c3: [
    { id: 'm1', mine: false, text: 'Hi, I noticed your post for cabinet repair. I specialize in furniture and cabinet work.', time: 'Tue 10:00 AM', status: 'read' },
    { id: 'm2', mine: true,  text: 'Great! The door hinge is broken and one shelf has cracked.', time: 'Tue 10:05 AM', status: 'read' },
    { id: 'm3', mine: false, text: 'That\'s straightforward. I can replace the hinge and reinforce the shelf. GH₵ 350.', time: 'Tue 10:08 AM', status: 'read' },
    { id: 'm4', mine: true,  text: 'Works for me. When are you available?', time: 'Tue 10:10 AM', status: 'read' },
    { id: 'm5', mine: false, text: 'I\'m free Thursday morning and Saturday afternoon.', time: 'Tue 10:11 AM', status: 'read' },
    { id: 'm6', mine: true,  text: 'Sounds good, Thursday at 10 AM works perfectly.', time: 'Tue 10:14 AM', status: 'read' },
  ],
  c4: [
    { id: 'm1', mine: false, text: 'Hi! I\'m a professional cleaner. I can do a full house deep clean.', time: 'Wed 8:30 AM', status: 'read' },
    { id: 'm2', mine: true,  text: 'Hello Nana. How many rooms can you handle?', time: 'Wed 8:35 AM', status: 'read' },
    { id: 'm3', mine: false, text: 'I typically handle up to 4 bedrooms + kitchen + bathrooms in a day. How big is your place?', time: 'Wed 8:37 AM', status: 'read' },
    { id: 'm4', mine: true,  text: '3 bedrooms, 2 bathrooms and a living room.', time: 'Wed 8:40 AM', status: 'read' },
    { id: 'm5', mine: false, text: 'That works. I can do it Saturday starting at 8 AM. GH₵ 250 all inclusive.', time: 'Wed 8:42 AM', status: 'read' },
    { id: 'm6', mine: true,  text: 'Can you bring your own cleaning supplies?', time: 'Wed 8:45 AM', status: 'sent' },
  ],
  c5: [
    { id: 'm1', mine: false, text: 'Good day! I saw your painting job. I have 7 years experience.', time: 'Mon 11:00 AM', status: 'read' },
    { id: 'm2', mine: true,  text: 'Hi Ama! The living room is about 25 sq meters. We want a warm earthy tone.', time: 'Mon 11:05 AM', status: 'read' },
    { id: 'm3', mine: false, text: 'Beautiful choice! I\'d recommend Dulux Earthen Sand or Desert Beige.', time: 'Mon 11:07 AM', status: 'read' },
    { id: 'm4', mine: true,  text: 'How much would that cost?', time: 'Mon 11:10 AM', status: 'read' },
    { id: 'm5', mine: false, text: 'I can offer GH₵ 550 for a 2-coat finish with premium paint.', time: 'Mon 11:12 AM', status: 'read' },
  ],
  c6: [
    { id: 'm1', mine: false, text: 'Hello, I can repair your roof leak. What area is affected?', time: 'Thu 3:00 PM', status: 'read' },
    { id: 'm2', mine: true,  text: 'It\'s near the gutter on the north side. About 2 meters affected.', time: 'Thu 3:05 PM', status: 'read' },
    { id: 'm3', mine: false, text: 'I see. That would require new roof tiles and waterproofing. GH₵ 800.', time: 'Thu 3:08 PM', status: 'read' },
    { id: 'm4', mine: true,  text: 'Unfortunately I had to cancel this job. Sorry for the inconvenience.', time: 'Thu 3:15 PM', status: 'read' },
    { id: 'm5', mine: false, text: 'No problem at all. Feel free to contact me when you\'re ready.', time: 'Thu 3:17 PM', status: 'read' },
  ],
};

/* ─── Message bubble ─── */
function MessageBubble({ msg, workerColor }: { msg: Message; workerColor: string }) {
  return (
    <View style={[mb.wrap, msg.mine ? mb.mine : mb.theirs]}>
      <View style={[mb.bubble, msg.mine ? mb.bubbleMine : mb.bubbleTheirs]}>
        <Text style={[mb.text, msg.mine ? mb.textMine : mb.textTheirs]}>{msg.text}</Text>
      </View>
      <View style={[mb.metaRow, msg.mine && { justifyContent: 'flex-end' }]}>
        <Text style={mb.time}>{msg.time}</Text>
        {msg.mine && (
          <Ionicons
            name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done-outline' : 'checkmark-outline'}
            size={13}
            color={msg.status === 'read' ? COLORS.primary : COLORS.muted}
          />
        )}
      </View>
    </View>
  );
}

const mb = StyleSheet.create({
  wrap: { marginBottom: 10, maxWidth: '80%' },
  mine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  theirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#EBEBEB' },
  text: { fontSize: 14, lineHeight: 21 },
  textMine: { color: '#fff' },
  textTheirs: { color: '#1A1A1A' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3, paddingHorizontal: 4 },
  time: { fontSize: 10, color: COLORS.muted },
});

/* ─── Date separator ─── */
function DateSep({ label }: { label: string }) {
  return (
    <View style={ds.wrap}>
      <View style={ds.line} />
      <Text style={ds.text}>{label}</Text>
      <View style={ds.line} />
    </View>
  );
}
const ds = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: '#EBEBEB' },
  text: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
});

/* ─── Quick replies ─── */
const QUICK_REPLIES = ['On my way!', 'What time?', 'Sounds good', 'Can we reschedule?'];

/* ─── Main Chat Screen ─── */
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const convo = CONVERSATIONS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>(CHAT_DATA[id ?? 'c1'] ?? []);
  const [input, setInput] = useState('');
  const [showQuick, setShowQuick] = useState(true);
  const listRef = useRef<FlatList>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      mine: true,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setShowQuick(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 150);
  }, []);

  if (!convo) return null;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        {/* Worker avatar */}
        <View style={s.headerAvatarWrap}>
          <View style={[s.headerAvatar, { backgroundColor: convo.workerColor + '20' }]}>
            <Text style={[s.headerInitials, { color: convo.workerColor }]}>{convo.workerInitials}</Text>
          </View>
          {convo.online && <View style={s.headerOnlineDot} />}
        </View>

        {/* Worker info */}
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{convo.workerName}</Text>
          <Text style={s.headerStatus}>{convo.online ? '🟢 Online now' : 'Last seen recently'}</Text>
        </View>

        {/* Actions */}
        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.headerActionBtn}
            activeOpacity={0.75}
            onPress={() => Alert.alert('Call', `Calling ${convo.workerName}...`)}
          >
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.headerActionBtn}
            activeOpacity={0.75}
            onPress={() => Alert.alert('More', 'Options: View profile, Block, Report')}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── JOB CONTEXT BANNER ── */}
      <TouchableOpacity
        style={s.jobBanner}
        activeOpacity={0.8}
        onPress={() => router.push('/bookings' as any)}
      >
        <Text style={s.jobBannerIcon}>{convo.jobIcon}</Text>
        <Text style={s.jobBannerText} numberOfLines={1}>{convo.jobTitle}</Text>
        <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
      </TouchableOpacity>

      {/* ── MESSAGES ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View>
              {/* Date separator before first message */}
              {index === 0 && <DateSep label="Earlier" />}
              {/* Date separator before last few messages */}
              {index === messages.length - 3 && messages.length > 5 && <DateSep label="Today" />}
              <MessageBubble msg={item} workerColor={convo.workerColor} />
            </View>
          )}
          contentContainerStyle={s.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* ── QUICK REPLIES ── */}
        {showQuick && (
          <View style={s.quickWrap}>
            {QUICK_REPLIES.map(qr => (
              <TouchableOpacity key={qr} style={s.quickChip} onPress={() => send(qr)} activeOpacity={0.75}>
                <Text style={s.quickText}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── INPUT BAR ── */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.attachBtn} activeOpacity={0.75} onPress={() => Alert.alert('Attach', 'File picker coming soon.')}>
            <Ionicons name="attach-outline" size={22} color={COLORS.muted} />
          </TouchableOpacity>
          <TextInput
            style={s.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.muted}
            value={input}
            onChangeText={v => { setInput(v); setShowQuick(false); }}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[s.sendBtn, input.trim().length === 0 && s.sendBtnDisabled]}
            onPress={() => send(input)}
            activeOpacity={0.8}
            disabled={input.trim().length === 0}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0', gap: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerInitials: { fontSize: 15, fontWeight: '800' },
  headerOnlineDot: { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#fff' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  headerStatus: { fontSize: 11, color: COLORS.muted, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerActionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  /* Job banner */
  jobBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary + '10', paddingHorizontal: 16, paddingVertical: 9, borderBottomWidth: 1, borderColor: COLORS.primary + '25' },
  jobBannerIcon: { fontSize: 16 },
  jobBannerText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  /* Message list */
  msgList: { paddingHorizontal: 14, paddingBottom: 12, paddingTop: 4 },

  /* Quick replies */
  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F0F0F0' },
  quickChip: { borderRadius: 18, borderWidth: 1.5, borderColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6 },
  quickText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  /* Input bar */
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, gap: 8, borderTopWidth: 1, borderColor: '#F0F0F0' },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  input: { flex: 1, backgroundColor: '#F2F2F2', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: '#1A1A1A', maxHeight: 110, lineHeight: 20 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  sendBtnDisabled: { backgroundColor: COLORS.primary + '50' },
});
