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

function Field({ icon, label, value, onChangeText, keyboardType, T }: {
  icon: string; label: string; value: string; onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'phone-pad'; T: any;
}) {
  return (
    <View style={s.fieldWrap}>
      <Text style={[s.fieldLabel, { color: T.subText }]}>{label}</Text>
      <View style={[s.inputRow, { backgroundColor: T.inputBg, borderColor: T.border }]}>
        <Ionicons name={icon as any} size={16} color={T.subText} />
        <TextInput
          style={[s.input, { color: T.text }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? 'default'}
          placeholderTextColor={T.subText}
        />
      </View>
    </View>
  );
}

export default function WorkerPersonalInfoScreen() {
  const T = useThemeColors();
  const [name, setName] = useState(MY_PROFILE.name);
  const [phone, setPhone] = useState(MY_PROFILE.phone);
  const [location, setLocation] = useState(MY_PROFILE.location);
  const [languages, setLanguages] = useState(MY_PROFILE.languages);

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !location.trim()) {
      Alert.alert('Missing details', 'Name, phone, and location can\'t be empty.');
      return;
    }
    MY_PROFILE.name = name.trim();
    MY_PROFILE.phone = phone.trim();
    MY_PROFILE.location = location.trim();
    MY_PROFILE.languages = languages.trim();
    Alert.alert('Saved', 'Your personal information has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Personal Information</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
          <Field icon="person-outline" label="Full name" value={name} onChangeText={setName} T={T} />
          <View style={[s.fieldDivider, { backgroundColor: T.divider }]} />
          <Field icon="call-outline" label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" T={T} />
          <View style={[s.fieldDivider, { backgroundColor: T.divider }]} />
          <Field icon="location-outline" label="Location" value={location} onChangeText={setLocation} T={T} />
          <View style={[s.fieldDivider, { backgroundColor: T.divider }]} />
          <Field icon="globe-outline" label="Languages" value={languages} onChangeText={setLanguages} T={T} />
        </View>

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
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  fieldDivider: { height: 1, marginVertical: 16 },

  fieldWrap: {},
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, gap: 10 },
  input: { flex: 1, fontSize: 14, paddingVertical: 13 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, padding: 16, paddingBottom: 28 },
  saveBtn: { borderRadius: 30, paddingVertical: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
