import { COLORS } from '@/constants/theme';
import { useThemeColors } from '@/context/ThemeContext';
import { ws, wvs, wms } from '@/lib/scaling';
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
import RequireVerifiedWorker from '@/components/RequireVerifiedWorker';

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
            <Ionicons name="pencil-outline" size={wms(14)} color={COLORS.primary} />
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
  wrap: { borderRadius: ws(16), borderWidth: ws(1), marginBottom: wvs(16), overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(16), paddingVertical: wvs(14) },
  title: { fontSize: wms(14), fontWeight: '800' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: ws(4), backgroundColor: COLORS.primary + '14', borderRadius: ws(8), paddingHorizontal: ws(10), paddingVertical: wvs(5) },
  editText: { fontSize: wms(12), fontWeight: '700', color: COLORS.primary },
  divider: { height: wvs(1) },
});

/* ─── Info row inside a card ─── */
function InfoRow({ icon, label, value, T }: { icon: string; label: string; value: string; T: any }) {
  return (
    <View style={ir.row}>
      <View style={[ir.icon, { backgroundColor: COLORS.primaryLight }]}>
        <Ionicons name={icon as any} size={wms(15)} color={COLORS.primary} />
      </View>
      <Text style={[ir.label, { color: T.subText }]}>{label}</Text>
      <Text style={[ir.value, { color: T.text }]}>{value}</Text>
    </View>
  );
}
const ir = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: ws(12), paddingHorizontal: ws(16), paddingVertical: wvs(12) },
  icon: { width: ws(30), height: ws(30), borderRadius: ws(8), alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: wms(13), fontWeight: '500' },
  value: { fontSize: wms(13), fontWeight: '700' },
});

/* ─── Divider ─── */
function CardDivider({ T }: { T: any }) {
  return <View style={{ height: wvs(1), backgroundColor: T.divider, marginHorizontal: ws(16) }} />;
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

  const statusColor = (st: string) => st === 'completed' ? '#22C55E' : st === 'pending' ? '#F59E0B' : COLORS.danger;
  const statusLabel = (st: string) => st.charAt(0).toUpperCase() + st.slice(1);

  return (
    <RequireVerifiedWorker>
    <SafeAreaView style={[s.safe, { backgroundColor: T.bg }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── HEADER ── */}
      <View style={[s.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={wms(22)} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Worker Profile</Text>
        <TouchableOpacity style={s.backBtn} onPress={handleShare} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={wms(20)} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={s.pageInner}>
      {/* ══ MODE SWITCHER ══ */}
      <View style={[s.modeStrip, { backgroundColor: T.card, borderColor: T.border }]}>
        <View style={s.modeLeft}>
          <Ionicons name="hammer-outline" size={wms(14)} color={COLORS.primary} />
          <Text style={[s.modeText, { color: T.text }]}>Working as a Worker</Text>
        </View>
        <TouchableOpacity
          style={s.switchBtn}
          onPress={() => router.replace('/home' as any)}
          activeOpacity={0.8}
        >
          <Text style={s.switchBtnText}>Switch to Customer View</Text>
          <Ionicons name="swap-horizontal" size={wms(14)} color={COLORS.primary} />
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
              <Ionicons name="location-outline" size={wms(13)} color={T.subText} />
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
                {p.verified && <Ionicons name="checkmark-circle" size={wms(18)} color="#fff" />}
              </View>
              <Text style={s.heroService}>{p.service}</Text>
              <View style={s.heroMeta}>
                <Ionicons name="star" size={wms(12)} color="#F59E0B" />
                <Text style={s.heroMetaText}>{p.rating}  ·  {p.jobs} jobs</Text>
              </View>
              <View style={s.heroMeta}>
                <Ionicons name="location-outline" size={wms(12)} color="rgba(255,255,255,0.8)" />
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
              <Ionicons name={stat.icon as any} size={wms(14)} color={COLORS.primary} style={{ marginBottom: wvs(4) }} />
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
              <Ionicons name="alert-circle-outline" size={wms(14)} color={COLORS.accent} />
              <Text style={s.completenessHintText}>Add profile photo & bank details to reach 100%</Text>
              <Ionicons name="chevron-forward" size={wms(14)} color={COLORS.accent} />
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
              <Ionicons name="add" size={wms(14)} color={COLORS.primary} />
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
                <Ionicons name={day.on ? 'checkmark' : 'close'} size={wms(10)} color={day.on ? '#fff' : T.subText} />
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
            <Ionicons name="notifications-outline" size={wms(18)} color={COLORS.primary} />
            <Text style={[s.prefLabel, { color: T.text }]}>Job alerts & messages</Text>
            <Switch
              value={notifs}
              onValueChange={setNotifs}
              trackColor={{ false: T.border, true: COLORS.primary }}
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
          <Ionicons name="power-outline" size={wms(16)} color={COLORS.danger} />
          <Text style={s.deactivateText}>Deactivate Worker Account</Text>
        </TouchableOpacity>

        <Text style={[s.version, { color: T.subText }]}>S-Hub Worker v1.0.0 · Made in Ghana 🇬🇭</Text>
      </ScrollView>
      </View>

      {/* ── BOTTOM NAV ── */}
      <View style={[s.bottomNav, { backgroundColor: T.navBg, borderColor: T.navBorder }]}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/worker-dashboard', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: false },
          { icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/worker-messages', active: false },
          { icon: 'person', iconActive: 'person', label: 'Profile', route: '/worker-setup', active: true },
        ].map(tab => (
          <TouchableOpacity
            key={tab.label}
            style={s.navTab}
            activeOpacity={0.7}
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={(tab.active ? tab.iconActive : tab.icon) as any}
              size={wms(22)}
              color={tab.active ? COLORS.primary : T.subText}
            />
            <Text style={[s.navLabel, { color: T.subText }, tab.active && s.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
    </RequireVerifiedWorker>
  );
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  safe: { flex: 1 },
  pageInner: { flex: 1, width: '100%', maxWidth: ws(544), alignSelf: 'center' },
  scroll: { paddingBottom: wvs(110) },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(14), paddingVertical: wvs(12) },
  backBtn: { width: ws(38), height: ws(38), alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: wms(16), fontWeight: '700', color: '#fff' },

  /* Mode switcher */
  modeStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(16), paddingVertical: wvs(10), borderBottomWidth: ws(1) },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: ws(6) },
  modeText: { fontSize: wms(12), fontWeight: '600' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: ws(5), backgroundColor: COLORS.primary + '14', borderRadius: ws(8), paddingHorizontal: ws(10), paddingVertical: wvs(6) },
  switchBtnText: { fontSize: wms(11), fontWeight: '700', color: COLORS.primary },

  /* Incoming job request */
  requestCard: { borderRadius: ws(16), borderWidth: ws(1.5), marginHorizontal: ws(16), marginTop: wvs(14), marginBottom: wvs(4), padding: ws(14) },
  requestBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: wvs(12) },
  requestBadge: { flexDirection: 'row', alignItems: 'center', gap: ws(6) },
  requestDot: { width: ws(7), height: ws(7), borderRadius: ws(4), backgroundColor: '#22C55E' },
  requestBadgeText: { fontSize: wms(11), fontWeight: '800', color: '#22C55E', letterSpacing: wms(0.5) },
  requestDistance: { fontSize: wms(11), fontWeight: '600' },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: ws(12), marginBottom: wvs(10) },
  requestAvatar: { width: ws(42), height: ws(42), borderRadius: ws(21), alignItems: 'center', justifyContent: 'center' },
  requestAvatarText: { fontSize: wms(15), fontWeight: '800' },
  requestClient: { fontSize: wms(14), fontWeight: '800', marginBottom: wvs(2) },
  requestService: { fontSize: wms(12), fontWeight: '500' },
  requestPrice: { fontSize: wms(16), fontWeight: '900' },
  requestLocRow: { flexDirection: 'row', alignItems: 'center', gap: ws(5), marginBottom: wvs(6) },
  requestLocText: { fontSize: wms(12) },
  requestNote: { fontSize: wms(12), lineHeight: wms(17), marginBottom: wvs(14) },
  requestActions: { flexDirection: 'row', gap: ws(10) },
  declineBtn: { flex: 1, alignItems: 'center', paddingVertical: wvs(12), borderRadius: ws(12), borderWidth: ws(1.5) },
  declineText: { fontSize: wms(13), fontWeight: '700' },
  acceptBtn: { flex: 1.4, alignItems: 'center', paddingVertical: wvs(12), borderRadius: ws(12) },
  acceptText: { fontSize: wms(13), fontWeight: '800', color: '#fff' },

  /* Hero card */
  heroCard: { backgroundColor: COLORS.primary, paddingHorizontal: ws(16), paddingBottom: wvs(20) },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: ws(14), marginBottom: wvs(16) },
  avatarWrap: { position: 'relative' },
  avatar: { width: ws(80), height: ws(80), borderRadius: ws(40), backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: ws(2.5), borderColor: 'rgba(255,255,255,0.5)' },
  avatarInitials: { fontSize: wms(28), fontWeight: '900', color: '#fff' },
  onlineDot: { position: 'absolute', bottom: wvs(2), right: ws(2), width: ws(16), height: ws(16), borderRadius: ws(8), borderWidth: ws(2.5), borderColor: '#fff' },
  heroInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: ws(6), marginBottom: wvs(3) },
  heroName: { fontSize: wms(19), fontWeight: '800', color: '#fff' },
  heroService: { fontSize: wms(13), color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: wvs(5) },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: ws(5), marginBottom: wvs(2) },
  heroMetaText: { fontSize: wms(12), color: 'rgba(255,255,255,0.8)' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: ws(12), paddingHorizontal: ws(14), paddingVertical: wvs(10) },
  onlineLeft: { flexDirection: 'row', alignItems: 'center', gap: ws(8) },
  onlineIndicator: { width: ws(9), height: ws(9), borderRadius: ws(5) },
  onlineLabel: { fontSize: wms(13), fontWeight: '600', color: '#fff' },

  /* Stats strip */
  statsStrip: { flexDirection: 'row', borderBottomWidth: ws(1), marginBottom: wvs(16) },
  stat: { flex: 1, alignItems: 'center', paddingVertical: wvs(14) },
  statBorder: { borderRightWidth: ws(1) },
  statValue: { fontSize: wms(16), fontWeight: '800', marginBottom: wvs(1) },
  statLabel: { fontSize: wms(10), fontWeight: '500' },

  /* Profile completeness */
  completenessCard: { borderRadius: ws(16), borderWidth: ws(1), padding: ws(16), marginHorizontal: ws(16), marginBottom: wvs(16) },
  completenessTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: wvs(10) },
  completenessTitle: { fontSize: wms(14), fontWeight: '800', marginBottom: wvs(2) },
  completenessSub: { fontSize: wms(11) },
  completenessPct: { fontSize: wms(22), fontWeight: '900' },
  completenessTrack: { height: wvs(8), borderRadius: ws(4), overflow: 'hidden', marginBottom: wvs(8) },
  completenessFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: ws(4) },
  completenessHint: { flexDirection: 'row', alignItems: 'center', gap: ws(6), backgroundColor: COLORS.accent + '18', borderRadius: ws(8), padding: ws(10) },
  completenessHintText: { flex: 1, fontSize: wms(11), color: COLORS.accent, fontWeight: '500' },

  /* Section heading */
  sectionHeading: { fontSize: wms(14), fontWeight: '800', paddingHorizontal: ws(16), marginBottom: wvs(10), marginTop: wvs(4) },

  /* Skills */
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: ws(8), padding: ws(14) },
  skillChip: { borderRadius: ws(10), borderWidth: ws(1), paddingHorizontal: ws(12), paddingVertical: wvs(7) },
  skillText: { fontSize: wms(12), fontWeight: '700' },
  skillChipAdd: { flexDirection: 'row', alignItems: 'center', gap: ws(4), borderRadius: ws(10), borderWidth: ws(1.5), borderStyle: 'dashed', paddingHorizontal: ws(12), paddingVertical: wvs(7) },
  skillAddText: { fontSize: wms(12), fontWeight: '700' },

  /* Availability */
  availGrid: { flexDirection: 'row', gap: ws(6), padding: ws(14), justifyContent: 'space-between' },
  availCell: { flex: 1, alignItems: 'center', paddingVertical: wvs(8), borderRadius: ws(10), borderWidth: ws(1.5), gap: ws(3) },
  availDay: { fontSize: wms(10), fontWeight: '700' },

  /* Recent jobs */
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: ws(16), marginBottom: wvs(10), marginTop: wvs(4) },
  seeAll: { fontSize: wms(13), fontWeight: '700', color: COLORS.primary },
  jobCard: { flexDirection: 'row', alignItems: 'center', gap: ws(12), marginHorizontal: ws(16), marginBottom: wvs(10), borderRadius: ws(14), borderWidth: ws(1), padding: ws(14) },
  jobAvatar: { width: ws(40), height: ws(40), borderRadius: ws(20), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  jobInitials: { fontSize: wms(14), fontWeight: '800' },
  jobInfo: { flex: 1 },
  jobClient: { fontSize: wms(13), fontWeight: '700', marginBottom: wvs(2) },
  jobService: { fontSize: wms(12) },
  jobRight: { alignItems: 'flex-end', gap: ws(4) },
  jobAmount: { fontSize: wms(13), fontWeight: '800' },
  jobStatusBadge: { borderRadius: ws(6), paddingHorizontal: ws(8), paddingVertical: wvs(3) },
  jobStatusText: { fontSize: wms(10), fontWeight: '700' },
  jobDate: { fontSize: wms(10) },

  /* Notifications pref */
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: ws(12), paddingHorizontal: ws(16), paddingVertical: wvs(14) },
  prefLabel: { flex: 1, fontSize: wms(13), fontWeight: '600' },

  /* Danger */
  deactivateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ws(8), marginHorizontal: ws(16), marginTop: wvs(8), borderRadius: ws(12), borderWidth: ws(1), paddingVertical: wvs(13) },
  deactivateText: { fontSize: wms(13), fontWeight: '700', color: COLORS.danger },

  /* Version */
  version: { fontSize: wms(11), textAlign: 'center', marginTop: wvs(16), marginBottom: wvs(4) },

  /* Bottom nav */
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: ws(1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: wvs(22),
    paddingTop: wvs(10),
    paddingHorizontal: ws(10),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  navTab: { flex: 1, alignItems: 'center', gap: ws(3) },
  navLabel: { fontSize: wms(10), fontWeight: '500' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
});