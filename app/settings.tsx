import { COLORS } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { isDark, toggleDark } = useAppTheme();
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('GHS (₵)');
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const LANGUAGES = ['English', 'Twi', 'Ga', 'Ewe', 'Hausa'];

  const bg = isDark ? COLORS.background : '#F5F5F0';
  const cardBg = isDark ? COLORS.card : '#fff';
  const headerBg = isDark ? COLORS.card : '#fff';
  const textColor = isDark ? COLORS.text : '#1A1A1A';
  const subColor = isDark ? COLORS.muted : COLORS.muted;
  const borderColor = isDark ? COLORS.border : '#F0F0F0';
  const iconColor = isDark ? COLORS.muted : '#444';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={headerBg} />
      <View style={[s.header, { backgroundColor: headerBg, borderColor }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={textColor} />
        </TouchableOpacity>
        <Text style={[s.title, { color: textColor }]}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile summary */}
        <TouchableOpacity
          style={[s.profileCard, { backgroundColor: cardBg, borderColor }]}
          activeOpacity={0.8}
          onPress={() => router.push('/worker-personal-info' as any)}
        >
          <View style={[s.profileAvatar, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.profileName, { color: textColor }]}>Kofi Mensah</Text>
            <Text style={[s.profileMeta, { color: COLORS.primary }]}>Verified Pro • Accra</Text>
          </View>
          <Ionicons name="pencil-outline" size={18} color={iconColor} />
        </TouchableOpacity>

        {/* Preferences */}
        <Text style={[s.sectionLabel, { color: subColor }]}>Preferences</Text>
        <View style={[s.card, { backgroundColor: cardBg, borderColor }]}>
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Language', 'Choose language:', LANGUAGES.map(l => ({
                text: l, onPress: () => setLanguage(l),
              })).concat([{ text: 'Cancel', onPress: () => { } }]))
            }
          >
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="language-outline" size={18} color={iconColor} />
            </View>
            <Text style={[s.rowLabel, { color: textColor }]}>Language</Text>
            <Text style={[s.rowValue, { color: subColor }]}>{language}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Currency', 'Currency selection coming soon.')}
          >
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="cash-outline" size={18} color={iconColor} />
            </View>
            <Text style={[s.rowLabel, { color: textColor }]}>Currency</Text>
            <Text style={[s.rowValue, { color: subColor }]}>{currency}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="moon-outline" size={18} color={iconColor} />
            </View>
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>Dark Mode</Text>
              <Text style={[s.rowSub, { color: subColor }]}>{isDark ? 'On' : 'Off'}</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleDark} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
        </View>

        {/* Notifications */}
        <Text style={[s.sectionLabel, { color: subColor }]}>Notifications</Text>
        <View style={[s.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={s.row}>
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="notifications-outline" size={18} color={iconColor} />
            </View>
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>Push Notifications</Text>
              <Text style={[s.rowSub, { color: subColor }]}>Job updates and messages</Text>
            </View>
            <Switch value={pushNotifs} onValueChange={setPushNotifs} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="mail-outline" size={18} color={iconColor} />
            </View>
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>Email Notifications</Text>
              <Text style={[s.rowSub, { color: subColor }]}>Receipts and account updates</Text>
            </View>
            <Switch value={emailNotifs} onValueChange={setEmailNotifs} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="chatbox-outline" size={18} color={iconColor} />
            </View>
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>SMS Notifications</Text>
              <Text style={[s.rowSub, { color: subColor }]}>Text message alerts</Text>
            </View>
            <Switch value={smsNotifs} onValueChange={setSmsNotifs} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
        </View>

        {/* Account actions */}
        <Text style={[s.sectionLabel, { color: subColor }]}>Account</Text>
        <View style={[s.card, { backgroundColor: cardBg, borderColor }]}>
          <TouchableOpacity style={s.row} activeOpacity={0.7} onPress={() => Alert.alert('Clear Cache', 'App cache cleared.')}>
            <View style={[s.iconChip, { backgroundColor: borderColor }]}>
              <Ionicons name="trash-outline" size={18} color={iconColor} />
            </View>
            <Text style={[s.rowLabel, { color: textColor }]}>Clear App Cache</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={s.logoutButton}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Log Out?', 'You will need to sign in again to access your jobs.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/sign-in' as any) },
          ])}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={s.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <View style={s.dangerZone}>
          <View style={s.dangerZoneHeader}>
            <Ionicons name="warning-outline" size={16} color={COLORS.danger} />
            <Text style={s.dangerZoneTitle}>Danger Zone</Text>
          </View>
          <Text style={s.dangerZoneBody}>
            Deleting your account is permanent. All your job history, earned badges, and
            verification status will be lost forever.
          </Text>
          <TouchableOpacity
            style={s.deleteButton}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => router.replace('/sign-in' as any) },
            ])}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={s.deleteButtonText}>Delete My Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>AdwumaGo v1.0.0 · Made in Ghana 🇬🇭</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.card, borderBottomWidth: 1, borderColor: COLORS.border },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 24,
  },
  profileAvatar: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 17, fontWeight: '800' },
  profileMeta: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 56 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  icon: { width: 24 },
  iconChip: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: COLORS.text, flex: 1 },
  rowValue: { fontSize: 13, color: COLORS.muted, marginRight: 6 },
  rowSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.muted, marginTop: 4 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 14, backgroundColor: COLORS.dangerLight,
    marginBottom: 20,
  },
  logoutButtonText: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
  dangerZone: {
    borderWidth: 1, borderColor: COLORS.danger, borderRadius: 16, padding: 16, marginBottom: 24, gap: 10,
  },
  dangerZoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dangerZoneTitle: { fontSize: 14, fontWeight: '800', color: COLORS.danger },
  dangerZoneBody: { fontSize: 12, lineHeight: 18, color: COLORS.danger },
  deleteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 46, borderRadius: 12, borderWidth: 1, borderColor: COLORS.danger,
  },
  deleteButtonText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
});
