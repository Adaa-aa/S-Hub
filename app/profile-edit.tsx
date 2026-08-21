import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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

export default function ProfileEditScreen() {
  const [name, setName]   = useState('Nana Kofi Agyei');
  const [email, setEmail] = useState('nana.kofi@gmail.com');
  const [phone, setPhone] = useState('+233 24 000 0000');
  const [city, setCity]   = useState('Kumasi, Ghana');
  const T = useThemeColors();

  const save = () => {
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.header} />

      <View style={[s.header, { backgroundColor: T.header, borderColor: T.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        <Text style={[s.title, { color: T.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={save}>
          <Text style={s.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          <View style={[s.avatarSection, { backgroundColor: T.card }]}>
            <View style={s.avatar}>
              <Text style={s.avatarInitials}>NK</Text>
            </View>
            <TouchableOpacity style={s.changePhotoBtn} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={16} color={COLORS.primary} />
              <Text style={s.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }]}>
            <Field label="Full Name" value={name} onChangeText={setName} icon="person-outline" T={T} />
            <View style={[s.divider, { backgroundColor: T.divider }]} />
            <Field label="Email Address" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" T={T} />
            <View style={[s.divider, { backgroundColor: T.divider }]} />
            <Field label="Phone Number" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" T={T} />
            <View style={[s.divider, { backgroundColor: T.divider }]} />
            <Field label="City / Location" value={city} onChangeText={setCity} icon="location-outline" T={T} />
          </View>

          <View style={s.verifyBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.primary} />
            <Text style={s.verifyText}>Your email address is not verified.</Text>
            <TouchableOpacity onPress={() => Alert.alert('Verify Email', 'Verification link sent to your email.')}>
              <Text style={s.verifyLink}>Verify now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.saveBtn} onPress={save} activeOpacity={0.85}>
            <Text style={s.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChangeText, icon, keyboardType = 'default', T,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  icon: string; keyboardType?: any; T: any;
}) {
  return (
    <View style={f.row}>
      <Ionicons name={icon as any} size={18} color={T.subText} style={f.icon} />
      <View style={f.body}>
        <Text style={[f.label, { color: T.subText }]}>{label}</Text>
        <TextInput
          style={[f.input, { color: T.text }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  icon: { width: 22 },
  body: { flex: 1 },
  label: { fontSize: 11, color: COLORS.muted, fontWeight: '500', marginBottom: 2 },
  input: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
});

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  saveText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  scroll: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 28, marginBottom: 10 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: COLORS.primary + '50', marginBottom: 12 },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.primary },
  changePhotoText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  card: { borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 14 },
  divider: { height: 1, marginLeft: 58 },
  verifyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryLight, marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 20 },
  verifyText: { flex: 1, fontSize: 12, color: COLORS.text, fontWeight: '500' },
  verifyLink: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  saveBtn: { marginHorizontal: 16, backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
