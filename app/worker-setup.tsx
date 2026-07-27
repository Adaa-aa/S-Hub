import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

/* ─── Mock worker state ─── */
export const MY_PROFILE = {
  name: 'Kofi Mensah',
  initials: 'KM',
  service: 'Master Plumber',
  phone: '+233 24 123 4567',
  location: 'Kumasi, Ashanti Region',
  languages: 'English, Twi',
  rating: 4.9,
  reviews: 143,
  jobs: 143,
  onTime: 98,
  experience: '6 yrs',
  price: 450,
  hourlyRate: 450,
  minJobValue: 200,
  verified: true,
  online: true,
  profileComplete: 88,
  skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Fitting', 'Drainage', 'Water Heater', 'Gutter Repair'],
  availability: [
    { day: 'Mon', on: true }, { day: 'Tue', on: true }, { day: 'Wed', on: true },
    { day: 'Thu', on: true }, { day: 'Fri', on: true }, { day: 'Sat', on: false },
    { day: 'Sun', on: false },
  ],
  recentJobs: [
    { id: 'j1', client: 'Akosua Badu', initials: 'AB', color: '#7C3AED', service: 'Pipe leak fix', status: 'completed', amount: 450, date: '30 Jun' },
    { id: 'j2', client: 'Ernest Ofori', initials: 'EO', color: '#1D6FBA', service: 'Bathroom installation', status: 'completed', amount: 900, date: '28 Jun' },
    { id: 'j3', client: 'Mabel Asante', initials: 'MA', color: '#D97706', service: 'Gutter cleaning', status: 'pending', amount: 300, date: 'Today' },
  ],
};

/* ─── Section card wrapper ─── */
function SectionCard({ title, onEdit, children, T }: {
  title: string; onEdit?: () => void; children: React.ReactNode; T: any;
}) {
  return (
    <View style={[sc.wrap, { backgroundColor: T.card, borderColor: T.border }]}>
      <View style={sc.header}>
        <Text style={[sc.title, { color: T.text }]}>{title}</Text>
        {onEdit && (
          <TouchableOpacity style={sc.editBtn} onPress={onEdit} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
            <Text style={sc.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[sc.divider, { backgroundColor: T.divider }]} />
      {children}
    </View>
  );
}
const sc = StyleSheet.create({
  wrap: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 14, fontWeight: '800' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary + '14', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  editText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  divider: { height: 1 },
});

/* ─── Info row inside a card ─── */
function InfoRow({ icon, label, value, T }: { icon: string; label: string; value: string; T: any }) {
  return (
    <View style={ir.row}>
      <View style={[ir.icon, { backgroundColor: COLORS.primaryLight }]}>
        <Ionicons name={icon as any} size={15} color={COLORS.primary} />
      </View>
      <Text style={[ir.label, { color: T.subText }]}>{label}</Text>
      <Text style={[ir.value, { color: T.text }]}>{value}</Text>
    </View>
  );
}
const ir = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  icon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 13, fontWeight: '500' },
  value: { fontSize: 13, fontWeight: '700' },
});

/* ─── Divider ─── */
function CardDivider({ T }: { T: any }) {
  return <View style={{ height: 1, backgroundColor: T.divider, marginHorizontal: 16 }} />;
}

/* ─── Main screen ─── */
export default function WorkerSetupScreen() {
  const T = useThemeColors();
  const [isOnline, setIsOnline] = useState(MY_PROFILE.online);
  const [notifs, setNotifs] = useState(true);
  const [incomingRequest, setIncomingRequest] = useState<{
    id: string; client: string; initials: string; color: string;
    service: string; location: string; distance: string; price: number; note: string;
  } | null>({
    id: 'req1',
    client: 'Yaw Boateng',
    initials: 'YB',
    color: '#1D6FBA',
    service: 'Kitchen sink leak repair',
    location: 'Ahodwo, Kumasi',
    distance: '2.4 km away',
    price: 380,
    note: 'Leaking under the sink — needs a fix today if possible.',
  });
  const p = MY_PROFILE;

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
    Alert.alert(
      'Accept this job?',
      `You'll take on ${incomingRequest.client}'s job for GH₵ ${incomingRequest.price}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setIncomingRequest(null);
            Alert.alert('Job Accepted', 'The client has been notified. Check "My Jobs" for details.');
          },
        },
      ]
    );
  };

  const handleDeclineRequest = () => {
    if (!incomingRequest) return;
    Alert.alert(
      'Decline this job?',
      'It will be passed to another nearby worker.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', style: 'destructive', onPress: () => setIncomingRequest(null) },
      ]
    );
  };

  const handleShare = () =>
    Share.share({
      title: `${p.name} – ${p.service} on S-Hub`,
      message: `Hire me on S-Hub! ⭐ ${p.rating} · ${p.jobs} jobs · GH₵ ${p.price} starting.\nhttps://s-hub.com.gh`,
    });

  const statusColor = (st: string) => st === 'completed' ? '#22C55E' : st === 'pending' ? '#F59E0B' : '#CE1126';
  const statusLabel = (st: string) => st.charAt(0).toUpperCase() + st.slice(1);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ── */}
      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Worker Profile</Text>
        <TouchableOpacity style={s.backBtn} onPress={handleShare} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ══ MODE SWITCHER ══ */}
      <View style={[s.modeStrip, { backgroundColor: T.card, borderColor: T.border }]}>
        <View style={s.modeLeft}>
          <Ionicons name="hammer-outline" size={14} color={COLORS.primary} />
          <Text style={[s.modeText, { color: T.text }]}>Working as a Worker</Text>
        </View>
        <TouchableOpacity
          style={s.switchBtn}
          onPress={() => router.replace('/(tabs)/home' as any)}
          activeOpacity={0.8}
        >
          <Text style={s.switchBtnText}>Switch to Customer View</Text>
          <Ionicons name="swap-horizontal" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ══ INCOMING JOB REQUEST ══ */}
        {incomingRequest && (
          <View style={[s.requestCard, { backgroundColor: T.card, borderColor: COLORS.primary }]}>
            <View style={s.requestBadgeRow}>
              <View style={s.requestBadge}>
                <View style={s.requestDot} />
                <Text style={s.requestBadgeText}>NEW JOB REQUEST</Text>
              </View>
              <Text style={[s.requestDistance, { color: T.subText }]}>{incomingRequest.distance}</Text>
            </View>

            <View style={s.requestRow}>
              <View style={[s.requestAvatar, { backgroundColor: incomingRequest.color + '20' }]}>
                <Text style={[s.requestAvatarText, { color: incomingRequest.color }]}>{incomingRequest.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.requestClient, { color: T.text }]}>{incomingRequest.client}</Text>
                <Text style={[s.requestService, { color: T.subText }]}>{incomingRequest.service}</Text>
              </View>
              <Text style={[s.requestPrice, { color: COLORS.primary }]}>GH₵ {incomingRequest.price}</Text>
            </View>

            <View style={s.requestLocRow}>
              <Ionicons name="location-outline" size={13} color={T.subText} />
              <Text style={[s.requestLocText, { color: T.subText }]}>{incomingRequest.location}</Text>
            </View>
            <Text style={[s.requestNote, { color: T.subText }]}>{incomingRequest.note}</Text>

            <View style={s.requestActions}>
              <TouchableOpacity
                style={[s.declineBtn, { borderColor: COLORS.danger }]}
                onPress={handleDeclineRequest}
                activeOpacity={0.8}
              >
                <Text style={[s.declineText, { color: COLORS.danger }]}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.acceptBtn, { backgroundColor: COLORS.primary }]}
                onPress={handleAcceptRequest}
                activeOpacity={0.8}
              >
                <Text style={s.acceptText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══ PROFILE HERO ══ */}
        <View style={[s.heroCard, { backgroundColor: COLORS.primary }]}>
          <View style={s.heroRow}>
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={s.avatarInitials}>{p.initials}</Text>
              </View>
              <View style={[s.onlineDot, { backgroundColor: isOnline ? '#22C55E' : '#94A3B8' }]} />
            </View>

            <View style={s.heroInfo}>
              <View style={s.nameRow}>
                <Text style={s.heroName}>{p.name}</Text>
                {p.verified && <Ionicons name="checkmark-circle" size={18} color="#fff" />}
              </View>
              <Text style={s.heroService}>{p.service}</Text>
              <View style={s.heroMeta}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={s.heroMetaText}>{p.rating}  ·  {p.jobs} jobs</Text>
              </View>
              <View style={s.heroMeta}>
                <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={s.heroMetaText}>{p.location}</Text>
              </View>
            </View>
          </View>

          {/* Online toggle */}
          <View style={s.onlineRow}>
            <View style={s.onlineLeft}>
              <View style={[s.onlineIndicator, { backgroundColor: isOnline ? '#22C55E' : '#94A3B8' }]} />
              <Text style={s.onlineLabel}>{isOnline ? 'Available for jobs' : 'Offline'}</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#334155', true: '#166534' }}
              thumbColor={isOnline ? '#22C55E' : '#94A3B8'}
            />
          </View>
        </View>

        {/* ══ STATS STRIP ══ */}
        <View style={[s.statsStrip, { backgroundColor: T.card, borderColor: T.border }]}>
          {[
            { value: String(p.jobs), label: 'Jobs Done', icon: 'briefcase-outline' },
            { value: String(p.rating), label: 'Rating', icon: 'star-outline' },
            { value: `${p.onTime}%`, label: 'On-time', icon: 'time-outline' },
            { value: p.experience, label: 'Experience', icon: 'calendar-outline' },
          ].map((stat, i, arr) => (
            <View key={stat.label} style={[s.stat, i < arr.length - 1 && [s.statBorder, { borderColor: T.border }]]}>
              <Ionicons name={stat.icon as any} size={14} color={COLORS.primary} style={{ marginBottom: 4 }} />
              <Text style={[s.statValue, { color: COLORS.primary }]}>{stat.value}</Text>
              <Text style={[s.statLabel, { color: T.subText }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ══ PROFILE COMPLETENESS ══ */}
        <View style={[s.completenessCard, { backgroundColor: T.card, borderColor: T.border }]}>
          <View style={s.completenessTop}>
            <View>
              <Text style={[s.completenessTitle, { color: T.text }]}>Profile Completeness</Text>
              <Text style={[s.completenessSub, { color: T.subText }]}>Complete your profile to get more jobs</Text>
            </View>
            <Text style={[s.completenessPct, { color: COLORS.primary }]}>{p.profileComplete}%</Text>
          </View>
          <View style={[s.completenessTrack, { backgroundColor: T.border }]}>
            <View style={[s.completenessFill, { width: `${p.profileComplete}%` as any }]} />
          </View>
          {p.profileComplete < 100 && (
            <TouchableOpacity
              style={s.completenessHint}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Complete Profile', 'Add a profile photo and bank details to reach 100%.')}
            >
              <Ionicons name="alert-circle-outline" size={14} color={COLORS.accent} />
              <Text style={s.completenessHintText}>Add profile photo & bank details to reach 100%</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
            </TouchableOpacity>
          )}
        </View>

        {/* ══ SKILLS ══ */}
        <SectionCard
          title="Skills & Services"
          T={T}
          onEdit={() => router.push('/worker-skills' as any)}
        >
          <View style={s.skillsGrid}>
            {p.skills.map(sk => (
              <View key={sk} style={[s.skillChip, { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary + '30' }]}>
                <Text style={[s.skillText, { color: COLORS.primary }]}>{sk}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[s.skillChipAdd, { borderColor: COLORS.primary }]}
              onPress={() => Alert.alert('Add Skill', 'Skill editor coming soon.')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color={COLORS.primary} />
              <Text style={[s.skillAddText, { color: COLORS.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* ══ AVAILABILITY ══ */}
        <SectionCard
          title="Weekly Availability"
          T={T}
          onEdit={() => router.push('/worker-availability' as any)}
        >
          <View style={s.availGrid}>
            {p.availability.map(day => (
              <View key={day.day} style={[
                s.availCell,
                day.on
                  ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                  : { backgroundColor: T.inputBg, borderColor: T.border },
              ]}>
                <Text style={[s.availDay, { color: day.on ? '#fff' : T.subText }]}>{day.day}</Text>
                <Ionicons name={day.on ? 'checkmark' : 'close'} size={10} color={day.on ? '#fff' : T.subText} />
              </View>
            ))}
          </View>
        </SectionCard>

        {/* ══ PRICING ══ */}
        <SectionCard
          title="Pricing"
          T={T}
          onEdit={() => router.push('/worker-pricing' as any)}
        >
          <InfoRow icon="cash-outline" label="Starting price" value={`GH₵ ${p.price}`} T={T} />
          <CardDivider T={T} />
          <InfoRow icon="time-outline" label="Hourly rate" value={`GH₵ ${p.hourlyRate} / hr`} T={T} />
          <CardDivider T={T} />
          <InfoRow icon="briefcase-outline" label="Min. job value" value={`GH₵ ${p.minJobValue}`} T={T} />
        </SectionCard>

        {/* ══ PERSONAL INFO ══ */}
        <SectionCard
          title="Personal Information"
          T={T}
          onEdit={() => router.push('/worker-personal-info' as any)}
        >
          <InfoRow icon="person-outline" label="Full name" value={p.name} T={T} />
          <CardDivider T={T} />
          <InfoRow icon="call-outline" label="Phone" value={p.phone} T={T} />
          <CardDivider T={T} />
          <InfoRow icon="location-outline" label="Location" value={p.location} T={T} />
          <CardDivider T={T} />
          <InfoRow icon="globe-outline" label="Languages" value={p.languages} T={T} />
        </SectionCard>

        {/* ══ RECENT JOBS ══ */}
        <View style={s.recentHeader}>
          <Text style={[s.sectionHeading, { color: T.text, marginBottom: 0 }]}>Recent Jobs</Text>
          <TouchableOpacity onPress={() => router.push('/bookings' as any)} activeOpacity={0.7}>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {p.recentJobs.map(job => (
          <TouchableOpacity
            key={job.id}
            style={[s.jobCard, { backgroundColor: T.card, borderColor: T.border }]}
            activeOpacity={0.8}
            onPress={() => router.push('/bookings' as any)}
          >
            <View style={[s.jobAvatar, { backgroundColor: job.color + '20' }]}>
              <Text style={[s.jobInitials, { color: job.color }]}>{job.initials}</Text>
            </View>
            <View style={s.jobInfo}>
              <Text style={[s.jobClient, { color: T.text }]}>{job.client}</Text>
              <Text style={[s.jobService, { color: T.subText }]}>{job.service}</Text>
            </View>
            <View style={s.jobRight}>
              <Text style={[s.jobAmount, { color: COLORS.primary }]}>GH₵ {job.amount}</Text>
              <View style={[s.jobStatusBadge, { backgroundColor: statusColor(job.status) + '18' }]}>
                <Text style={[s.jobStatusText, { color: statusColor(job.status) }]}>{statusLabel(job.status)}</Text>
              </View>
              <Text style={[s.jobDate, { color: T.subText }]}>{job.date}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ══ NOTIFICATIONS PREF ══ */}
        <SectionCard title="Notifications" T={T}>
          <View style={s.prefRow}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
            <Text style={[s.prefLabel, { color: T.text }]}>Job alerts & messages</Text>
            <Switch
              value={notifs}
              onValueChange={setNotifs}
              trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>
        </SectionCard>

        {/* ══ DANGER ZONE ══ */}
        <TouchableOpacity
          style={[s.deactivateBtn, { borderColor: COLORS.danger + '40', backgroundColor: COLORS.danger + '08' }]}
          activeOpacity={0.8}
          onPress={() => Alert.alert(
            'Deactivate Account',
            'Your worker profile will be hidden. Clients will no longer be able to find or hire you.',
            [{ text: 'Cancel', style: 'cancel' }, { text: 'Deactivate', style: 'destructive' }]
          )}
        >
          <Ionicons name="power-outline" size={16} color={COLORS.danger} />
          <Text style={s.deactivateText}>Deactivate Worker Account</Text>
        </TouchableOpacity>

        <Text style={[s.version, { color: T.subText }]}>S-Hub Worker v1.0.0 · Made in Ghana 🇬🇭</Text>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={[s.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/worker-setup', active: true },
          { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/profile', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'My Jobs', route: '/bookings', active: false },
          { icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: false },
        ].map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={s.navTab}
            activeOpacity={0.7}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={(tab.active ? tab.iconActive : tab.icon) as any}
              size={22}
              color={tab.active ? COLORS.primary : T.subText}
            />
            <Text style={[s.navLabel, { color: T.subText }, tab.active && s.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 110 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },

  /* Mode switcher */
  modeStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modeText: { fontSize: 12, fontWeight: '600' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary + '14', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  switchBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  /* Incoming job request */
  requestCard: { borderRadius: 16, borderWidth: 1.5, marginHorizontal: 16, marginTop: 14, marginBottom: 4, padding: 14 },
  requestBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  requestBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  requestDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E' },
  requestBadgeText: { fontSize: 11, fontWeight: '800', color: '#22C55E', letterSpacing: 0.5 },
  requestDistance: { fontSize: 11, fontWeight: '600' },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  requestAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  requestAvatarText: { fontSize: 15, fontWeight: '800' },
  requestClient: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  requestService: { fontSize: 12, fontWeight: '500' },
  requestPrice: { fontSize: 16, fontWeight: '900' },
  requestLocRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  requestLocText: { fontSize: 12 },
  requestNote: { fontSize: 12, lineHeight: 17, marginBottom: 14 },
  requestActions: { flexDirection: 'row', gap: 10 },
  declineBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  declineText: { fontSize: 13, fontWeight: '700' },
  acceptBtn: { flex: 1.4, alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  acceptText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  /* Hero card */
  heroCard: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)' },
  avatarInitials: { fontSize: 28, fontWeight: '900', color: '#fff' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: 8, borderWidth: 2.5, borderColor: '#fff' },
  heroInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  heroName: { fontSize: 19, fontWeight: '800', color: '#fff' },
  heroService: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 5 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  heroMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  onlineLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineIndicator: { width: 9, height: 9, borderRadius: 5 },
  onlineLabel: { fontSize: 13, fontWeight: '600', color: '#fff' },

  /* Stats strip */
  statsStrip: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 16 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statBorder: { borderRightWidth: 1 },
  statValue: { fontSize: 16, fontWeight: '800', marginBottom: 1 },
  statLabel: { fontSize: 10, fontWeight: '500' },

  /* Profile completeness */
  completenessCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginHorizontal: 16, marginBottom: 16 },
  completenessTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  completenessTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  completenessSub: { fontSize: 11 },
  completenessPct: { fontSize: 22, fontWeight: '900' },
  completenessTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  completenessFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  completenessHint: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.accent + '18', borderRadius: 8, padding: 10 },
  completenessHintText: { flex: 1, fontSize: 11, color: COLORS.accent, fontWeight: '500' },

  /* Section heading */
  sectionHeading: { fontSize: 14, fontWeight: '800', paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },

  /* Skills */
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14 },
  skillChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  skillText: { fontSize: 12, fontWeight: '700' },
  skillChipAdd: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', paddingHorizontal: 12, paddingVertical: 7 },
  skillAddText: { fontSize: 12, fontWeight: '700' },

  /* Availability */
  availGrid: { flexDirection: 'row', gap: 6, padding: 14, justifyContent: 'space-between' },
  availCell: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, gap: 3 },
  availDay: { fontSize: 10, fontWeight: '700' },

  /* Recent jobs */
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10, marginTop: 4 },
  seeAll: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  jobCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  jobAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  jobInitials: { fontSize: 14, fontWeight: '800' },
  jobInfo: { flex: 1 },
  jobClient: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  jobService: { fontSize: 12 },
  jobRight: { alignItems: 'flex-end', gap: 4 },
  jobAmount: { fontSize: 13, fontWeight: '800' },
  jobStatusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  jobStatusText: { fontSize: 10, fontWeight: '700' },
  jobDate: { fontSize: 10 },

  /* Notifications pref */
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  prefLabel: { flex: 1, fontSize: 13, fontWeight: '600' },

  /* Danger */
  deactivateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 8, borderRadius: 12, borderWidth: 1, paddingVertical: 13 },
  deactivateText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },

  /* Version */
  version: { fontSize: 11, textAlign: 'center', marginTop: 16, marginBottom: 4 },

  /* Bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
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
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
});
