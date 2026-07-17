import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

/* ─── Constants ─── */
const TOTAL_STEPS = 4;

const SKILL_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', icon: '🔧', color: '#006B3F' },
  { id: 'electrical', label: 'Electrical', icon: '⚡', color: '#F59E0B' },
  { id: 'carpentry', label: 'Carpentry', icon: '🪚', color: '#92400E' },
  { id: 'painting', label: 'Painting', icon: '🖌️', color: '#3B82F6' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: '#8B5CF6' },
  { id: 'masonry', label: 'Masonry', icon: '🧱', color: '#DC2626' },
  { id: 'welding', label: 'Welding', icon: '🔩', color: '#64748B' },
  { id: 'ac', label: 'AC & Cooling', icon: '❄️', color: '#0891B2' },
  { id: 'tiling', label: 'Tiling', icon: '🏗️', color: '#D97706' },
  { id: 'roofing', label: 'Roofing', icon: '🏚️', color: '#BE185D' },
  { id: 'security', label: 'Security/CCTV', icon: '📷', color: '#374151' },
  { id: 'other', label: 'Other', icon: '⋯', color: '#6B7280' },
];

const EXPERIENCE_OPTIONS = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
const AVAILABILITY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const AVAILABILITY_TIMES = ['Morning (6am–12pm)', 'Afternoon (12pm–6pm)', 'Evening (6pm–10pm)'];
const ID_TYPES = ['Ghana Card', 'Voter ID', 'Passport', "Driver's Licence"];

/* ─── Step indicator ─── */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={sb.wrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            sb.seg,
            i < current && sb.segDone,
            i === current - 1 && sb.segActive,
          ]}
        />
      ))}
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 4, paddingHorizontal: 16, paddingVertical: 10 },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  segDone: { backgroundColor: COLORS.primary },
  segActive: { backgroundColor: COLORS.primary },
});

/* ─── Field label ─── */
function FieldLabel({ label, required, color }: { label: string; required?: boolean; color: string }) {
  return (
    <Text style={[fl.label, { color }]}>
      {label}{required && <Text style={fl.req}> *</Text>}
    </Text>
  );
}
const fl = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  req: { color: COLORS.danger },
});

/* ─── Info box ─── */
function InfoBox({ text }: { text: string }) {
  return (
    <View style={ib.box}>
      <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
      <Text style={ib.text}>{text}</Text>
    </View>
  );
}
const ib = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14, marginTop: 4, marginBottom: 16 },
  text: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '500', lineHeight: 18 },
});

/* ─── Main screen ─── */
export default function WorkerSetupScreen() {
  const [step, setStep] = useState(1);
  const T = useThemeColors();

  /* Step 1 – Skills */
  const [skills, setSkills] = useState<string[]>([]);

  /* Step 2 – Profile */
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');

  /* Step 3 – Availability & Rate */
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [ratePerHour, setRate] = useState('');
  const [ratePerJob, setRateJ] = useState('');

  /* Step 4 – Verification */
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfie] = useState(false);

  /* Submission */
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (id: string) =>
    setSkills(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleDay = (d: string) => setDays(a => a.includes(d) ? a.filter(x => x !== d) : [...a, d]);
  const toggleTime = (t: string) => setTimes(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t]);

  const validate = (): boolean => {
    if (step === 1 && skills.length === 0) {
      Alert.alert('Select Skills', 'Please select at least one skill to continue.'); return false;
    }
    if (step === 2 && (!firstName.trim() || !lastName.trim() || !phone.trim())) {
      Alert.alert('Required Fields', 'Please fill in your name and phone number.'); return false;
    }
    if (step === 3 && (days.length === 0 || !ratePerHour)) {
      Alert.alert('Availability & Rate', 'Please select at least one available day and set your hourly rate.'); return false;
    }
    if (step === 4 && (!idType || !idUploaded)) {
      Alert.alert('Verification Required', 'Please select your ID type and upload a photo to continue.'); return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return; }
    setSubmitted(true);
  };

  const stepTitles = [
    'Your Skills',
    'About You',
    'Availability & Pricing',
    'Identity Verification',
  ];

  const stepSubs = [
    'Select every service you offer — clients will search for these.',
    'Tell clients who you are and what makes you stand out.',
    'When can you work, and what do you charge?',
    'We verify every worker to build trust on the platform.',
  ];

  /* ── Success screen ── */
  if (submitted) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
        <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.successScroll}
        >
          {/* Animated check circle */}
          <View style={[s.successCircleOuter, { backgroundColor: COLORS.primaryLight }]}>
            <View style={[s.successCircleInner, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="checkmark" size={52} color="#fff" />
            </View>
          </View>

          <Text style={[s.successTitle, { color: T.text }]}>Profile Submitted! 🎉</Text>
          <Text style={[s.successSub, { color: T.subText }]}>
            Thank you for joining S-Hub. Our team will review your profile and verify your details.
          </Text>

          {/* What happens next */}
          <View style={[s.nextStepsCard, { backgroundColor: T.card, borderColor: T.border }]}>
            <Text style={[s.nextStepsTitle, { color: T.text }]}>What happens next?</Text>
            {[
              { icon: 'search-outline',             text: 'Our team reviews your skills and ID within 24 hours.' },
              { icon: 'notifications-outline',       text: 'You\'ll get an SMS & app notification once approved.' },
              { icon: 'briefcase-outline',           text: 'Once live, clients near you can discover and hire you.' },
              { icon: 'star-outline',                text: 'Build your rating with every completed job.' },
            ].map((item, i) => (
              <View key={i} style={s.nextStepRow}>
                <View style={[s.nextStepIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                </View>
                <Text style={[s.nextStepText, { color: T.subText }]}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Status badge */}
          <View style={[s.statusBadge, { backgroundColor: '#FEF3C7' }]}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#D97706" />
            <Text style={s.statusBadgeText}>Review pending · Usually within 24 hours</Text>
          </View>

          {/* CTAs */}
          <TouchableOpacity
            style={s.successPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/worker-setup' as any)}
          >
            <MaterialCommunityIcons name="account-hard-hat-outline" size={18} color="#fff" />
            <Text style={s.successPrimaryBtnText}>View My Worker Setup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.successSecondaryBtn, { borderColor: T.border }]}
            activeOpacity={0.75}
            onPress={() => router.replace('/(tabs)/home' as any)}
          >
            <Text style={[s.successSecondaryBtnText, { color: T.subText }]}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      {/* ── HEADER ── */}
      <View style={[s.header, { backgroundColor: T.header, borderColor: T.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => step > 1 ? setStep(p => p - 1) : router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, { color: T.text }]}>Become a Worker</Text>
          <Text style={[s.headerSub, { color: T.subText }]}>Step {step} of {TOTAL_STEPS}</Text>
        </View>
        <View style={[s.stepBadge, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={s.stepBadgeText}>{step}/{TOTAL_STEPS}</Text>
        </View>
      </View>

      {/* ── STEP BAR ── */}
      <StepBar current={step} total={TOTAL_STEPS} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step title */}
          <Text style={[s.stepTitle, { color: T.text }]}>{stepTitles[step - 1]}</Text>
          <Text style={[s.stepSub, { color: T.subText }]}>{stepSubs[step - 1]}</Text>

          {/* ════ STEP 1 — Skills ════ */}
          {step === 1 && (
            <>
              <View style={s.skillsGrid}>
                {SKILL_CATEGORIES.map(cat => {
                  const active = skills.includes(cat.id);
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        s.skillTile,
                        { backgroundColor: T.card, borderColor: active ? cat.color : T.border },
                        active && { backgroundColor: cat.color + '10' },
                      ]}
                      onPress={() => toggleSkill(cat.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={s.skillTileEmoji}>{cat.icon}</Text>
                      <Text style={[s.skillTileLabel, { color: active ? cat.color : T.text }]}>{cat.label}</Text>
                      {active && (
                        <View style={[s.skillCheck, { backgroundColor: cat.color }]}>
                          <Ionicons name="checkmark" size={10} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {skills.length > 0 && (
                <View style={[s.selectedBanner, { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary + '30' }]}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={s.selectedBannerText}>{skills.length} skill{skills.length > 1 ? 's' : ''} selected</Text>
                </View>
              )}
              <InfoBox text="You can add or remove skills later from your profile settings." />
            </>
          )}

          {/* ════ STEP 2 — Profile ════ */}
          {step === 2 && (
            <>
              {/* Name row */}
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <FieldLabel label="First Name" required color={T.text} />
                  <TextInput
                    style={[s.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
                    placeholder="Kofi"
                    placeholderTextColor={T.subText}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FieldLabel label="Last Name" required color={T.text} />
                  <TextInput
                    style={[s.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
                    placeholder="Mensah"
                    placeholderTextColor={T.subText}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <FieldLabel label="Phone Number" required color={T.text} />
              <View style={[s.phoneRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
                <View style={s.dialCode}>
                  <Text style={s.flag}>🇬🇭</Text>
                  <Text style={[s.dialCodeText, { color: T.text }]}>+233</Text>
                </View>
                <TextInput
                  style={[s.phoneInput, { color: T.text }]}
                  placeholder="24 123 4567"
                  placeholderTextColor={T.subText}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <FieldLabel label="Service Area / Location" required color={T.text} />
              <View style={[s.locationRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                <TextInput
                  style={[s.locationInput, { color: T.text }]}
                  placeholder="e.g. Kumasi, Ashanti Region"
                  placeholderTextColor={T.subText}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <FieldLabel label="Years of Experience" required color={T.text} />
              <View style={s.optionRow}>
                {EXPERIENCE_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      s.optionChip,
                      { backgroundColor: T.card, borderColor: experience === opt ? COLORS.primary : T.border },
                      experience === opt && { backgroundColor: COLORS.primary + '10' },
                    ]}
                    onPress={() => setExperience(opt)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.optionChipText, { color: experience === opt ? COLORS.primary : T.subText }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldLabel label="Professional Bio" color={T.text} />
              <TextInput
                style={[s.textarea, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
                placeholder="e.g. Experienced plumber with 5+ years fixing pipes, leaks and installations across Kumasi. I work neatly and always leave the site tidy."
                placeholderTextColor={T.subText}
                multiline
                numberOfLines={5}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />
              <Text style={[s.charCount, { color: T.subText }]}>{bio.length}/300 characters</Text>

              <InfoBox text="A strong bio helps clients choose you. Mention your experience, specialties, and what makes you reliable." />
            </>
          )}

          {/* ════ STEP 3 — Availability & Rate ════ */}
          {step === 3 && (
            <>
              <FieldLabel label="Working Days" required color={T.text} />
              <View style={s.dayGrid}>
                {AVAILABILITY_DAYS.map(d => {
                  const on = days.includes(d);
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[
                        s.dayCell,
                        { backgroundColor: on ? COLORS.primary : T.card, borderColor: on ? COLORS.primary : T.border },
                      ]}
                      onPress={() => toggleDay(d)}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.dayText, { color: on ? '#fff' : T.subText }]}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <FieldLabel label="Preferred Working Hours" color={T.text} />
              <View style={s.timeOptions}>
                {AVAILABILITY_TIMES.map(t => {
                  const on = times.includes(t);
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        s.timeRow,
                        { backgroundColor: T.card, borderColor: on ? COLORS.primary : T.border },
                        on && { backgroundColor: COLORS.primary + '08' },
                      ]}
                      onPress={() => toggleTime(t)}
                      activeOpacity={0.8}
                    >
                      <View style={[s.timeRadio, { borderColor: COLORS.primary }]}>
                        {on && <View style={s.timeRadioDot} />}
                      </View>
                      <Ionicons
                        name={t.startsWith('Morning') ? 'sunny-outline' : t.startsWith('Afternoon') ? 'partly-sunny-outline' : 'moon-outline'}
                        size={16}
                        color={on ? COLORS.primary : T.subText}
                      />
                      <Text style={[s.timeText, { color: on ? COLORS.primary : T.text }]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <FieldLabel label="Hourly Rate" required color={T.text} />
              <View style={[s.rateRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
                <Text style={s.cedis}>GH₵</Text>
                <TextInput
                  style={[s.rateInput, { color: T.text }]}
                  placeholder="e.g. 80"
                  placeholderTextColor={T.subText}
                  keyboardType="numeric"
                  value={ratePerHour}
                  onChangeText={setRate}
                />
                <Text style={[s.rateUnit, { color: T.subText }]}>/ hour</Text>
              </View>

              <FieldLabel label="Starting Price per Job (optional)" color={T.text} />
              <View style={[s.rateRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
                <Text style={s.cedis}>GH₵</Text>
                <TextInput
                  style={[s.rateInput, { color: T.text }]}
                  placeholder="e.g. 200"
                  placeholderTextColor={T.subText}
                  keyboardType="numeric"
                  value={ratePerJob}
                  onChangeText={setRateJ}
                />
                <Text style={[s.rateUnit, { color: T.subText }]}>/ job</Text>
              </View>

              <InfoBox text="Set competitive rates to attract more clients. You can negotiate on individual jobs too." />
            </>
          )}

          {/* ════ STEP 4 — Verification ════ */}
          {step === 4 && (
            <>
              {/* ID type selector */}
              <FieldLabel label="Select ID Type" required color={T.text} />
              <View style={s.idTypeGrid}>
                {ID_TYPES.map(type => {
                  const active = idType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        s.idTypeChip,
                        { backgroundColor: T.card, borderColor: active ? COLORS.primary : T.border },
                        active && { backgroundColor: COLORS.primary + '10' },
                      ]}
                      onPress={() => setIdType(type)}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name={type === 'Passport' ? 'passport' : 'card-account-details-outline'}
                        size={20}
                        color={active ? COLORS.primary : T.subText}
                      />
                      <Text style={[s.idTypeText, { color: active ? COLORS.primary : T.subText }]}>{type}</Text>
                      {active && <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ID number */}
              {idType !== '' && (
                <>
                  <FieldLabel label={`${idType} Number`} required color={T.text} />
                  <TextInput
                    style={[s.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text, marginBottom: 20 }]}
                    placeholder="Enter ID number"
                    placeholderTextColor={T.subText}
                    value={idNumber}
                    onChangeText={setIdNumber}
                    autoCapitalize="characters"
                  />
                </>
              )}

              {/* Upload boxes */}
              <FieldLabel label="Upload ID Photo" required color={T.text} />
              <TouchableOpacity
                style={[s.uploadBox, { backgroundColor: T.card, borderColor: idUploaded ? COLORS.primary : T.border }, idUploaded && { borderStyle: 'solid' }]}
                onPress={() => { setIdUploaded(true); Alert.alert('ID Uploaded ✓', 'ID photo submitted for review.'); }}
                activeOpacity={0.8}
              >
                <View style={[s.uploadIconWrap, { backgroundColor: idUploaded ? COLORS.primaryLight : T.inputBg }]}>
                  <Ionicons name={idUploaded ? 'checkmark-circle' : 'cloud-upload-outline'} size={28} color={idUploaded ? COLORS.primary : T.subText} />
                </View>
                <Text style={[s.uploadTitle, { color: idUploaded ? COLORS.primary : T.text }]}>
                  {idUploaded ? 'ID Photo Uploaded ✓' : 'Tap to upload ID photo'}
                </Text>
                <Text style={[s.uploadSub, { color: T.subText }]}>JPG, PNG · Max 5 MB · Clear, unobstructed</Text>
              </TouchableOpacity>

              <FieldLabel label="Selfie with ID (optional but recommended)" color={T.text} />
              <TouchableOpacity
                style={[s.uploadBox, { backgroundColor: T.card, borderColor: selfieUploaded ? COLORS.primary : T.border }, selfieUploaded && { borderStyle: 'solid' }]}
                onPress={() => { setSelfie(true); Alert.alert('Selfie Uploaded ✓', 'Selfie submitted for review.'); }}
                activeOpacity={0.8}
              >
                <View style={[s.uploadIconWrap, { backgroundColor: selfieUploaded ? COLORS.primaryLight : T.inputBg }]}>
                  <Ionicons name={selfieUploaded ? 'checkmark-circle' : 'camera-outline'} size={28} color={selfieUploaded ? COLORS.primary : T.subText} />
                </View>
                <Text style={[s.uploadTitle, { color: selfieUploaded ? COLORS.primary : T.text }]}>
                  {selfieUploaded ? 'Selfie Uploaded ✓' : 'Tap to take / upload selfie'}
                </Text>
                <Text style={[s.uploadSub, { color: T.subText }]}>Hold your ID next to your face</Text>
              </TouchableOpacity>

              {/* Terms */}
              <View style={[s.termsBox, { backgroundColor: T.card, borderColor: T.border }]}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={[s.termsText, { color: T.subText }]}>
                  By submitting, you agree to S-Hub&apos;s{' '}
                  <Text style={s.termsLink} onPress={() => router.push('/terms' as any)}>
                    Worker Terms & Conditions
                  </Text>{' '}
                  and consent to background verification.
                </Text>
              </View>

              <InfoBox text="Your ID is used for verification only and is never shared with clients. All data is encrypted." />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FOOTER CTA ── */}
      <View style={[s.footer, { backgroundColor: T.card, borderColor: T.border }]}>
        {step === TOTAL_STEPS && (
          <Text style={[s.footerHint, { color: T.subText }]}>
            Your details will be reviewed within 24 hours.
          </Text>
        )}
        <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={s.nextBtnText}>
            {step === TOTAL_STEPS ? 'Submit Profile' : 'Continue'}
          </Text>
          <Ionicons
            name={step === TOTAL_STEPS ? 'checkmark-circle-outline' : 'arrow-forward'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  safe: { flex: 1 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 11, marginTop: 1 },
  stepBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  stepBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  /* Scroll */
  scroll: { padding: 18, paddingBottom: 32 },
  stepTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  stepSub: { fontSize: 13, lineHeight: 19, marginBottom: 20 },

  /* Step 1 – Skills */
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  skillTile: {
    width: '30%', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6,
    borderRadius: 14, borderWidth: 1.5, gap: 6, position: 'relative',
  },
  skillTileEmoji: { fontSize: 24 },
  skillTileLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  skillCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  selectedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 12 },
  selectedBannerText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  /* Step 2 – Profile */
  row: { flexDirection: 'row', gap: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 14 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, marginBottom: 14, overflow: 'hidden' },
  dialCode: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 12, borderRightWidth: 1, borderColor: '#E0E0E0' },
  flag: { fontSize: 16 },
  dialCodeText: { fontSize: 14, fontWeight: '700' },
  phoneInput: { flex: 1, paddingHorizontal: 12, fontSize: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  locationInput: { flex: 1, fontSize: 14 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optionChip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  optionChipText: { fontSize: 12, fontWeight: '600' },
  textarea: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 120, lineHeight: 21, marginBottom: 4 },
  charCount: { fontSize: 11, textAlign: 'right', marginBottom: 14 },

  /* Step 3 – Availability */
  dayGrid: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  dayText: { fontSize: 11, fontWeight: '700' },
  timeOptions: { gap: 10, marginBottom: 18 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 12, padding: 14 },
  timeRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  timeRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  timeText: { fontSize: 13, fontWeight: '600', flex: 1 },
  rateRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8, marginBottom: 16 },
  cedis: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  rateInput: { flex: 1, fontSize: 18, fontWeight: '700' },
  rateUnit: { fontSize: 13 },

  /* Step 4 – Verification */
  idTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  idTypeChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, minWidth: '45%' },
  idTypeText: { fontSize: 13, fontWeight: '600', flex: 1 },
  uploadBox: {
    alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderRadius: 14,
    padding: 24, marginBottom: 16, gap: 8,
  },
  uploadIconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { fontSize: 14, fontWeight: '700' },
  uploadSub: { fontSize: 11, textAlign: 'center' },

  /* Terms (step 4) */
  termsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14, marginTop: 8 },
  termsText: { flex: 1, fontSize: 12, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },

  /* Success screen */
  successScroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 48 },
  successCircleOuter: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  successCircleInner: { width: 108, height: 108, borderRadius: 54, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  successTitle: { fontSize: 26, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 28 },
  nextStepsCard: { width: '100%', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20, gap: 14 },
  nextStepsTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  nextStepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  nextStepIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nextStepText: { flex: 1, fontSize: 13, lineHeight: 19, paddingTop: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9, marginBottom: 28 },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  successPrimaryBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, marginBottom: 12, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  successPrimaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  successSecondaryBtn: { width: '100%', alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  successSecondaryBtnText: { fontSize: 14, fontWeight: '600' },

  /* Footer */
  footer: { paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1 },
  footerHint: { fontSize: 11, textAlign: 'center', marginBottom: 8 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15,
    shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
