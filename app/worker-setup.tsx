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
const TOTAL_STEPS = 5;

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

  /* Step 5 – Bank / MoMo */
  const [momoNumber, setMomoNumber] = useState('');
  const [momoNetwork, setMomoNet] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAcct, setBankAcct] = useState('');

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
    Alert.alert(
      '🎉 Profile Submitted!',
      'Your worker profile is under review. We\'ll notify you within 24 hours once approved.',
      [{ text: 'Back to Profile', onPress: () => router.back() }]
    );
  };

  const stepTitles = [
    'Your Skills',
    'About You',
    'Availability & Pricing',
    'Identity Verification',
    'Payment Setup',
  ];

  const stepSubs = [
    'Select every service you offer — clients will search for these.',
    'Tell clients who you are and what makes you stand out.',
    'When can you work, and what do you charge?',
    'We verify every worker to build trust on the platform.',
    'Set up how you\'d like to receive your earnings.',
  ];

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

              <InfoBox text="Your ID is used for identity verification only and is never shared with clients. All data is encrypted." />
            </>
          )}

          {/* ════ STEP 5 — Payment ════ */}
          {step === 5 && (
            <>
              {/* MoMo */}
              <View style={[s.paySection, { backgroundColor: T.card, borderColor: T.border }]}>
                <View style={s.paySectionHeader}>
                  <View style={[s.payIconWrap, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialCommunityIcons name="cellphone" size={20} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.paySectionTitle, { color: T.text }]}>Mobile Money (MoMo)</Text>
                    <Text style={[s.paySectionSub, { color: T.subText }]}>MTN, Telecel, AirtelTigo</Text>
                  </View>
                  <View style={[s.recommendedBadge, { backgroundColor: COLORS.primaryLight }]}>
                    <Text style={s.recommendedText}>Recommended</Text>
                  </View>
                </View>

                <View style={[s.paySectionDivider, { backgroundColor: T.divider }]} />

                <FieldLabel label="MoMo Number" color={T.text} />
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
                    value={momoNumber}
                    onChangeText={setMomoNumber}
                  />
                </View>

                <FieldLabel label="Network" color={T.text} />
                <View style={s.networkRow}>
                  {['MTN', 'Telecel', 'AirtelTigo'].map(net => {
                    const on = momoNetwork === net;
                    return (
                      <TouchableOpacity
                        key={net}
                        style={[
                          s.networkChip,
                          { backgroundColor: on ? COLORS.primary : T.inputBg, borderColor: on ? COLORS.primary : T.border },
                        ]}
                        onPress={() => setMomoNet(net)}
                        activeOpacity={0.8}
                      >
                        <Text style={[s.networkText, { color: on ? '#fff' : T.subText }]}>{net}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Bank */}
              <View style={[s.paySection, { backgroundColor: T.card, borderColor: T.border }]}>
                <View style={s.paySectionHeader}>
                  <View style={[s.payIconWrap, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="business-outline" size={20} color="#1D6FBA" />
                  </View>
                  <View>
                    <Text style={[s.paySectionTitle, { color: T.text }]}>Bank Account</Text>
                    <Text style={[s.paySectionSub, { color: T.subText }]}>Optional — for larger payouts</Text>
                  </View>
                </View>
                <View style={[s.paySectionDivider, { backgroundColor: T.divider }]} />

                <FieldLabel label="Bank Name" color={T.text} />
                <TextInput
                  style={[s.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text }]}
                  placeholder="e.g. GCB Bank, Ecobank"
                  placeholderTextColor={T.subText}
                  value={bankName}
                  onChangeText={setBankName}
                />

                <FieldLabel label="Account Number" color={T.text} />
                <TextInput
                  style={[s.input, { backgroundColor: T.inputBg, borderColor: T.border, color: T.text, marginBottom: 4 }]}
                  placeholder="e.g. 1234567890"
                  placeholderTextColor={T.subText}
                  keyboardType="numeric"
                  value={bankAcct}
                  onChangeText={setBankAcct}
                />
              </View>

              {/* Terms */}
              <View style={[s.termsBox, { backgroundColor: T.card, borderColor: T.border }]}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={[s.termsText, { color: T.subText }]}>
                  By submitting, you agree to S-Hub's{' '}
                  <Text style={s.termsLink} onPress={() => router.push('/terms' as any)}>
                    Worker Terms & Conditions
                  </Text>{' '}
                  and consent to background verification.
                </Text>
              </View>

              <InfoBox text="Payments are released to your account within 24 hours of a completed, confirmed job." />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── FOOTER CTA ── */}
      <View style={[s.footer, { backgroundColor: T.card, borderColor: T.border }]}>
        {step === TOTAL_STEPS && (
          <Text style={[s.footerHint, { color: T.subText }]}>
            Your profile will be reviewed within 24 hours.
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

  /* Step 5 – Payment */
  paySection: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  paySectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  payIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  paySectionTitle: { fontSize: 14, fontWeight: '700' },
  paySectionSub: { fontSize: 11, marginTop: 2 },
  paySectionDivider: { height: 1, marginBottom: 14 },
  recommendedBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  recommendedText: { fontSize: 10, color: COLORS.primary, fontWeight: '700' },
  networkRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  networkChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  networkText: { fontSize: 13, fontWeight: '700' },
  termsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14 },
  termsText: { flex: 1, fontSize: 12, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: '700', textDecorationLine: 'underline' },

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
