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

  const bg = isDark ? '#121212' : '#F5F5F0';
  const cardBg = isDark ? '#1E1E1E' : '#fff';
  const headerBg = isDark ? '#1A1A1A' : '#fff';
  const textColor = isDark ? '#ECEDEE' : '#1A1A1A';
  const subColor = isDark ? '#9BA1A6' : COLORS.muted;
  const borderColor = isDark ? '#2C2C2C' : '#F0F0F0';
  const iconColor = isDark ? '#9BA1A6' : '#444';

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
            <Ionicons name="language-outline" size={20} color={iconColor} style={s.icon} />
            <Text style={[s.rowLabel, { color: textColor }]}>Language</Text>
            <Text style={[s.rowValue, { color: subColor }]}>{language}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Currency', 'Currency selection coming soon.')}
          >
            <Ionicons name="cash-outline" size={20} color={iconColor} style={s.icon} />
            <Text style={[s.rowLabel, { color: textColor }]}>Currency</Text>
            <Text style={[s.rowValue, { color: subColor }]}>{currency}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <Ionicons name="moon-outline" size={20} color={iconColor} style={s.icon} />
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
            <Ionicons name="notifications-outline" size={20} color={iconColor} style={s.icon} />
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>Push Notifications</Text>
              <Text style={[s.rowSub, { color: subColor }]}>Job updates and messages</Text>
            </View>
            <Switch value={pushNotifs} onValueChange={setPushNotifs} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <Ionicons name="mail-outline" size={20} color={iconColor} style={s.icon} />
            <View style={s.rowInfo}>
              <Text style={[s.rowLabel, { color: textColor }]}>Email Notifications</Text>
              <Text style={[s.rowSub, { color: subColor }]}>Receipts and account updates</Text>
            </View>
            <Switch value={emailNotifs} onValueChange={setEmailNotifs} trackColor={{ false: '#E0E0E0', true: COLORS.primary }} thumbColor="#fff" />
          </View>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <View style={s.row}>
            <Ionicons name="chatbox-outline" size={20} color={iconColor} style={s.icon} />
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
            <Ionicons name="trash-outline" size={20} color={iconColor} style={s.icon} />
            <Text style={[s.rowLabel, { color: textColor }]}>Clear App Cache</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>
          <View style={[s.divider, { backgroundColor: borderColor }]} />
          <TouchableOpacity
            style={s.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Delete Account', 'This will permanently delete your account and all data. This cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => router.replace('/sign-in') },
            ])}
          >
            <Ionicons name="person-remove-outline" size={20} color={COLORS.danger} style={s.icon} />
            <Text style={[s.rowLabel, { color: COLORS.danger }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Vaker v1.0.0 · Made in Ghana 🇬🇭</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 56 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  icon: { width: 24 },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', flex: 1 },
  rowValue: { fontSize: 13, color: COLORS.muted, marginRight: 6 },
  rowSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  version: { textAlign: 'center', fontSize: 12, color: '#BBBBBB', marginTop: 4 },
});
