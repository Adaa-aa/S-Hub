import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── Types ─── */
type Tab = 'posted' | 'scheduled' | 'cancelled' | 'saved';

interface Job {
  id: number;
  title: string;
  service: string;
  icon: string;
  serviceColor: string;
  worker?: string;
  workerInitials?: string;
  date: string;
  time?: string;
  location: string;
  price: number;
  status: 'open' | 'assigned' | 'scheduled' | 'completed' | 'cancelled';
  saved?: boolean;
}

/* ─── Sample data ─── */
const ALL_JOBS: Job[] = [
  // Posted (open or assigned, not yet scheduled)
  { id: 1, title: 'Fix leaking bathroom pipe', service: 'Plumbing', icon: '🔧', serviceColor: '#006B3F', worker: 'Kofi Mensah', workerInitials: 'KM', date: 'Today', location: 'Speedsaf, Kumasi', price: 450, status: 'assigned' },
  { id: 2, title: 'Install ceiling fan', service: 'Electrical', icon: '⚡', serviceColor: '#F59E0B', date: 'Posted 2 days ago', location: 'Osu, Accra', price: 300, status: 'open' },
  { id: 3, title: 'Paint living room walls', service: 'Painting', icon: '🖌️', serviceColor: '#3B82F6', date: 'Posted 3 days ago', location: 'Tema Station, Accra', price: 600, status: 'open' },

  // Scheduled
  { id: 4, title: 'Kitchen cabinet repair', service: 'Carpentry', icon: '🪚', serviceColor: '#92400E', worker: 'Yaw Boateng', workerInitials: 'YB', date: 'Thu, Jun 19', time: '10:00 AM', location: 'East Legon, Accra', price: 350, status: 'scheduled' },
  { id: 5, title: 'Full house deep cleaning', service: 'Cleaning', icon: '🧹', serviceColor: '#8B5CF6', worker: 'Nana Asante', workerInitials: 'NA', date: 'Sat, Jun 21', time: '8:00 AM', location: 'Ayeduase, Kumasi', price: 250, status: 'scheduled' },
  { id: 6, title: 'Rewire bedroom sockets', service: 'Electrical', icon: '⚡', serviceColor: '#F59E0B', worker: 'Kwame Adjei', workerInitials: 'KA', date: 'Mon, Jun 23', time: '2:00 PM', location: 'Labone, Accra', price: 400, status: 'scheduled' },

  // Cancelled
  { id: 7, title: 'Roof leak repair', service: 'Masonry', icon: '🏗️', serviceColor: '#6B7280', date: 'Cancelled Jun 10', location: 'Ashaiman, Accra', price: 800, status: 'cancelled' },
  { id: 8, title: 'Window frame replacement', service: 'Carpentry', icon: '🪚', serviceColor: '#92400E', date: 'Cancelled Jun 8', location: 'Achimota, Accra', price: 500, status: 'cancelled' },

  // Saved workers / jobs (bookmarked from search)
  { id: 9, title: 'Kofi Mensah', service: 'Plumber', icon: '🔧', serviceColor: '#006B3F', date: 'Saved Jun 12', location: '2.1 km away', price: 450, status: 'open', saved: true },
  { id: 10, title: 'Ama Owusu', service: 'Painter', icon: '🖌️', serviceColor: '#3B82F6', date: 'Saved Jun 11', location: '3.0 km away', price: 300, status: 'open', saved: true },
  { id: 11, title: 'Nana Asante', service: 'Cleaner', icon: '🧹', serviceColor: '#8B5CF6', date: 'Saved Jun 9', location: '1.2 km away', price: 200, status: 'open', saved: true },
];

const TAB_DATA: Record<Tab, Job[]> = {
  posted: ALL_JOBS.filter(j => j.status === 'open' || j.status === 'assigned'),
  scheduled: ALL_JOBS.filter(j => j.status === 'scheduled'),
  cancelled: ALL_JOBS.filter(j => j.status === 'cancelled'),
  saved: ALL_JOBS.filter(j => j.saved),
};

/* ─── Status chip ─── */
function StatusChip({ status }: { status: Job['status'] }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    open: { label: 'Open', bg: '#E6F4EE', color: COLORS.primary },
    assigned: { label: 'Assigned', bg: '#E3F2FD', color: '#1565C0' },
    scheduled: { label: 'Scheduled', bg: '#FFF8E1', color: '#F57F17' },
    completed: { label: 'Completed', bg: '#E8F5E9', color: '#2E7D32' },
    cancelled: { label: 'Cancelled', bg: '#FEECEC', color: COLORS.danger },
  };
  const m = map[status];
  return (
    <View style={[chip.wrap, { backgroundColor: m.bg }]}>
      <Text style={[chip.text, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}
const chip = StyleSheet.create({
  wrap: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  text: { fontSize: 11, fontWeight: '700' },
});

/* ─── Job Card ─── */
function JobCard({ job, tab }: { job: Job; tab: Tab }) {
  const handleCancel = () =>
    Alert.alert('Cancel Job', 'Are you sure you want to cancel this job?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => Alert.alert('Cancelled', 'Your job has been cancelled.') },
    ]);

  const handleUnsave = () =>
    Alert.alert('Remove', 'Remove this worker from saved?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive' },
    ]);

  return (
    <TouchableOpacity
      style={jc.card}
      activeOpacity={0.82}
      onPress={() => router.push(`/worker-profile?id=${job.id}` as any)}
    >
      {/* Top row: icon + title + status */}
      <View style={jc.topRow}>
        <View style={[jc.iconWrap, { backgroundColor: job.serviceColor + '18' }]}>
          <Text style={jc.icon}>{job.icon}</Text>
        </View>
        <View style={jc.topInfo}>
          <Text style={jc.jobTitle} numberOfLines={1}>{job.title}</Text>
          <Text style={jc.service}>{job.service}</Text>
        </View>
        <StatusChip status={job.status} />
      </View>

      {/* Meta row */}
      <View style={jc.metaRow}>
        <View style={jc.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.muted} />
          <Text style={jc.metaText}>{job.date}{job.time ? ` · ${job.time}` : ''}</Text>
        </View>
        <View style={jc.metaItem}>
          <Ionicons name="location-outline" size={13} color={COLORS.muted} />
          <Text style={jc.metaText} numberOfLines={1}>{job.location}</Text>
        </View>
      </View>

      {/* Worker row (if assigned) */}
      {job.worker && (
        <View style={jc.workerRow}>
          <View style={[jc.workerAvatar, { backgroundColor: job.serviceColor + '18' }]}>
            <Text style={[jc.workerInitials, { color: job.serviceColor }]}>{job.workerInitials}</Text>
          </View>
          <Text style={jc.workerName}>{job.worker}</Text>
          <TouchableOpacity style={jc.chatBtn} activeOpacity={0.75} onPress={() => router.push('/messages' as any)}>
            <Ionicons name="chatbubble-outline" size={14} color={COLORS.primary} />
            <Text style={jc.chatBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom row: price + actions */}
      <View style={jc.bottomRow}>
        <View>
          <Text style={jc.priceLabel}>Budget</Text>
          <Text style={jc.price}>GH₵ {job.price}</Text>
        </View>

        <View style={jc.actions}>
          {tab === 'posted' && (
            <>
              <TouchableOpacity style={jc.actionBtnOutline} onPress={handleCancel} activeOpacity={0.75}>
                <Text style={jc.actionBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={jc.actionBtn} activeOpacity={0.8} onPress={() => router.push('/search' as any)}>
                <Text style={jc.actionBtnText}>Find Workers</Text>
              </TouchableOpacity>
            </>
          )}
          {tab === 'scheduled' && (
            <>
              <TouchableOpacity style={jc.actionBtnOutline} onPress={handleCancel} activeOpacity={0.75}>
                <Text style={jc.actionBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={jc.actionBtn} activeOpacity={0.8} onPress={() => Alert.alert('Reschedule', 'Date picker coming soon.')}>
                <Text style={jc.actionBtnText}>Reschedule</Text>
              </TouchableOpacity>
            </>
          )}
          {tab === 'cancelled' && (
            <TouchableOpacity style={jc.actionBtn} activeOpacity={0.8} onPress={() => router.push('/post-job' as any)}>
              <Text style={jc.actionBtnText}>Re-post Job</Text>
            </TouchableOpacity>
          )}
          {tab === 'saved' && (
            <>
              <TouchableOpacity style={jc.actionBtnOutline} onPress={handleUnsave} activeOpacity={0.75}>
                <Text style={jc.actionBtnOutlineText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity style={jc.actionBtn} activeOpacity={0.8} onPress={() => router.push('/post-job' as any)}>
                <Text style={jc.actionBtnText}>Hire</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const jc = StyleSheet.create({
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EDEDED', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icon: { fontSize: 22 },
  topInfo: { flex: 1 },
  jobTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  service: { fontSize: 12, color: COLORS.muted },
  metaRow: { gap: 5, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: COLORS.muted, flex: 1 },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8F8F8', borderRadius: 10, padding: 10, marginBottom: 10 },
  workerAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  workerInitials: { fontSize: 11, fontWeight: '800' },
  workerName: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  chatBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F2F2F2', paddingTop: 10 },
  priceLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '500' },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionBtnOutline: { borderWidth: 1.5, borderColor: '#E0E0E0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  actionBtnOutlineText: { fontSize: 12, fontWeight: '600', color: COLORS.muted },
});

/* ─── Empty state ─── */
function EmptyState({ tab }: { tab: Tab }) {
  const map: Record<Tab, { icon: string; title: string; sub: string; cta?: string; ctaRoute?: string }> = {
    posted: { icon: '📋', title: 'No active jobs', sub: 'Post a job to find skilled workers near you.', cta: 'Post a Job', ctaRoute: '/post-job' },
    scheduled: { icon: '📅', title: 'Nothing scheduled', sub: 'Accepted jobs with a set date will appear here.', cta: 'Browse Workers', ctaRoute: '/search' },
    cancelled: { icon: '❌', title: 'No cancelled jobs', sub: 'Jobs you cancel will appear here.', },
    saved: { icon: '🔖', title: 'No saved workers', sub: 'Save workers from search to quickly book them later.', cta: 'Find Workers', ctaRoute: '/search' },
  };
  const m = map[tab];
  return (
    <View style={es.wrap}>
      <Text style={es.icon}>{m.icon}</Text>
      <Text style={es.title}>{m.title}</Text>
      <Text style={es.sub}>{m.sub}</Text>
      {m.cta && (
        <TouchableOpacity style={es.cta} onPress={() => router.push(m.ctaRoute! as any)} activeOpacity={0.85}>
          <Text style={es.ctaText}>{m.cta}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const es = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  icon: { fontSize: 52, marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  sub: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  cta: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

/* ─── MAIN SCREEN ─── */
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('posted');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'posted', label: 'Posted' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'saved', label: 'Saved' },
  ];

  const jobs = TAB_DATA[activeTab];

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>My Jobs</Text>
        <TouchableOpacity
          style={s.postBtn}
          onPress={() => router.push('/post-job' as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.postBtnText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* ── SUMMARY STRIP ── */}
      <View style={s.summaryStrip}>
        {[
          { label: 'Posted', count: TAB_DATA.posted.length, tab: 'posted' as Tab },
          { label: 'Scheduled', count: TAB_DATA.scheduled.length, tab: 'scheduled' as Tab },
          { label: 'Cancelled', count: TAB_DATA.cancelled.length, tab: 'cancelled' as Tab },
          { label: 'Saved', count: TAB_DATA.saved.length, tab: 'saved' as Tab },
        ].map((item, i, arr) => (
          <TouchableOpacity
            key={item.tab}
            style={[s.summaryItem, i < arr.length - 1 && s.summaryBorder, activeTab === item.tab && s.summaryItemActive]}
            onPress={() => setActiveTab(item.tab)}
            activeOpacity={0.75}
          >
            <Text style={[s.summaryCount, activeTab === item.tab && s.summaryCountActive]}>{item.count}</Text>
            <Text style={s.summaryLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── TAB BAR ── */}
      <View style={s.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, activeTab === tab.key && s.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
              {tab.label}
            </Text>
            {TAB_DATA[tab.key].length > 0 && (
              <View style={[s.tabBadge, activeTab === tab.key && s.tabBadgeActive]}>
                <Text style={[s.tabBadgeText, activeTab === tab.key && s.tabBadgeTextActive]}>
                  {TAB_DATA[tab.key].length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── JOB LIST ── */}
      {jobs.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <JobCard job={item} tab={activeTab} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.list}
        />
      )}

      {/* ── BOTTOM NAV ── */}
      <View style={s.bottomNav}>
        {[
          { icon: 'home-outline', iconActive: 'home', label: 'Home', route: '/(tabs)/home', active: false },
          { icon: 'briefcase-outline', iconActive: 'briefcase', label: 'Jobs', route: '/bookings', active: true },
          { icon: 'add', iconActive: 'add', label: '', route: '/post-job', center: true },
          { icon: 'chatbubble-outline', iconActive: 'chatbubble', label: 'Messages', route: '/messages', active: false },
          { icon: 'person-outline', iconActive: 'person', label: 'Profile', route: '/profile', active: false },
        ].map(tab =>
          (tab as any).center ? (
            <TouchableOpacity key="center" style={s.centerBtn} activeOpacity={0.85} onPress={() => router.push(tab.route as any)}>
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={tab.label} style={s.navTab} activeOpacity={0.7} onPress={() => router.push(tab.route as any)}>
              <Ionicons name={tab.active ? (tab.iconActive as any) : (tab.icon as any)} size={22} color={tab.active ? COLORS.primary : COLORS.muted} />
              <Text style={[s.navLabel, tab.active && s.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F0' },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  postBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* Summary strip */
  summaryStrip: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  summaryItemActive: { borderBottomWidth: 0 },
  summaryBorder: { borderRightWidth: 1, borderColor: '#F0F0F0' },
  summaryCount: { fontSize: 18, fontWeight: '800', color: COLORS.muted, marginBottom: 2 },
  summaryCountActive: { color: COLORS.primary },
  summaryLabel: { fontSize: 10, color: COLORS.muted, fontWeight: '500' },

  /* Tab bar */
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#EBEBEB', paddingHorizontal: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 12, borderBottomWidth: 2.5, borderColor: 'transparent' },
  tabActive: { borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  tabBadge: { backgroundColor: '#E8E8E8', borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeActive: { backgroundColor: COLORS.primary + '20' },
  tabBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.muted },
  tabBadgeTextActive: { color: COLORS.primary },

  /* List */
  list: { paddingTop: 14, paddingBottom: 110 },

  /* Bottom nav */
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ECECEC', flexDirection: 'row', alignItems: 'center', paddingBottom: 22, paddingTop: 10, paddingHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10 },
  navTab: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, fontWeight: '500', color: COLORS.muted },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  centerBtn: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.45, shadowRadius: 10, elevation: 8 },
});
