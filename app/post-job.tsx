import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { useThemeColors } from '../context/ThemeContext';

/* ─── Types ─── */
type Step = 1 | 2 | 3;

const SERVICES = [
  { id: 'plumbing', label: 'Plumbing', icon: '🔧', color: '#006B3F' },
  { id: 'electrical', label: 'Electrical', icon: '⚡', color: '#F59E0B' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪚', color: '#92400E' },
  { id: 'painting', label: 'Painting', icon: '🖌️', color: '#3B82F6' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: '#8B5CF6' },
  { id: 'other', label: 'Other', icon: '⋯', color: '#6B7280' },
];

const DATES = ['Today', 'Tomorrow', 'Thu, Jun 16', 'Fri, Jun 17', 'Sat, Jun 18'];
const TIMES = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

/* ─── Step Indicator ─── */
function StepBar({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: 'Service' },
    { n: 2, label: 'Schedule' },
    { n: 3, label: 'Review' },
  ];
  return (
    <View style={sb.row}>
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <View key={s.n} style={sb.itemWrap}>
            {i > 0 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
            <View style={sb.bubble}>
              <View style={[sb.circle, (active || done) && sb.circleActive]}>
                {done
                  ? <Ionicons name="checkmark" size={13} color="#fff" />
                  : <Text style={[sb.num, active && sb.numActive]}>{s.n}</Text>
                }
              </View>
              <Text style={[sb.label, active && sb.labelActive]}>{s.label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 24, marginBottom: 28, marginTop: 8 },
  itemWrap: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  line: { height: 2, flex: 1, backgroundColor: '#E0E0E0', marginBottom: 16 },
  lineDone: { backgroundColor: COLORS.primary },
  bubble: { alignItems: 'center', gap: 5 },
  circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' },
  circleActive: { backgroundColor: COLORS.primary },
  num: { fontSize: 13, fontWeight: '700', color: '#999' },
  numActive: { color: '#fff' },
  label: { fontSize: 11, color: '#999', fontWeight: '500' },
  labelActive: { color: COLORS.primary, fontWeight: '700' },
});

/* ─── Photo slot ─── */
function PhotoSlot({ uri, onRemove }: { uri: string; onRemove: () => void }) {
  const EMOJIS: Record<string, string> = {
    'pipe1': '🔩', 'pipe2': '🚿',
  };
  return (
    <View style={ph.slot}>
      <View style={ph.preview}>
        <Text style={{ fontSize: 28 }}>{EMOJIS[uri] ?? '🖼️'}</Text>
      </View>
      <TouchableOpacity style={ph.removeBtn} onPress={onRemove}>
        <Ionicons name="close-circle" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const ph = StyleSheet.create({
  slot: { position: 'relative', marginRight: 10 },
  preview: { width: 72, height: 72, borderRadius: 10, backgroundColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  removeBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.danger, borderRadius: 10 },
});

/* ─── Main Screen ─── */
export default function PostJobScreen() {
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState('plumbing');
  const [showPicker, setShowPicker] = useState(false);
  const [desc, setDesc] = useState('');
  const [photos, setPhotos] = useState<string[]>(['pipe1', 'pipe2']);
  const [location, setLocation] = useState('Speedsaf Ayeduase, Kumasi');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('10:00 AM');
  const T = useThemeColors();

  const selectedSvc = SERVICES.find(s => s.id === service)!;

  const addPhoto = () => {
    const ids = ['pipe1', 'pipe2', 'photo3', 'photo4'];
    const next = ids.find(id => !photos.includes(id));
    if (next) setPhotos(p => [...p, next]);
  };

  const removePhoto = (uri: string) => setPhotos(p => p.filter(x => x !== uri));

  const goNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else router.replace(`/finding-worker?service=${encodeURIComponent(selectedSvc.label)}&jobTitle=${encodeURIComponent(desc.trim() || selectedSvc.label + ' job')}` as any);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
    else router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: T.card }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.card} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.topbar, { borderColor: T.border }]}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={T.text} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: T.text }]}>Post a Job</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* ── STEP INDICATOR ── */}
        <StepBar current={step} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {step === 1 && (
            <>
              <Text style={[styles.sectionTitle, { color: T.text }]}>What service do you need?</Text>

              <TouchableOpacity style={[styles.serviceCard, { backgroundColor: T.card, borderColor: T.border }]} onPress={() => setShowPicker(!showPicker)} activeOpacity={0.8}>
                <View style={[styles.svcIconWrap, { backgroundColor: selectedSvc.color + '20' }]}>
                  <Text style={styles.svcEmoji}>{selectedSvc.icon}</Text>
                </View>
                <View style={styles.svcInfo}>
                  <Text style={[styles.svcName, { color: T.text }]}>{selectedSvc.label}</Text>
                  <Text style={[styles.svcHint, { color: T.subText }]} numberOfLines={1}>
                    {desc.trim().length > 0 ? desc : 'Tap to describe your job'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={T.subText} />
              </TouchableOpacity>

              {showPicker && (
                <View style={[styles.pickerDropdown, { backgroundColor: T.card, borderColor: T.border }]}>
                  {SERVICES.map(svc => (
                    <TouchableOpacity
                      key={svc.id}
                      style={[styles.pickerItem, { borderColor: T.divider }, svc.id === service && styles.pickerItemActive]}
                      onPress={() => { setService(svc.id); setShowPicker(false); }}
                    >
                      <Text style={styles.pickerEmoji}>{svc.icon}</Text>
                      <Text style={[styles.pickerLabel, { color: T.text }, svc.id === service && styles.pickerLabelActive]}>
                        {svc.label}
                      </Text>
                      {svc.id === service && (
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.sectionTitle, { color: T.text }]}>Describe the job</Text>
              <TextInput
                style={[styles.descInput, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
                placeholder="There is a leak in the bathroom pipe."
                placeholderTextColor={T.subText}
                multiline
                numberOfLines={4}
                value={desc}
                onChangeText={setDesc}
                textAlignVertical="top"
              />

              <Text style={[styles.sectionTitle, { color: T.text }]}>
                Add photos <Text style={[styles.optional, { color: T.subText }]}>(optional)</Text>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
                {photos.map(uri => (
                  <PhotoSlot key={uri} uri={uri} onRemove={() => removePhoto(uri)} />
                ))}
                {photos.length < 4 && (
                  <TouchableOpacity style={[styles.addPhotoBtn, { backgroundColor: T.inputBg, borderColor: T.subText }]} onPress={addPhoto} activeOpacity={0.7}>
                    <Ionicons name="add" size={28} color={T.subText} />
                  </TouchableOpacity>
                )}
              </ScrollView>

              <Text style={[styles.sectionTitle, { color: T.text }]}>Job location</Text>
              <TouchableOpacity style={[styles.locationCard, { backgroundColor: T.card, borderColor: T.border }]} activeOpacity={0.8}>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.locationText, { color: T.text }]} numberOfLines={1}>{location}</Text>
                <Ionicons name="chevron-forward" size={18} color={T.subText} />
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.sectionTitle, { color: T.text }]}>Select a date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {DATES.map(d => (
                    <TouchableOpacity key={d} style={[styles.chipBtn, { backgroundColor: T.card, borderColor: T.border }, d === date && styles.chipBtnActive]} onPress={() => setDate(d)}>
                      <Text style={[styles.chipText, { color: T.subText }, d === date && styles.chipTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={[styles.sectionTitle, { color: T.text }]}>Select a time</Text>
              <View style={styles.timesGrid}>
                {TIMES.map(t => (
                  <TouchableOpacity key={t} style={[styles.chipBtn, { backgroundColor: T.card, borderColor: T.border }, t === time && styles.chipBtnActive]} onPress={() => setTime(t)}>
                    <Text style={[styles.chipText, { color: T.subText }, t === time && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: T.text }]}>How urgent is this?</Text>
              <View style={{ gap: 10 }}>
                {['Not urgent — anytime this week', 'Somewhat urgent — within 2 days', 'Emergency — as soon as possible'].map(opt => (
                  <TouchableOpacity key={opt} style={[styles.urgencyRow, { backgroundColor: T.card, borderColor: T.border }]}>
                    <View style={styles.urgencyRadio}>
                      {opt.includes('urgent — within') && <View style={styles.urgencyDot} />}
                    </View>
                    <Text style={[styles.urgencyText, { color: T.text }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[styles.sectionTitle, { color: T.text }]}>Review your job post</Text>

              <View style={[styles.reviewCard, { backgroundColor: T.card, borderColor: T.border }]}>
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Service</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]}>{selectedSvc.icon} {selectedSvc.label}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: T.divider }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Description</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]} numberOfLines={2}>{desc.trim() || '—'}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: T.divider }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Date</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]}>{date}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: T.divider }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Time</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]}>{time}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: T.divider }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Location</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]} numberOfLines={1}>{location}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: T.divider }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: T.subText }]}>Photos</Text>
                  <Text style={[styles.reviewValue, { color: T.text }]}>{photos.length} added</Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <MaterialIcons name="info-outline" size={16} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Workers near you will be notified and you'll receive quotes within minutes.
                </Text>
              </View>
            </>
          )}

        </ScrollView>

        <View style={[styles.footer, { backgroundColor: T.card, borderColor: T.border }]}>
          <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>
              {step === 3 ? 'Post Job' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '700' },

  /* Scroll */
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  optional: { fontSize: 13, fontWeight: '500' },

  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  svcIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svcEmoji: { fontSize: 22 },
  svcInfo: { flex: 1 },
  svcName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  svcHint: { fontSize: 12 },

  pickerDropdown: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: -16,
    marginBottom: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 1,
  },
  pickerItemActive: { backgroundColor: COLORS.primaryLight ?? '#E6F4EE' },
  pickerEmoji: { fontSize: 18 },
  pickerLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  pickerLabelActive: { color: COLORS.primary, fontWeight: '700' },

  descInput: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 22,
    lineHeight: 21,
  },

  /* Photos */
  photosRow: { marginBottom: 22 },
  addPhotoBtn: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  locationText: { flex: 1, fontSize: 14, fontWeight: '500' },

  chipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  chipBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  urgencyRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  urgencyText: { fontSize: 13, flex: 1 },

  reviewCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  reviewLabel: { fontSize: 13, fontWeight: '500' },
  reviewValue: { fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' },
  divider: { height: 1, marginHorizontal: 16 },

  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E6F4EE',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 12, color: COLORS.primary, lineHeight: 18, fontWeight: '500' },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
