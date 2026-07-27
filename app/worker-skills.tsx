import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MY_PROFILE } from './worker-setup';

const SUGGESTED = [
  'Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater',
  'Gutter Repair', 'Kitchen Plumbing', 'Pump Installation', 'Emergency Repairs', 'Pipe Fitting',
];

export default function WorkerSkillsScreen() {
  const T = useThemeColors();
  const [skills, setSkills] = useState<string[]>([...MY_PROFILE.skills]);
  const [customSkill, setCustomSkill] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills([...skills, trimmed]);
    setCustomSkill('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = () => {
    if (skills.length === 0) {
      Alert.alert('Add at least one skill', 'Clients search by skill, so you need at least one listed.');
      return;
    }
    MY_PROFILE.skills = skills;
    Alert.alert('Saved', 'Your skills have been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const suggestionsToShow = SUGGESTED.filter(sk => !skills.includes(sk));

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Skills & Services</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[s.sectionLabel, { color: T.subText }]}>Your skills ({skills.length})</Text>
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
          {skills.length === 0 ? (
            <Text style={[s.emptyText, { color: T.subText }]}>No skills added yet.</Text>
          ) : (
            <View style={s.chipsWrap}>
              {skills.map(sk => (
                <View key={sk} style={[s.chip, { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary + '30' }]}>
                  <Text style={[s.chipText, { color: COLORS.primary }]}>{sk}</Text>
                  <TouchableOpacity onPress={() => removeSkill(sk)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                    <Ionicons name="close-circle" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={[s.sectionLabel, { color: T.subText }]}>Add a custom skill</Text>
        <View style={[s.addRow, { backgroundColor: T.inputBg }]}>
          <TextInput
            style={[s.addInput, { color: T.text }]}
            placeholder="e.g. Solar Panel Wiring"
            placeholderTextColor={T.subText}
            value={customSkill}
            onChangeText={setCustomSkill}
            onSubmitEditing={() => addSkill(customSkill)}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[s.addBtn, { opacity: customSkill.trim() ? 1 : 0.4 }]}
            onPress={() => addSkill(customSkill)}
            disabled={!customSkill.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {suggestionsToShow.length > 0 && (
          <>
            <Text style={[s.sectionLabel, { color: T.subText }]}>Suggested skills</Text>
            <View style={s.chipsWrap}>
              {suggestionsToShow.map(sk => (
                <TouchableOpacity
                  key={sk}
                  style={[s.suggestChip, { backgroundColor: T.card, borderColor: T.border }]}
                  onPress={() => addSkill(sk)}
                  activeOpacity={0.75}
                >
                  <Ionicons name="add" size={14} color={COLORS.primary} />
                  <Text style={[s.suggestText, { color: T.text }]}>{sk}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[s.footer, { backgroundColor: T.card, borderColor: T.border }]}>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.saveBtn}
          >
            <Text style={s.saveBtnText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },

  scroll: { padding: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', marginBottom: 10, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.4 },

  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 8 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { fontSize: 12, fontWeight: '700' },

  addRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingLeft: 14, paddingRight: 6, paddingVertical: 6, gap: 8 },
  addInput: { flex: 1, fontSize: 14, paddingVertical: 8 },
  addBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },

  suggestChip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  suggestText: { fontSize: 12, fontWeight: '600' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, padding: 16, paddingBottom: 28 },
  saveBtn: { borderRadius: 30, paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
