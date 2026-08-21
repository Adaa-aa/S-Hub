import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
  offer?: { kind: 'offer' | 'counter' | 'suggestion'; amount: number; label?: string };
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
    { id: 'm10', mine: false, text: 'Based on the room sizes, I can do this job for GH₵ 220. This includes all cleaning supplies and transport.', time: '10:55 AM', status: 'delivered', offer: { kind: 'offer', amount: 220, label: 'Worker Offer' } },
    { id: 'm11', mine: true, text: 'My budget is slightly lower. Would you be able to do it for GH₵ 150?', time: '10:58 AM', status: 'read', offer: { kind: 'counter', amount: 150, label: 'Your Counter' } },
    { id: 'm12', mine: false, text: "That's a bit low for the effort required. Let's meet in the middle?", time: '11:02 AM', status: 'delivered', offer: { kind: 'suggestion', amount: 180, label: 'New Suggested Price' } },
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
function MessageBubble({ msg, workerColor, T }: { msg: Message; workerColor: string; T: any }) {
  if (msg.offer) {
    const { kind, amount, label } = msg.offer;
    const isCounter = kind === 'counter';
    return (
      <View style={[mb.wrap, msg.mine ? mb.mine : mb.theirs, { maxWidth: '85%' }]}>
        <View
          style={[
            ob.card,
            isCounter
              ? { backgroundColor: COLORS.primary }
              : kind === 'suggestion'
              ? { backgroundColor: T.card, borderColor: COLORS.accent, borderWidth: 1, borderLeftWidth: 4 }
              : { backgroundColor: T.card, borderColor: T.border, borderWidth: 1 },
          ]}
        >
          <Text style={[ob.label, { color: isCounter ? 'rgba(255,255,255,0.85)' : COLORS.primary }]}>{label}</Text>
          {kind === 'suggestion' ? (
            <View style={ob.suggestionRow}>
              <Text style={[ob.text, { color: T.text }]}>{msg.text}</Text>
              <View style={[ob.priceBox, { backgroundColor: T.inputBg }]}>
                <Text style={[ob.priceBoxLabel, { color: T.subText }]}>{label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[ob.priceBoxValue, { color: COLORS.primary }]}>GH₵ {amount}</Text>
                  <MaterialCommunityIcons name="handshake-outline" size={16} color={COLORS.accentDark} />
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text style={[ob.text, { color: isCounter ? '#fff' : T.text }]}>
                {msg.text.split(String(amount)).map((part, i, arr) => (
                  <Text key={i}>
                    {part}
                    {i < arr.length - 1 && <Text style={{ fontWeight: '800' }}>{amount}</Text>}
                  </Text>
                ))}
              </Text>
            </>
          )}
        </View>
        <View style={[mb.metaRow, msg.mine && { justifyContent: 'flex-end' }]}>
          <Text style={[mb.time, { color: T.subText }]}>{msg.time}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[mb.wrap, msg.mine ? mb.mine : mb.theirs]}>
      <View style={[mb.bubble, msg.mine ? mb.bubbleMine : [mb.bubbleTheirs, { backgroundColor: T.card, borderColor: T.border }]]}>
        <Text style={[mb.text, msg.mine ? mb.textMine : [mb.textTheirs, { color: T.text }]]}>{msg.text}</Text>
      </View>
      <View style={[mb.metaRow, msg.mine && { justifyContent: 'flex-end' }]}>
        <Text style={[mb.time, { color: T.subText }]}>{msg.time}</Text>
        {msg.mine && (
          <Ionicons
            name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done-outline' : 'checkmark-outline'}
            size={13}
            color={msg.status === 'read' ? COLORS.primary : T.subText}
          />
        )}
      </View>
    </View>
  );
}

const ob = StyleSheet.create({
  card: { borderRadius: 14, padding: 12, gap: 6 },
  label: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  text: { fontSize: 13, lineHeight: 19 },
  suggestionRow: { gap: 8 },
  priceBox: { borderRadius: 10, padding: 10, gap: 2 },
  priceBoxLabel: { fontSize: 11, fontWeight: '600' },
  priceBoxValue: { fontSize: 16, fontWeight: '800' },
});

const mb = StyleSheet.create({
  wrap: { marginBottom: 10, maxWidth: '80%' },
  mine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  theirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { borderBottomLeftRadius: 4, borderWidth: 1 },
  text: { fontSize: 14, lineHeight: 21 },
  textMine: { color: '#fff' },
  textTheirs: {},
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3, paddingHorizontal: 4 },
  time: { fontSize: 10 },
});

/* ─── Date separator ─── */
function DateSep({ label, T }: { label: string; T: any }) {
  return (
    <View style={ds.wrap}>
      <View style={[ds.line, { backgroundColor: T.divider }]} />
      <Text style={[ds.text, { color: T.subText }]}>{label}</Text>
      <View style={[ds.line, { backgroundColor: T.divider }]} />
    </View>
  );
}
const ds = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 10 },
  line: { flex: 1, height: 1 },
  text: { fontSize: 11, fontWeight: '600' },
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [counterMode, setCounterMode] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [negotiationResolved, setNegotiationResolved] = useState(false);
  const listRef = useRef<FlatList>(null);

  const lastOffer = [...messages].reverse().find(m => m.offer)?.offer;

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

  const T = useThemeColors();
  if (!convo) return null;

  const handleAcceptOffer = () => {
    if (!lastOffer) return;
    setNegotiationResolved(true);
    setMessages(prev => [...prev, {
      id: `m_${Date.now()}`,
      mine: true,
      text: `Accepted at GH₵ ${lastOffer.amount}. Looking forward to it!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }]);
    Alert.alert('Offer Accepted', `You've accepted GH₵ ${lastOffer.amount} for this job.`);
  };

  const handleCancelRequest = () => {
    Alert.alert('Cancel Request?', 'This will cancel the current job request with this worker.', [
      { text: 'Keep Request', style: 'cancel' },
      { text: 'Cancel Request', style: 'destructive', onPress: () => setNegotiationResolved(true) },
    ]);
  };

  const sendCounterOffer = () => {
    const amount = parseFloat(counterAmount);
    if (!amount || amount <= 0) return;
    setMessages(prev => [...prev, {
      id: `m_${Date.now()}`,
      mine: true,
      text: `I can do it for GH₵ ${amount}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      offer: { kind: 'counter', amount, label: 'Your Counter' },
    }]);
    setCounterAmount('');
    setCounterMode(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleViewProfile = () => {
    setMenuVisible(false);
    router.push(`/worker-profile?id=${convo.id}` as any);
  };

  const handleDeleteChat = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Chat?',
      `This will delete your conversation with ${convo.workerName}. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleBlock = () => {
    setMenuVisible(false);
    Alert.alert(
      `Block ${convo.workerName}?`,
      'They will no longer be able to message or contact you.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Block', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleReport = () => {
    setMenuVisible(false);
    Alert.alert(
      `Report ${convo.workerName}`,
      'Our team will review this conversation. Are you sure you want to report this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => Alert.alert('Reported', "Thanks — our team will look into this within 24 hours."),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header, borderColor: T.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>

        {/* Worker avatar */}
        <View style={s.headerAvatarWrap}>
          <View style={[s.headerAvatar, { backgroundColor: convo.workerColor + '20' }]}>
            <Text style={[s.headerInitials, { color: convo.workerColor }]}>{convo.workerInitials}</Text>
          </View>
          {convo.online && <View style={[s.headerOnlineDot, { borderColor: T.header }]} />}
        </View>

        <View style={s.headerInfo}>
          <Text style={[s.headerName, { color: T.text }]}>{convo.workerName}</Text>
          <Text style={[s.headerStatus, { color: T.subText }]}>{convo.online ? '🟢 Online now' : 'Last seen recently'}</Text>
        </View>

        <TouchableOpacity style={s.headerActionBtn} activeOpacity={0.75} onPress={() => Alert.alert('Call', `Calling ${convo.workerName}...`)}>
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.headerActionBtn} activeOpacity={0.75} onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={20} color={T.subText} />
        </TouchableOpacity>
      </View>

      {/* ── DROPDOWN MENU ── */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={s.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={[s.menuCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <TouchableOpacity style={s.menuItem} activeOpacity={0.7} onPress={handleViewProfile}>
              <Ionicons name="person-outline" size={17} color={T.text} />
              <Text style={[s.menuItemText, { color: T.text }]}>View Profile</Text>
            </TouchableOpacity>
            <View style={[s.menuDivider, { backgroundColor: T.divider }]} />
            <TouchableOpacity style={s.menuItem} activeOpacity={0.7} onPress={handleDeleteChat}>
              <Ionicons name="trash-outline" size={17} color={T.text} />
              <Text style={[s.menuItemText, { color: T.text }]}>Delete Chat</Text>
            </TouchableOpacity>
            <View style={[s.menuDivider, { backgroundColor: T.divider }]} />
            <TouchableOpacity style={s.menuItem} activeOpacity={0.7} onPress={handleBlock}>
              <Ionicons name="ban-outline" size={17} color={COLORS.danger} />
              <Text style={[s.menuItemText, { color: COLORS.danger }]}>Block</Text>
            </TouchableOpacity>
            <View style={[s.menuDivider, { backgroundColor: T.divider }]} />
            <TouchableOpacity style={s.menuItem} activeOpacity={0.7} onPress={handleReport}>
              <Ionicons name="flag-outline" size={17} color={COLORS.danger} />
              <Text style={[s.menuItemText, { color: COLORS.danger }]}>Report</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

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
              {index === 0 && <DateSep label="Earlier" T={T} />}
              {index === messages.length - 3 && messages.length > 5 && <DateSep label="Today" T={T} />}
              <MessageBubble msg={item} workerColor={convo.workerColor} T={T} />
            </View>
          )}
          contentContainerStyle={s.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {showQuick && (
          <View style={[s.quickWrap, { backgroundColor: T.card, borderColor: T.border }]}>
            {QUICK_REPLIES.map(qr => (
              <TouchableOpacity key={qr} style={s.quickChip} onPress={() => send(qr)} activeOpacity={0.75}>
                <Text style={s.quickText}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {lastOffer && !negotiationResolved && (
          <View style={[s.negotiationBar, { backgroundColor: T.card, borderColor: T.border }]}>
            <View style={s.negotiationActionsRow}>
              <TouchableOpacity style={s.acceptOfferBtn} activeOpacity={0.85} onPress={handleAcceptOffer}>
                <Ionicons name="checkmark-circle-outline" size={17} color="#fff" />
                <Text style={s.acceptOfferBtnText}>Accept GH₵{lastOffer.amount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.cancelReqBtn, { borderColor: T.border }]} activeOpacity={0.85} onPress={handleCancelRequest}>
                <Ionicons name="close-circle-outline" size={17} color={T.text} />
                <Text style={[s.cancelReqBtnText, { color: T.text }]}>Cancel Request</Text>
              </TouchableOpacity>
            </View>
            {counterMode ? (
              <View style={s.counterInputRow}>
                <View style={[s.counterAmountBox, { backgroundColor: T.inputBg }]}>
                  <Text style={{ color: COLORS.primary, fontWeight: '800' }}>GH₵</Text>
                  <TextInput
                    style={[s.counterAmountInput, { color: T.text }]}
                    placeholder="0.00"
                    placeholderTextColor={T.subText}
                    keyboardType="decimal-pad"
                    value={counterAmount}
                    onChangeText={setCounterAmount}
                    autoFocus
                  />
                </View>
                <TouchableOpacity style={s.sendBtn} activeOpacity={0.8} onPress={sendCounterOffer}>
                  <Ionicons name="send" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={s.counterOfferLink} onPress={() => setCounterMode(true)} activeOpacity={0.7}>
                <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 12 }}>Send Counter-offer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={[s.inputBar, { backgroundColor: T.card, borderColor: T.border }]}>
          <TouchableOpacity style={s.attachBtn} activeOpacity={0.75} onPress={() => Alert.alert('Attach', 'File picker coming soon.')}>
            <Ionicons name="attach-outline" size={22} color={T.subText} />
          </TouchableOpacity>
          <TextInput
            style={[s.input, { backgroundColor: T.inputBg, color: T.text }]}
            placeholder="Type a message..."
            placeholderTextColor={T.subText}
            value={input}
            onChangeText={v => { setInput(v); setShowQuick(false); }}
            multiline
            maxLength={500}
            returnKeyType="default"
          />
          <TouchableOpacity style={[s.sendBtn, input.trim().length === 0 && s.sendBtnDisabled]} onPress={() => send(input)} activeOpacity={0.8} disabled={input.trim().length === 0}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerAvatarWrap: { position: 'relative' },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerInitials: { fontSize: 15, fontWeight: '800' },
  headerOnlineDot: { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2, borderColor: COLORS.card },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700' },
  headerStatus: { fontSize: 11, marginTop: 1 },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerActionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  /* Dropdown menu */
  menuBackdrop: { flex: 1 },
  menuCard: { position: 'absolute', top: 58, right: 12, minWidth: 190, borderRadius: 14, borderWidth: 1, paddingVertical: 4, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  menuItemText: { fontSize: 14, fontWeight: '600' },
  menuDivider: { height: 1, marginHorizontal: 12 },

  jobBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary + '10', paddingHorizontal: 16, paddingVertical: 9, borderBottomWidth: 1, borderColor: COLORS.primary + '25' },
  jobBannerIcon: { fontSize: 16 },
  jobBannerText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  msgList: { paddingHorizontal: 14, paddingBottom: 12, paddingTop: 4 },

  quickWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1 },
  quickChip: { borderRadius: 18, borderWidth: 1.5, borderColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6 },
  quickText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10, paddingVertical: 8, gap: 8, borderTopWidth: 1 },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  input: { flex: 1, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, maxHeight: 110, lineHeight: 20 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  sendBtnDisabled: { backgroundColor: COLORS.primary + '50' },

  /* Negotiation bar */
  negotiationBar: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, borderTopWidth: 1, gap: 8 },
  negotiationActionsRow: { flexDirection: 'row', gap: 10 },
  acceptOfferBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 46, borderRadius: 12, backgroundColor: COLORS.primary,
  },
  acceptOfferBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  cancelReqBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 46, borderRadius: 12, borderWidth: 1.5,
  },
  cancelReqBtnText: { fontSize: 13, fontWeight: '700' },
  counterOfferLink: { alignItems: 'center', paddingVertical: 4 },
  counterInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterAmountBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  counterAmountInput: { flex: 1, fontSize: 14, padding: 0 },
});
