import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Types ─── */
type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
};

/* ─── Reusable menu row ─── */
function MenuItem({ icon, label, subtitle, onPress, right, danger, cardBg, textColor, subColor }: MenuItemProps & { cardBg: string; textColor: string; subColor: string }) {
  return (
    <TouchableOpacity
      style={[mi.row, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={mi.iconWrap}>{icon}</View>
      <View style={mi.textGroup}>
        <Text style={[mi.label, { color: textColor }, danger && mi.labelDanger]}>{label}</Text>
        {subtitle ? <Text style={[mi.subtitle, { color: subColor }]}>{subtitle}</Text> : null}
      </View>
      {right ?? (
        onPress
          ? <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          : null
      )}
    </TouchableOpacity>
  );
}

const mi = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 16,
  },
  iconWrap: { width: 24, alignItems: 'center' },
  textGroup: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500' },
  labelDanger: { color: COLORS.danger },
  subtitle: { fontSize: 12, marginTop: 2, fontWeight: '500', color: COLORS.primary },
});

/* ─── Section wrapper ─── */
function Section({ children, borderColor }: { children: React.ReactNode; borderColor: string }) {
  return <View style={[sec.wrap, { borderColor }]}>{children}</View>;
}

const sec = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});

/* ─── Divider ─── */
function Divider({ color }: { color: string }) {
  return <View style={{ height: 1, backgroundColor: color, marginLeft: 60 }} />;
}

/* ─── Main Screen ─── */
export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const T = useThemeColors();

  const iconSize = 20;
  const iconColor = T.icon;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle={T.statusBar} backgroundColor={T.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── HERO / NAME CARD ── */}
        <View style={[styles.heroCard, { backgroundColor: T.card }]}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>NK</Text>
            </View>
            <TouchableOpacity
              style={styles.cameraBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/profile-edit' as any)}
            >
              <Ionicons name="camera" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name + rating */}
          <View style={styles.heroInfo}>
            <Text style={[styles.heroName, { color: T.text }]}>Nana Kofi Agyei</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color={COLORS.accent} />
              <Text style={[styles.ratingText, { color: T.text }]}> 4.84</Text>
              <TouchableOpacity onPress={() => Alert.alert('Rating', 'Based on your last 100 jobs.')}>
                <Ionicons name="information-circle-outline" size={16} color={T.subText} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── STATS STRIP ── */}
        <View style={[styles.statsStrip, { backgroundColor: T.card, borderColor: T.border }]}>
          {[
            { value: '12', label: 'Jobs Posted' },
            { value: '8', label: 'Completed' },
            { value: '3', label: 'Saved' },
          ].map((stat, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.statItem, i < 2 && [styles.statBorder, { borderColor: T.border }]]}
              onPress={() => router.push('/bookings' as any)}
              activeOpacity={0.65}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: T.subText }]}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SECTION 1: Account ── */}
        <Section borderColor={T.border}>
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="person-circle-outline" size={iconSize} color={iconColor} />}
            label="Profile"
            subtitle="Verify email address"
            onPress={() => router.push('/profile-edit' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="card-outline" size={iconSize} color={iconColor} />}
            label="Payment Methods"
            onPress={() => router.push('/payment' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="help-circle-outline" size={iconSize} color={iconColor} />}
            label="Support"
            onPress={() => router.push('/support' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<MaterialCommunityIcons name="shield-check-outline" size={iconSize} color={iconColor} />}
            label="Safety"
            onPress={() => router.push('/safety' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="location-outline" size={iconSize} color={iconColor} />}
            label="Saved Locations"
            onPress={() => router.push('/saved-locations' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="settings-outline" size={iconSize} color={iconColor} />}
            label="Settings"
            onPress={() => router.push('/settings' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={COLORS.primary}
            icon={<Ionicons name="notifications-outline" size={iconSize} color={iconColor} />}
            label="Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
                thumbColor="#fff"
              />
            }
          />
        </Section>

        {/* ── SECTION 2: Features ── */}
        <Section borderColor={T.border}>
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<MaterialCommunityIcons name="tag-outline" size={iconSize} color={iconColor} />}
            label="Promotions"
            subtitle="Promo codes, offers and savings"
            onPress={() => router.push('/promotions' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<MaterialCommunityIcons name="briefcase-plus-outline" size={iconSize} color={iconColor} />}
            label="Post a Job"
            subtitle="Find skilled workers near you"
            onPress={() => router.push('/post-a-job' as any)}
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<MaterialCommunityIcons name="account-hard-hat-outline" size={iconSize} color={iconColor} />}
            label="Worker Profile"
            subtitle="Offer your services and earn"
            onPress={() => router.push('/worker-setup' as any)}
          />
        </Section>

        {/* ── SECTION 3: App info ── */}
        <Section borderColor={T.border}>
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<Ionicons name="star-outline" size={iconSize} color={iconColor} />}
            label="Rate the App"
            onPress={() =>
              Linking.openURL('https://play.google.com/store/apps').catch(() =>
                Alert.alert('Rate', 'Could not open the app store. Please search for "Vaker" manually.')
              )
            }
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<Ionicons name="share-social-outline" size={iconSize} color={iconColor} />}
            label="Share with Friends"
            onPress={() =>
              Share.share({
                title: 'Vaker – Hire Skilled Workers in Ghana',
                message: 'Need a plumber, electrician or carpenter? Download Vaker and find trusted workers near you in minutes! 🇬🇭\nhttps://vaker.com.gh',
              })
            }
          />
          <Divider color={T.divider} />
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<Ionicons name="document-text-outline" size={iconSize} color={iconColor} />}
            label="Terms & Privacy Policy"
            onPress={() => router.push('/terms' as any)}
          />
        </Section>

        {/* ── SIGN OUT ── */}
        <Section borderColor={T.border}>
          <MenuItem cardBg={T.card} textColor={T.text} subColor={T.subText}
            icon={<Ionicons name="log-out-outline" size={iconSize} color={COLORS.danger} />}
            label="Sign Out"
            danger
            onPress={() =>
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/sign-in') },
              ])
            }
          />
        </Section>

        {/* App version */}
        <Text style={styles.version}>Vaker v1.0.0 · Made in Ghana 🇬🇭</Text>

      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[styles.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'add', iconActive: 'add', label: '', route: '/post-a-job', center: true },
          { icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person', iconActive: 'person', label: 'Profile', route: '/profile', active: true },
        ].map((tab) =>
          (tab as any).center ? (
            <TouchableOpacity
              key="center"
              style={styles.centerBtn}
              activeOpacity={0.85}
              onPress={() => router.push(tab.route as any)}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={tab.label}
              style={styles.navTab}
              activeOpacity={0.7}
              onPress={() => router.push(tab.route as any)}
            >
              <Ionicons
                name={tab.active ? (tab.iconActive as any) : (tab.icon as any)}
                size={22}
                color={tab.active ? COLORS.primary : T.subText}
              />
              <Text style={[styles.navLabel, { color: T.subText }, tab.active && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100 },

  /* Hero */
  heroCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary + '40',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  heroInfo: { flex: 1 },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 5,
    lineHeight: 26,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  /* Stats */
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statBorder: {
    borderRightWidth: 1,
    borderColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '500',
  },

  /* Version */
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBBBBB',
    marginTop: 10,
    marginBottom: 4,
  },

  /* Bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 22,
    paddingTop: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.muted,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
});
