import { COLORS } from '@/constants/theme';
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

const SKILLS = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Masonry', 'Welding', 'AC Repair'];

export default function WorkerSetupScreen() {
  const [step, setStep]       = useState(1);
  const [skills, setSkills]   = useState<string[]>([]);
  const [bio, setBio]         = useState('');
  const [rate, setRate]       = useState('');
  const [idUploaded, setIdUploaded] = useState(false);

  const toggle = (skill: string) =>
    setSkills(s => s.includes(skill) ? s.filter(x => x !== skill) : [...s, skill]);

  const next = () => {
    if (step === 1 && skills.length === 0) { Alert.alert('Select at least one skill'); return; }
    if (step < 3) setStep(s => s + 1);
    else {
      Alert.alert('🎉 Profile Submitted!', 'Your worker profile is under review. We\'ll notify you within 24 hours.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => step > 1 ? setStep(s => s - 1) : router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={s.title}>Worker Profile</Text>
        <Text style={s.stepText}>{step}/3</Text>
      </View>

      {/* Step bar */}
      <View style={s.stepBar}>
        {[1, 2, 3].map(n => (
          <View key={n} style={[s.stepDot, n <= step && s.stepDotActive, n < step && s.stepDotDone]} />
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── STEP 1: Skills ── */}
          {step === 1 && (
            <>
              <Text style={s.stepTitle}>What are your skills?</Text>
              <Text style={s.stepSub}>Select all that apply. You can add more later.</Text>
              <View style={s.skillsGrid}>
                {SKILLS.map(skill => (
                  <TouchableOpacity
                    key={skill}
                    style={[s.skillChip, skills.includes(skill) && s.skillChipActive]}
                    onPress={() => toggle(skill)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.skillText, skills.includes(skill) && s.skillTextActive]}>{skill}</Text>
                    {skills.includes(skill) && <Ionicons name="checkmark" size={14} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* ── STEP 2: Bio & Rate ── */}
          {step === 2 && (
            <>
              <Text style={s.stepTitle}>Tell clients about yourself</Text>
              <Text style={s.stepSub}>A good bio helps you get hired faster.</Text>

              <Text style={s.fieldLabel}>Professional Bio</Text>
              <TextInput
                style={s.textarea}
                placeholder="E.g. Experienced plumber with 5+ years fixing pipes, leaks and installations across Kumasi..."
                placeholderTextColor={COLORS.muted}
                multiline
                numberOfLines={5}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />

              <Text style={s.fieldLabel}>Hourly Rate (GH₵)</Text>
              <View style={s.rateRow}>
                <Text style={s.cedis}>GH₵</Text>
                <TextInput
                  style={s.rateInput}
                  placeholder="e.g. 80"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="numeric"
                  value={rate}
                  onChangeText={setRate}
                />
                <Text style={s.perHour}>/hr</Text>
              </View>
            </>
          )}

          {/* ── STEP 3: ID Verification ── */}
          {step === 3 && (
            <>
              <Text style={s.stepTitle}>Verify your identity</Text>
              <Text style={s.stepSub}>We need a valid Ghana ID to activate your worker account.</Text>

              <View style={s.idBox}>
                <MaterialCommunityIcons name="card-account-details-outline" size={48} color={COLORS.primary + '80'} />
                <Text style={s.idTitle}>Ghana Card / Voter ID</Text>
                <Text style={s.idSub}>Upload a clear photo of your national ID</Text>
                <TouchableOpacity
                  style={[s.uploadBtn, idUploaded && s.uploadBtnDone]}
                  onPress={() => { setIdUploaded(true); Alert.alert('ID Uploaded', 'Your ID has been submitted for review.'); }}
                  activeOpacity={0.8}
                >
                  <Ionicons name={idUploaded ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={idUploaded ? '#fff' : COLORS.primary} />
                  <Text style={[s.uploadBtnText, idUploaded && { color: '#fff' }]}>
                    {idUploaded ? 'ID Uploaded ✓' : 'Upload ID Photo'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={s.infoBox}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                <Text style={s.infoText}>Your ID is used for verification only and is never shared with clients.</Text>
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.footer}>
        <TouchableOpacity style={s.nextBtn} onPress={next} activeOpacity={0.85}>
          <Text style={s.nextBtnText}>{step === 3 ? 'Submit Profile' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  stepText: { fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  stepBar: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff' },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0' },
  stepDotActive: { backgroundColor: COLORS.primary + '50' },
  stepDotDone: { backgroundColor: COLORS.primary },
  scroll: { padding: 20, paddingBottom: 40 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  stepSub: { fontSize: 13, color: COLORS.muted, marginBottom: 22, lineHeight: 19 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#fff' },
  skillChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  skillText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  skillTextActive: { color: COLORS.primary },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  textarea: { borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 14, padding: 14, fontSize: 14, color: '#1A1A1A', backgroundColor: '#FAFAFA', minHeight: 120, marginBottom: 20, lineHeight: 21 },
  rateRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FAFAFA', gap: 8 },
  cedis: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  rateInput: { flex: 1, fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  perHour: { fontSize: 13, color: COLORS.muted },
  idBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 16, gap: 8 },
  idTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  idSub: { fontSize: 12, color: COLORS.muted, textAlign: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 11, marginTop: 8 },
  uploadBtnDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  uploadBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14 },
  infoText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '500', lineHeight: 18 },
  footer: { paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderColor: '#F0F0F0', backgroundColor: '#fff' },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
